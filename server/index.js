const connectDatabase = require('@/scripts/connectDatabase');
connectDatabase(process.env.MONGODB_URI);

const Discord = require('discord.js');
const syncUsers = require('@/utils/syncUsers');
const createServer = require('@/lib/express/createServer');
const { send: socket_send, disconnect: socket_disconnect } = require('@/lib/express/routes/socket/utils');
const createUserData = require('@/utils/createUserData');

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildPresences
  ]
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', async () => {
  logger.bot(`Logged in as ${client.user.tag}.`);

  const level = process.env.NODE_ENV === 'development' ? 'info' : 'warn';
  logger[level](`Project is running in ${process.env.NODE_ENV} mode.`);

  global.client = client;

  syncUsers()
    .then(() => {
      logger.info('Users have been synchronized.');

      // Start the Express server
      createServer();
    })
    .catch(error => logger.error(error));
});

client.on('guildMemberAdd', async member => {
  logger.info(`User ${member.user.id} has joined the server and is now monitored.`);

  syncUsers();

  // Send a message to all active sockets that the user has joined the server
  for (const [, data] of ActiveSockets) {
    console.log(data.subscribed);

    if (data.subscribed === 'ALL') {
      socket_send(data.instance, config.server.socket.Opcodes.USER_JOINED, createUserData(member.user.id));
    }
  }
});

client.on('guildMemberRemove', member => {
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
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  // Send a message to all active sockets that the user's presence has changed
  for (const [, data] of ActiveSockets) {
    if (data.subscribed === 'ALL' || data.subscribed.includes(newPresence.user.id)) {
      socket_send(data.instance, config.server.socket.opcodes.PRESENCE_UPDATE, createUserData(newPresence.user.id));
    }
  }
});