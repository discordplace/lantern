import * as Discord from 'discord.js';
import type { CommandType } from '@/src/types';

export default {
  metadata: {
    global: true
  },
  json: new Discord.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!'),
  data: {
    'ping': {
      restrictions: {},
      execute: {
        command: async interaction => {
          interaction.success(`Pong! ${client.ws.ping} ms.`);
        }
      }
    }
  }
} satisfies CommandType;