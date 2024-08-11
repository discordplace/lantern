const createUserData = require('@/utils/createUserData');
const { send: socket_send } = require('@/lib/express/routes/socket/utils');

module.exports = async (oldPresence, newPresence) => {
  // Send a message to all active sockets that the user's presence has changed
  for (const [, data] of ActiveSockets) {
    if (data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user.id)) {
      socket_send(data.instance, config.server.socket.opcodes.PRESENCE_UPDATE, createUserData(newPresence.user.id));
    }
  }
};