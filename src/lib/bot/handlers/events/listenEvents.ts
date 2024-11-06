import * as Discord from 'discord.js';
import type { EventType } from '@/src/types';

function listenEvents(events: Discord.Collection<string, EventType>) {
  for (const [, event] of events) {
    client.on(event.name, event.execute);
  }
}

export default listenEvents;