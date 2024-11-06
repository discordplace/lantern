import * as Discord from 'discord.js';
import type { CommandType } from '@/src/types';
import EvaluateResult from '@/models/EvaulateResult';
import generateUniqueId from '@/src/lib/utils/generateUniqueId';
import evaluateCode from '@/bot/commands/utils/evaluateCode';

export default {
  metadata: {
    global: false
  },
  json: new Discord.SlashCommandBuilder()
    .setName('eval')
    .setDescription('Runs a code snippet for the bot developer.'),
  data: {
    'eval': {
      restrictions: {
        baseGuildOnly: true,
        users: {
          allow: ['957840712404193290']
        }
      },
      execute: {
        command: async interaction => {
          await interaction.deferReply();

          await interaction.followUp({ content: 'Write the code snippet to run.' });

          const code = await collectCode(interaction);
          if (!code) return interaction.editReply({ content: 'Code snippet to run not found.', components: [] });

          const { result, hasError, id } = await executeCode(code);
          const embeds = createResultEmbed(code, result, hasError);
          const components = createResultComponents(id, interaction.user.id);

          await saveResult({ id, result, hasError, code });

          return interaction.editReply({
            embeds,
            components,
            content: null
          });
        },
        component: {
          'deleteEvalResultMessage': handleDelete,
          'repeatEval': handleRepeat
        }
      }
    }
  }
} satisfies CommandType;

async function collectCode(interaction: Discord.CommandInteraction) {
  const filter = (message: Discord.Message) => message.author.id === interaction.user.id;

  if (!interaction.channel?.isSendable()) return;

  const collected = await interaction.channel.awaitMessages({
    filter,
    time: 60000,
    max: 1
  }).catch(() => null);

  return collected?.first()?.content;
}

async function executeCode(code: string) {
  const id = generateUniqueId();
  const { result, hasError } = await evaluateCode(code);

  return {
    result,
    hasError,
    id
  };
}

function createResultEmbed(code: string, result: string, hasError: boolean) {
  return [
    new Discord.EmbedBuilder()
      .setColor(hasError ? '#ff0040' : '#0063ff')
      .setFields([{ name: 'Executed Code', value: `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\`` }])
      .setDescription(`### ${hasError ? 'Error' : 'Successful'}\n\`\`\`js\n${String(result).slice(0, 4000)}\n\`\`\``)
  ];
}

function createResultComponents(id: string, userId: string) {
  return [
    new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId(`deleteEvalResultMessage:${id}:${userId}`)
          .setLabel('Delete')
          .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
          .setCustomId(`repeatEval:${id}:${userId}`)
          .setLabel('Run Again')
          .setStyle(Discord.ButtonStyle.Secondary)
      )
  ];
}

async function saveResult({ id, result, hasError, code }: { id: string, result: string, hasError: boolean, code: string }) {
  await new EvaluateResult({
    id,
    result,
    hasError,
    executedCode: code
  }).save();
}

async function handleDelete(interaction: Discord.MessageComponentInteraction, { args }: { args: string[] }) {
  const [id, userId] = args;
  if (interaction.user.id !== userId) return;

  await EvaluateResult.deleteOne({ id });

  return interaction.message.delete();
}

async function handleRepeat(interaction: Discord.MessageComponentInteraction, { args }: { args: string[] }) {
  const [id, userId] = args;
  if (interaction.user.id !== userId) return;

  const data = await EvaluateResult.findOne({ id });
  if (!data) return interaction.reply({ content: 'Kod parçası bulunamadı.' });

  const { result, hasError } = await evaluateCode(data.executedCode);

  const embeds = createResultEmbed(data.executedCode, result, hasError);

  embeds[0]!.addFields({
    name: 'Tekrar Çalıştırıldı',
    value: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
  });

  return interaction.update({ embeds });
}