import createUserData from '@/utils/bot/createUserData';
import { send as socket_send } from '@/express/routes/socket/utils';
import Storage from '@/models/Storage';
import type { EventType } from '@/src/types';

export default {
  name: 'presenceUpdate',
  execute: async (_, newPresence) => {
    if (!newPresence.user) return;

    // find if any socket is monitoring the user
    const anySocketMonitoring = [...ActiveSockets.values()]
      .some(data => data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user!.id));

    if (!anySocketMonitoring) return;

    const user_storage = await Storage.findOne({ userId: newPresence.user.id });

    // Send a message to all active sockets that the user's presence has changed
    for (const [, data] of ActiveSockets) {
      if (data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user.id)) {
        socket_send(data.instance, config.server.socket.opcodes.PRESENCE_UPDATE, createUserData(newPresence.user.id, user_storage?.kv || {}));
      }
    }
  }
} satisfies EventType;