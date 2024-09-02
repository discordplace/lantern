const Discord = require('discord.js');
const User = require('@/models/User');
const crypto = require('crypto');
const getZodError = require('@/utils/getZodError');
const { CronJob } = require('cron');
const createUserData = require('@/utils/createUserData');
const { send, disconnect } = require('@/lib/express/routes/socket/utils');
const Storage = require('@/models/Storage');

global.ActiveSockets = new Discord.Collection();

const Opcodes = config.server.socket.opcodes;

async function subscribeToUsers(socket, socketId, { user_id, user_ids }) {  
  var subscribed_to_all = user_id === 'ALL';

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

    if (user_id) {
      if (subscribed.includes(user_id)) return send(socket, Opcodes.ERROR, `You are already subscribed to user ${user_id}.`);
    }

    if (user_ids) {
      const already_subscribed = subscribed.filter(sub => user_ids.includes(sub));
      if (already_subscribed.length) return send(socket, Opcodes.ERROR, `You are already subscribed to user(s) ${already_subscribed.join(', ')}.`);
    }
    
    ActiveSockets.set(socketId, {
      instance: socket,
      lastHeartbeat: Date.now(),
      subscribed: subscribed_to_all ? 'ALL' : [...subscribed, ...(user_ids || [user_id])]
    });

    send(socket, Opcodes.SUBSCRIBE_ACK);

    logger.socket(`Websocket connection ${socketId} subscribed to ${subscribed_to_all ? 'all users' : (user_ids || [user_id]).join(', ')}.`);
  } else {
    ActiveSockets.set(socketId, {
      instance: socket,
      lastHeartbeat: Date.now(),
      subscribed: subscribed_to_all ? 'ALL' : (user_ids || [user_id])
    });
  }
}

module.exports = {
  ws: (websocket) => {
    send(websocket, Opcodes.HELLO, { heartbeat_interval: config.server.socket.heartbeat_interval });
    
    // wait for INIT message, if not received, close the connection.

    let timeout = setTimeout(() => websocket.close(), 5000);
    var id = crypto.randomBytes(16).toString('hex');

    websocket.on('message', async message => {
      const { op, d: data } = JSON.parse(message);
      
      switch (op) {
        case Opcodes.INIT:
          // Clear timeout since the connection is now established.
          clearTimeout(timeout);

          var error = getZodError(data);
          if (error) return disconnect(websocket, null, error);

          var subscribed_to_all = data.user_id === 'ALL';

          await subscribeToUsers(websocket, id, { user_id: data.user_id, user_ids: data.user_ids });

          logger.socket(`New websocket connection: ${id}`);

          // Acknowledge the connection.
          if (subscribed_to_all) {
            const users = await User.find();
            const storages = await Storage.find({ userId: { $in: users.map(user => user.id) } });
          
            const userData = users.map(user => createUserData(user.id, storages.find(storage => storage.userId === user.id)?.kv || {}));
          
            send(websocket, Opcodes.INIT_ACK, userData);

            logger.socket(`Websocket connection ${id} subscribed to all users.`);
          } else {
            if (data.user_id) {
              const user_storage = await Storage.findOne({ userId: data.user_id });
            
              send(websocket, Opcodes.INIT_ACK, createUserData(data.user_id, user_storage?.kv || {}));

              logger.socket(`Websocket connection ${id} subscribed to user ${data.user_id}.`);
            } else {
              const users = await User.find({ id: { $in: data.user_ids } });
              const storages = await Storage.find({ userId: { $in: users.map(user => user.id) } });
            
              const userData = users.map(user => createUserData(user.id, storages.find(storage => storage.userId === user.id)?.kv || {}));
            
              send(websocket, Opcodes.INIT_ACK, userData);

              logger.socket(`Websocket connection ${id} subscribed to users ${data.user_ids.join(', ')}.`);
            }
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

          // eslint-disable-next-line no-redeclare
          var error = getZodError(data);
          if (error) return send(websocket, Opcodes.ERROR, error);

          // if already subscribed to all users, return an error.
          if (ActiveSockets.get(id).subscribed === 'ALL') return send(websocket, Opcodes.ERROR, 'You are already subscribed to all users.');

          await subscribeToUsers(websocket, id, { user_id: data.user_id, user_ids: data.user_ids });

          break;
        // Allow to remove user(s) after initial connection.
        case Opcodes.UNSUBSCRIBE:
          if (!ActiveSockets.has(id)) return disconnect(websocket, null, 'Invalid websocket connection.');

          // eslint-disable-next-line no-redeclare
          var error = getZodError(data);
          if (error) return send(websocket, Opcodes.ERROR, error);

          // if already subscribed to all users, return an error.
          if (ActiveSockets.get(id).subscribed === 'ALL') return send(websocket, Opcodes.ERROR, 'You are subscribed to all users.');

          var { user_id, user_ids } = data;
          var { subscribed } = ActiveSockets.get(id);

          if (user_id) {
            if (!subscribed.includes(user_id)) return send(websocket, Opcodes.ERROR, `You are not subscribed to user ${user_id}.`);
          }

          if (user_ids) {
            const not_subscribed = user_ids.filter(sub => !subscribed.includes(sub));
            if (not_subscribed.length) return send(websocket, Opcodes.ERROR, `You are not subscribed to user(s) ${not_subscribed.join(', ')}.`);
          }

          // remove the user(s) from the subscribed list.
          var new_subscribed = subscribed.filter(subscribedUserId => {
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

          logger.socket(`Websocket connection ${id} unsubscribed from ${user_id ? `user ${user_id}` : user_ids.join(', ')}.`);

          break;
      }
    });
  }
};

// Cron job to check for inactive websockets and close them.

new CronJob('*/10 * * * * *', () => {
  for (const [id, { lastHeartbeat, instance }] of ActiveSockets.entries()) {
    if (Date.now() - lastHeartbeat > config.server.socket.heartbeat_interval) {
      disconnect(instance, id, 'Connection timed out.');
    }
  }
}).start();