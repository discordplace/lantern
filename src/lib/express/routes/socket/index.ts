import * as Discord from 'discord.js';
import User from '@/models/User';
import crypto from 'crypto';
import getZodError from '@/utils/getZodError';
import createUserData from '@/utils/bot/createUserData';
import { send, disconnect } from '@/express/routes/socket/utils';
import Storage from '@/models/Storage';
import type { WebSocket } from 'ws';
import { InitSchema } from '@/express/routes/socket/schemas';

global.ActiveSockets = new Discord.Collection();

const Opcodes = config.server.socket.opcodes;

async function subscribeToUsers(socket: WebSocket, socketId: string, { user_id, user_ids }: { user_id?: string, user_ids?: string[] }) {
  const subscribed_to_all = user_id === 'ALL';

  if (user_id && !subscribed_to_all) {
    const user = await User.findOne({ id: user_id });
    if (!user) return send(socket, Opcodes.ERROR, `User ${user_id} not found.`);
  }

  if (user_ids) {
    const users = await User.find({ id: { $in: user_ids } });
    if (users.length !== user_ids.length) return send(socket, Opcodes.ERROR, `User(s) ${user_ids.filter(id => !users.map(user => user.id).includes(id)).join(', ')} not found.`);
  }

  // Update or create new entry in ActiveSockets collection.
  if (ActiveSockets.has(socketId)) {
    // check if the user is already subscribed to all/one user.
    const { subscribed } = ActiveSockets.get(socketId);
    if (subscribed === 'ALL') return send(socket, Opcodes.ERROR, 'You are already subscribed to all users.');

    if (typeof subscribed === 'string') {
      if (subscribed.includes(user_id)) return send(socket, Opcodes.ERROR, `You are already subscribed to user ${user_id}.`);
    }

    if (typeof subscribed === 'object') {
      const already_subscribed = subscribed.filter((subscribedUserId: string) => user_ids.includes(subscribedUserId));
      if (already_subscribed.length) return send(socket, Opcodes.ERROR, `You are already subscribed to user(s) ${already_subscribed.join(', ')}.`);
    }

    ActiveSockets.set(socketId, {
      instance: socket,
      lastHeartbeat: Date.now(),
      subscribed: subscribed_to_all ? 'ALL' : [...subscribed, ...(user_ids || [user_id])]
    });

    send(socket, Opcodes.SUBSCRIBE_ACK);

    logger.log('socket', `Websocket connection ${socketId} subscribed to ${subscribed_to_all ? 'all users' : (user_ids || [user_id]).join(', ')}.`);
  } else {
    ActiveSockets.set(socketId, {
      instance: socket,
      lastHeartbeat: Date.now(),
      subscribed: subscribed_to_all ? 'ALL' : (user_ids || [user_id || ''])
    });
  }
}

