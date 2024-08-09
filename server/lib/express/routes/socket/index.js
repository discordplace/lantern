const Discord = require('discord.js');
const User = require('@/models/User');
const crypto = require('crypto');
const getZodError = require('@/utils/getZodError');
const { CronJob } = require('cron');
const createUserData = require('@/utils/createUserData');
const { send, disconnect } = require('@/lib/express/routes/socket/utils');

global.ActiveSockets = new Discord.Collection();

const Opcodes = config.server.socket.opcodes;

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

        if (data.user_id && !subscribed_to_all) {
          const user = await User.findOne({ id: data.user_id });
          if (!user) return disconnect(websocket, null, 'User not found.');
        }

        if (data.user_ids) {
          var users = await User.find({ id: { $in: data.user_ids } });
          if (users.length !== data.user_ids.length) return disconnect(websocket, null, `${data.user_ids.filter(id => !users.some(user => user.id === id)).join(', ')} user(s) not found.`);
        }
              
        ActiveSockets.set(id, {
          instance: websocket,
          lastHeartbeat: Date.now(),
          subscribed: subscribed_to_all ? 'ALL' : (data.user_ids || [data.user_id])
        });

        logger.socket(`New websocket connection: ${id}`);

        // Acknowledge the connection.
        if (subscribed_to_all) {
          const users = await User.find();
          const userData = users.map(user => createUserData(user.id));
          
          send(websocket, Opcodes.INIT_ACK, userData);

          logger.socket(`Websocket connection ${id} subscribed to all users.`);
        } else {
          if (data.user_id) {
            send(websocket, Opcodes.INIT_ACK, createUserData(data.user_id));

            logger.socket(`Websocket connection ${id} subscribed to user ${data.user_id}.`);
          } else {
            const users = await User.find({ id: { $in: data.user_ids } });
            const userData = users.map(user => createUserData(user.id));
            
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