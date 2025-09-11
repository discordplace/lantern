import * as Discord from 'discord.js';

import fetchCommands from '@/bot/handlers/commands/fetchCommands';
import fetchEvents from '@/bot/handlers/events/fetchEvents';
import listenEvents from '@/bot/handlers/events/listenEvents';
import fetchCrons from '@/bot/handlers/crons/fetchCrons';
import listenCrons from '@/bot/handlers/crons/listenCrons';
import createServer from '@/express/createServer';
import syncUsers from '@/src/lib/utils/bot/syncUsers';
import User from '@/models/User';

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
      logger.error('Failed to login to Discord:');
      logger.error(error);

      process.exit(1);
    });

  client.once(Discord.Events.ClientReady, () => {
    const level = process.env.NODE_ENV === 'development' ? 'info' : 'warn';
    logger[level](`Project is running in ${process.env.NODE_ENV} mode.`);

    logger.log('bot', `Client logged in as ${client.user!.tag}`);

    global.client = client;

    syncUsers()
      .then(async () => {
        // Start the Express server
        createServer();

        const commands = await fetchCommands();
        client.commands = commands;

        logger.log('bot', `Fetched ${commands.size} commands.`);

        const events = await fetchEvents();
        client.events = events;

        listenEvents(events);

        logger.log('bot', `Fetched and listened to ${events.size} events.`);

        const crons = await fetchCrons();
        client.crons = crons;

        listenCrons(crons);

        logger.log('bot', `Fetched and listened to ${crons.size} crons.`);

        // Cache last seen dates
        client.lastSeens = new Discord.Collection();

        const usersWithLastSeen = await User.find({ lastSeenAt: { $ne: null } })
          .select('id lastSeenAt')
          .lean();

        usersWithLastSeen.forEach(user => client.lastSeens.set(user.id, user.lastSeenAt));
      })
      .catch(error => logger.error(error));
  });
}

export default createClient;