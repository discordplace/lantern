const getCommandName = require('@/utils/bot/getCommandName');
const Discord = require('discord.js');

module.exports = async interaction => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    addPrototypes(interaction);

    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.error('Command not found. Please contact the developer.');

    const { name: commandName, subcommand, group } = getCommandName(interaction);
    const commandData = command.data[commandName];
    if (!commandData) return interaction.error('Command data not found. Please contact the developer.');

    logger.bot(`User "${interaction.user.username}" (${interaction.user.id}) executed command "${commandName}" in guild "${interaction.guild.name}" (${interaction.guild.id})`);

    return commandData.execute.command(interaction, { subcommand, group }); 
  }
};

function addPrototypes(interaction) {
  /*
    We're adding the following prototypes to the interaction object:
    - interaction.success(content: string, options: object): Promise<void>
    - interaction.error(content: string, options: object): Promise<void>

    These prototypes will allow us to easily send success and error messages to the user in commands 
    without having to repeat the same code over and over again in each command file.
  */

  interaction.success = async (content, options = {}) => {
    const embeds = [
      new Discord.EmbedBuilder()
        .setColor('#5865f2')
        .setDescription(`### Success\n${content}`)
    ];

    interaction[interaction.deferred || interaction.replied ? 'followUp' : 'reply']({
      embeds,
      ephemeral: options?.ephemeral || false,
      ...Object.keys(options)
        .filter(option => option !== 'ephemeral')
        .reduce((acc, option) => ({ ...acc, [option]: options[option] }), {})
    });
  };

  interaction.error = async (content, options = {}) => {
    const embeds = [
      new Discord.EmbedBuilder()
        .setColor('#eb3d47')
        .setDescription(`### Error\n${content}`)
    ];

    interaction[interaction.deferred || interaction.replied ? 'followUp' : 'reply']({
      embeds,
      ephemeral: options?.ephemeral || false,
      ...Object.keys(options)
        .filter(option => option !== 'ephemeral')
        .reduce((acc, option) => ({ ...acc, [option]: options[option] }), {})
    });
  };
}