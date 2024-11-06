import * as Discord from 'discord.js';
import getCommandName from '@/src/lib/utils/bot/getCommandName';
import Storage from '@/models/Storage';
import type { CommandType, EventType } from '@/src/types';
import createUserData from '@/utils/bot/createUserData';

export default {
  name: 'interactionCreate',
  execute: async interaction => {
    addPrototypes(interaction);

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return interaction.error('Unknown command.');

      const commandNameData = getCommandName(interaction);
      if (!commandNameData) return interaction.error('Failed to get the command name.');

      const commandData = command.data[commandNameData.name];
      if (!commandData) return interaction.error('Failed to get the command data.');

      const canUseThisCommand = permissionCheck(interaction, commandData);
      if (canUseThisCommand !== true) return interaction.error('Missing permissions.');

      await commandData.execute.command(interaction, { subcommand: commandNameData.subcommand, group: commandNameData.group });

      if (interaction.guild) logger.log('bot', `User "${interaction.user.username}" (${interaction.user.id}) executed command "${commandNameData.name}" in guild "${interaction.guild.name}" (${interaction.guild.id}) which takes ${Date.now() - interaction.createdTimestamp} ms to execute.`);
      else logger.log('bot', `User "${interaction.user.username}" (${interaction.user.id}) executed command "${commandNameData.name}" in DMs which takes ${Date.now() - interaction.createdTimestamp} ms to execute.`);
    }

    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      const commandNameData = getCommandName(interaction);
      if (!commandNameData) return;

      const commandData = command.data[commandNameData.name];
      if (!commandData?.execute?.autocomplete) return;

      return interaction.respond(
        await commandData.execute.autocomplete(interaction, { subcommand: commandNameData.subcommand, group: commandNameData.group })
      );
    }

    if (interaction.isMessageComponent()) {
      const commandId = interaction.customId.includes(':') ? interaction.customId.split(':')[0] : interaction.customId;
      if (!commandId) return;

      const commandFound = client.commands.find((command: CommandType) => Object.keys(command.data).some(commandName => command.data?.[commandName]?.execute?.component?.[commandId])) as CommandType;
      if (commandFound) {
        const execute = Object.entries(commandFound.data).find(([, { execute }]) => execute.component?.[commandId])?.[1].execute.component?.[commandId];
        if (!execute) return;

        const args = interaction.customId.split(':').slice(1);

        return execute(interaction, { args });
      }

      // "My User Data" Button
      if (interaction.customId === 'my-user-data') {
        const storage = await Storage.findOne({ userId: interaction.user.id });
        const data = createUserData(interaction.user.id, storage?.kv || {});

        const embed = new Discord.EmbedBuilder()
          .setFooter({ text: `${interaction.user.displayName}'s data`, iconURL: interaction.user.displayAvatarURL() })
          .setColor('#adadad')
          .setDescription(`\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``);

        interaction.reply({ embeds: [embed], ephemeral: true });

        return;
      }
    }

    if (interaction.isModalSubmit()) {
      const commandId = interaction.customId.includes(':') ? interaction.customId.split(':')[0] : interaction.customId;
      if (!commandId) return;

      const commandFound = client.commands.find((command: CommandType) => Object.keys(command.data).some(commandName => command.data?.[commandName]?.execute?.modal?.[commandId])) as CommandType;
      if (!commandFound) return;

      const execute = Object.entries(commandFound.data).find(([, { execute }]) => execute.modal?.[commandId])?.[1].execute.modal?.[commandId];
      if (!execute) return;

      const args = interaction.customId.split(':').slice(1);

      return execute(interaction, { args });
    }
  }
} satisfies EventType;

function addPrototypes(interaction: Discord.BaseInteraction) {
  /*
    We're adding the following prototypes to the interaction object:
    - interaction.success(content: string, options: Discord.InteractionReplyOptions): Promise<void>
    - interaction.error(content: string, options: Discord.InteractionReplyOptions): Promise<void>

    These prototypes will allow us to easily send success and error responses in commands
    without having to repeat the same code over and over again in each command file.
  */

  if (interaction.isCommand()) {
    interaction.success = async (content: string, options: Discord.InteractionReplyOptions) => {
      if (interaction.deferred || interaction.replied) interaction.followUp({ content, ...options });
      else interaction.reply({ content, ...options });
    };

    interaction.error = async (content: string, options: Discord.InteractionReplyOptions) => {
      if (interaction.deferred || interaction.replied) interaction.followUp({ content, ...options });
      else interaction.reply({ content, ...options });
    };
  }
}

function permissionCheck(interaction: Discord.BaseInteraction, commandData: CommandType['data'][string]) {
  if (config.bypass_command_permissions_check.includes(interaction.user.id)) return true;

  if (!commandData.restrictions || !Object.keys(commandData.restrictions).length) return true;

  // Check if the command should only be used in a guild
  if (commandData.restrictions.guildOnly && !interaction.guild) return false;

  // Check if the command should only be used in the base guild
  if (commandData.restrictions.baseGuildOnly && interaction.guild?.id !== config.base_guild_id) return false;

  // Check if the command can only be used by the owner of the guild
  if (commandData.restrictions.ownerOnly && interaction.user.id !== interaction.guild?.ownerId) return false;

  const userRestrictions = commandData.restrictions.users;
  if (userRestrictions?.deny?.includes(interaction.user.id)) return false;

  const member = interaction.member as Discord.GuildMember;

  const findRole = (role: string | number) => {
    if (typeof role === 'number') return member.roles.cache.has(role as unknown as string);

    return member.roles.cache.some(({ name }) => name.toLowerCase() === role.toLowerCase());
  };

  const roleRestrictions = commandData.restrictions.roles;
  if (roleRestrictions?.deny?.some(findRole)) return false;

  const permissionsRestrictions = commandData.restrictions.permissions;
  if (permissionsRestrictions?.deny?.some(permission => member.permissions.has(permission))) return false;

  const allowedById = userRestrictions?.allow?.includes(interaction.user.id);
  const allowedByRole = roleRestrictions?.allow?.some(findRole);
  const allowedByPermission = permissionsRestrictions?.allow?.some(permission => member.permissions.has(permission));

  if (!allowedById && !allowedByRole && !allowedByPermission) return false;

  return true;
}