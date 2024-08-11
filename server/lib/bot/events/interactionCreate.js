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

    await commandData.execute.command(interaction, { subcommand, group });
    
    if (interaction.guild) logger.bot(`User "${interaction.user.username}" (${interaction.user.id}) executed command "${commandName}" in guild "${interaction.guild.name}" (${interaction.guild.id}) which takes ${Date.now() - interaction.createdTimestamp} ms to execute.`);
    else logger.bot(`User "${interaction.user.username}" (${interaction.user.id}) executed command "${commandName}" in DMs which takes ${Date.now() - interaction.createdTimestamp} ms to execute.`);
  }

  if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
    addPrototypes(interaction);

    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.respondAutocomplete([]);

    const { name: commandName, subcommand, group } = getCommandName(interaction);
    const commandData = command.data[commandName];
    if (!commandData?.execute?.autocomplete) return interaction.respondAutocomplete([]);

    return commandData.execute.autocomplete(interaction, { subcommand, group });
  }
};

function addPrototypes(interaction) {
  /*
    We're adding the following prototypes to the interaction object:
    - interaction.success(content: string, options: object): Promise<void>
    - interaction.error(content: string, options: object): Promise<void>
    - interaction.respondAutocomplete(data: object[]): Promise<void>

    These prototypes will allow us to easily send success, error, and autocomplete responses in commands 
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

  interaction.respondAutocomplete = async data => {
    if (data.length <= 0) return interaction.respond([
      {
        name: 'No results found.',
        value: '7922e127-d29a-431e-8b6d-9d4901e77171'
      }
    ]);

    // We're filtering the data based on the user's input.
    const filteredData = data.filter(({ name }) => {
      if (interaction.options.getFocused()) return String(name).toLowerCase().includes(interaction.options.getFocused().toLowerCase());
      return true;
    });

    // Discord only allows us to send a maximum of 25 options in an autocomplete response.
    interaction.respond(filteredData.slice(0, 25));
  };
}