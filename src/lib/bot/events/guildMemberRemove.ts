import syncUsers from '@/utils/bot/syncUsers';
import { send as socket_send, disconnect as socket_disconnect } from '@/express/routes/socket/utils';
import type { EventType } from '@/src/types';

export default {
  name: 'guildMemberRemove',
  execute: async member => {
    syncUsers();

    logger.info(`User ${member.user.id} has left the server and is no longer monitored.`);

    // Send a message to all active sockets that the user has left the server
    for (const [id, data] of ActiveSockets) {
      if (data.subscribed === member.user.id) {
        socket_disconnect(data.instance, id, `User ${member.user.id} is not monitored anymore.`);
      }

      if (Array.isArray(data.subscribed) && data.subscribed.includes(member.user.id)) {
        socket_send(data.instance, config.server.socket.opcodes.USER_LEFT, { user_id: member.user.id });

        if (data.subscribed.length === 1) {
          socket_disconnect(data.instance, id, 'There is no user to monitor anymore.');
        } else {
          ActiveSockets.set(id, {
            ...data,
            subscribed: data.subscribed.filter(id => id !== member.user.id)
          });
        }
      }
    }
  }
} satisfies EventType;