export const ws = [
  async (websocket: WebSocket) => {
    send(websocket, Opcodes.HELLO, { heartbeat_interval: config.server.socket.heartbeat_interval });

    // wait for INIT message, if not received, close the connection.

    const timeout = setTimeout(() => websocket.close(), 5000);
    const id = crypto.randomBytes(16).toString('hex');

    websocket.on('message', async message => {
      const { op, d: data } = JSON.parse(message.toString());

      if (!Object.values(Opcodes).includes(op)) return disconnect(websocket, null, 'Invalid opcode.');

      // Check if the opcode is allowed to be sent to the server
      if (!config.server.socket.client_allowed_opcodes.includes(op)) return disconnect(websocket, null, 'You are not allowed to send this opcode to the server.');

      switch (op) {
        case Opcodes.INIT:
          // Clear timeout since the connection is now established.
          clearTimeout(timeout);

          var error = getZodError(data, InitSchema);
          if (error) return disconnect(websocket, null, error);

          var subscribed_to_all = data.user_id === 'ALL';

          await subscribeToUsers(websocket, id, { user_id: data.user_id, user_ids: data.user_ids });

          logger.log('socket', `New websocket connection: ${id}`);

          // Acknowledge the connection.
          if (subscribed_to_all) {
            const users = await User.find();
            const storages = await Storage.find({ userId: { $in: users.map(user => user.id) } });

            const userData = users.map(user => createUserData(user.id, storages.find(storage => storage.userId === user.id)?.kv || {}));

            send(websocket, Opcodes.INIT_ACK, userData);

            logger.log('socket', `Websocket connection ${id} subscribed to all users.`);
          } else if (data.user_id) {
            const user_storage = await Storage.findOne({ userId: data.user_id });

            send(websocket, Opcodes.INIT_ACK, createUserData(data.user_id, user_storage?.kv || {}));

            logger.log('socket', `Websocket connection ${id} subscribed to user ${data.user_id}.`);
          } else {
            const users = await User.find({ id: { $in: data.user_ids } });
            const storages = await Storage.find({ userId: { $in: users.map(user => user.id) } });

            const userData = users.map(user => createUserData(user.id, storages.find(storage => storage.userId === user.id)?.kv || {}));

            send(websocket, Opcodes.INIT_ACK, userData);

            logger.log('socket', `Websocket connection ${id} subscribed to users ${data.user_ids.join(', ')}.`);
          }

          break;
        case Opcodes.HEARTBEAT:
          if (!ActiveSockets.has(id)) return disconnect(websocket, null, 'Invalid websocket connection.');

          ActiveSockets.set(id, {
            instance: websocket,
            lastHeartbeat: Date.now(),
            subscribed: ActiveSockets.get(id).subscribed
          });

          send(websocket, Opcodes.HEARTBEAT_ACK);

          break;
        // Allow to adding user(s) after initial connection.
        case Opcodes.SUBSCRIBE:
          if (!ActiveSockets.has(id)) return disconnect(websocket, null, 'Invalid websocket connection.');

          var error = getZodError(data, InitSchema);
          if (error) return send(websocket, Opcodes.ERROR, error);

          // if already subscribed to all users, return an error.
          if (ActiveSockets.get(id).subscribed === 'ALL') return send(websocket, Opcodes.ERROR, 'You are already subscribed to all users.');

          await subscribeToUsers(websocket, id, { user_id: data.user_id, user_ids: data.user_ids });

          break;
        // Allow to remove user(s) after initial connection.
        case Opcodes.UNSUBSCRIBE:
          if (!ActiveSockets.has(id)) return disconnect(websocket, null, 'Invalid websocket connection.');

          var error = getZodError(data, InitSchema);
          if (error) return send(websocket, Opcodes.ERROR, error);

          var { user_id, user_ids } = data;
          var { subscribed } = ActiveSockets.get(id);

          // if already subscribed to all users, return an error.
          // If it's a string, it means the user is subscribed to all users.
          if (typeof subscribed === 'string') return send(websocket, Opcodes.ERROR, 'You are subscribed to all users.');

          if (user_id) {
            if (!subscribed.includes(user_id)) return send(websocket, Opcodes.ERROR, `You are not subscribed to user ${user_id}.`);
          }

          if (user_ids) {
            const not_subscribed = user_ids.filter((userId: string) => !subscribed.includes(userId));
            if (not_subscribed.length) return send(websocket, Opcodes.ERROR, `You are not subscribed to user(s) ${not_subscribed.join(', ')}.`);
          }

          // remove the user(s) from the subscribed list.
          var new_subscribed = subscribed.filter((subscribedUserId: string) => {
            if (user_id) return subscribedUserId !== user_id;
            if (user_ids) return !user_ids.includes(subscribedUserId);
          });

          if (!new_subscribed.length) return disconnect(websocket, id, 'You require at least one user to be subscribed. Connection closed.');

          ActiveSockets.set(id, {
            instance: websocket,
            lastHeartbeat: Date.now(),
            subscribed: new_subscribed
          });

          send(websocket, Opcodes.UNSUBSCRIBE_ACK);

          logger.log('socket', `Websocket connection ${id} unsubscribed from ${user_id ? `user ${user_id}` : user_ids.join(', ')}.`);

          break;
      }
    });
  }
];