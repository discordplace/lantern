const syncUsers = require('@/utils/syncUsers');
const createUserData = require('@/utils/createUserData');
const { send: socket_send } = require('@/lib/express/routes/socket/utils');

module.exports = async member => {
  logger.info(`User ${member.user.id} has joined the server and is now monitored.`);

  syncUsers();

  // Send a message to all active sockets that the user has joined the server
  for (const [, data] of ActiveSockets) {
    if (data.subscribed === 'ALL') {
      // Users can't have storage data when they join the server, so we just send an empty object
      socket_send(data.instance, config.server.socket.Opcodes.USER_JOINED, createUserData(member.user.id, {}));
    }
  }
};