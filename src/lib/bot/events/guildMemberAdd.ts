import syncUsers from '@/utils/bot/syncUsers';
import { send as socket_send } from '@/express/routes/socket/utils';
import createUserData from '@/utils/bot/createUserData';
import type { EventType } from '@/src/types';

export default {
  name: 'guildMemberAdd',
  execute: async member => {
    logger.info(`User ${member.user.id} has joined the server and is now monitored.`);

    syncUsers();

    // Send a message to all active sockets that the user has joined the server
    for (const [, data] of ActiveSockets) {
      if (data.subscribed === 'ALL') {
        socket_send(data.instance, config.server.socket.opcodes.USER_JOINED, createUserData(member.user.id, {}));
      }
    }
  }
} satisfies EventType;