import { lstatSync, readdirSync, existsSync } from 'node:fs';
import * as Discord from 'discord.js';

import type { CronType } from '@/src/types';

async function fetchCrons(): Promise<Discord.Collection<string, CronType>> {
  if (!existsSync('./src/lib/bot/crons/')) return new Discord.Collection<string, CronType>();

  const cronsFolders = readdirSync('./src/lib/bot/crons/');
  if (!cronsFolders.length) return new Discord.Collection<string, CronType>();

  const cronsCollection = new Discord.Collection<string, CronType>();

  async function readRecursive(folderOrFile: string) {
    if (lstatSync(`./src/lib/bot/crons/${folderOrFile}`).isDirectory()) {
      const files = readdirSync(`./src/lib/bot/crons/${folderOrFile}`);
      for (const file of files) await readRecursive(`${folderOrFile}/${file}`);
    } else {
      const cronModule = await import(`../../crons/${folderOrFile}`);
      const cron: CronType = cronModule.default;

      const cronName = folderOrFile.split('.')?.[0];
      if (!cronName) return;

      cronsCollection.set(cronName, { ...cron, name: cronName });
    }
  }

  await Promise.all(cronsFolders.map(folderOrFile => readRecursive(folderOrFile)));

  return cronsCollection;
}

export default fetchCrons;