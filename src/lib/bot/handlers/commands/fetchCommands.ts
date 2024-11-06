import { lstatSync, readdirSync, existsSync } from 'node:fs';
import * as Discord from 'discord.js';

import type { CommandType } from '@/src/types';

async function fetchCommands(): Promise<Discord.Collection<string, CommandType>> {
  if (!existsSync('./src/lib/bot/commands/')) return new Discord.Collection<string, CommandType>();

  const commandsFolders = readdirSync('./src/lib/bot/commands');
  if (!commandsFolders.length) return new Discord.Collection<string, CommandType>();

  const commandsCollection = new Discord.Collection<string, CommandType>();

  async function readRecursive(folderOrFile: string) {
    if (lstatSync(`./src/lib/bot/commands/${folderOrFile}`).isDirectory()) {
      const files = readdirSync(`./src/lib/bot/commands/${folderOrFile}`);
      for (const file of files) await readRecursive(`${folderOrFile}/${file}`);
    } else {
      const commandModule = await import(`../../commands/${folderOrFile}`);
      const command: CommandType = commandModule.default;

      if (!command.json) return;

      commandsCollection.set(command.json.name, command);
    }
  }

  await Promise.all(commandsFolders.map(folderOrFile => readRecursive(folderOrFile)));

  return commandsCollection;
}

export default fetchCommands;