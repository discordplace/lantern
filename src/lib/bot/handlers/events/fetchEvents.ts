import { lstatSync, readdirSync, existsSync } from 'node:fs';
import * as Discord from 'discord.js';
import type { EventType } from '@/src/types';

async function fetchEvents(): Promise<Discord.Collection<string, EventType>> {
  if (!existsSync('./src/lib/bot/events/')) return new Discord.Collection<string, EventType>();

  const eventsFolders = readdirSync('./src/lib/bot/events');
  if (!eventsFolders.length) return new Discord.Collection<string, EventType>();

  const eventsCollection = new Discord.Collection<string, EventType>();

  async function readRecursive(folderOrFile: string) {
    if (lstatSync(`./src/lib/bot/events/${folderOrFile}`).isDirectory()) {
      const files = readdirSync(`./src/lib/bot/events/${folderOrFile}`);
      for (const file of files) await readRecursive(`${folderOrFile}/${file}`);
    } else {
      const eventModule = await import(`../../events/${folderOrFile}`);
      const event = eventModule.default as EventType;

      if (!event.name || !event.execute) return;

      eventsCollection.set(event.name, event);
    }
  }

  await Promise.all(eventsFolders.map(folderOrFile => readRecursive(folderOrFile)));

  return eventsCollection;
}

export default fetchEvents;
