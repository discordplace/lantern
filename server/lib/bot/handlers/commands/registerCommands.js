const Discord = require('discord.js');

async function registerCommands({ token, commands, applicationId }) {
  const rest = new Discord.REST({ version: '10' }).setToken(token);

  try {
    logger.bot(`Started reloading application (/) commands. (${commands.size} commands)`);

    await rest.put(
      Discord.Routes.applicationCommands(applicationId),
      { body: commands.map(command => command.json.toJSON?.() ?? command.json) }
    );

    logger.bot('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Failed to reload application (/) commands:', error);
  }
}

module.exports = registerCommands;