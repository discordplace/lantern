import * as Discord from 'discord.js';

import type { CommandType } from '@/src/types';

async function registerCommands({ token, commands, application_id, base_guild_id }: { token: string, commands: Discord.Collection<string, CommandType>, application_id: string, base_guild_id: string }) {
  const rest = new Discord.REST({ version: '10' }).setToken(token);

  try {
    logger.info(`Started reloading application (/) commands. (${commands.size} commands)`);

    // Register global commands
    await rest.put(
      Discord.Routes.applicationCommands(application_id),
      {
        body: commands
          .filter(command => command.metadata?.global)
          .map(command => {
            if (command instanceof Discord.SlashCommandBuilder) return command.toJSON();

            return command.json;
          })
      }
    );

    // Register guild commands
    await rest.put(
      Discord.Routes.applicationGuildCommands(application_id, base_guild_id),
      {
        body: commands
          .filter(command => !command.metadata?.global)
          .map(command => {
            if (command instanceof Discord.SlashCommandBuilder) return command.toJSON();

            return command.json;
          })
      }
    );

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Failed to reload application (/) commands:');
    logger.error(error);
  }
}

export default registerCommands;