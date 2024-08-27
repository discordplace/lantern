const Discord = require('discord.js');
const syncUsers = require('@/utils/syncUsers');
const createServer = require('@/lib/express/createServer');
const updateClientActivity = require('@/utils/updateClientActivity');
const { CronJob } = require('cron');
const fetchCommands = require('@/lib/bot/handlers/commands/fetchCommands');
const fetchEvents = require('@/lib/bot/handlers/events/fetchEvents');
const listenEvents = require('@/lib/bot/handlers/events/listenEvents');

async function createClient() {
  const client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMembers,
      Discord.GatewayIntentBits.GuildPresences
    ]
  });

  client.login(process.env.DISCORD_BOT_TOKEN)
    .catch(error => {
      logger.error('Failed to login:', error);
      process.exit(1);
    });

  client.once('ready', async () => {
    const level = process.env.NODE_ENV === 'development' ? 'info' : 'warn';
    logger[level](`Project is running in ${process.env.NODE_ENV} mode.`);

    logger.bot(`Logged in as ${client.user.tag}.`);

    global.client = client;

    syncUsers()
      .then(() => {
        logger.info('Users have been synchronized.');

        // Start the Express server
        createServer();

        // Update the client's activity
        // also create a cron job to update the activity every 3 hours
        updateClientActivity();

        new CronJob('0 */3 * * *', updateClientActivity).start();

        const commands = fetchCommands();
        client.commands = commands;

        logger.bot(`Fetched ${commands.size} commands.`);

        const events = fetchEvents();
        client.events = events;
    
        listenEvents(events);
      
        logger.bot(`Fetched and listened to ${events.size} events.`);
      })
      .catch(error => logger.error(error));
  });
}

module.exports = createClient;