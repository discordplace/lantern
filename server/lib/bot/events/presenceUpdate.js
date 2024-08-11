const createUserData = require('@/utils/createUserData');
const { send: socket_send } = require('@/lib/express/routes/socket/utils');
const Storage = require('@/models/Storage');

module.exports = async (oldPresence, newPresence) => {
  // find if any socket is monitoring the user
  const anySocketMonitoring = [...ActiveSockets.values()]
    .some(data => data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user.id));

  if (!anySocketMonitoring) return;

  const user_storage = await Storage.findOne({ userId: newPresence.user.id });

  // Send a message to all active sockets that the user's presence has changed
  for (const [, data] of ActiveSockets) {
    if (data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user.id)) {
      
      socket_send(data.instance, config.server.socket.opcodes.PRESENCE_UPDATE, createUserData(newPresence.user.id, user_storage?.kv || {}));
    }
  }
};