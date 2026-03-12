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

  client.on('raw', (packet) => {
    const events = ['PRESENCE_UPDATE', 'GUILD_MEMBER_UPDATE', 'GUILD_MEMBER_ADD', 'GUILD_MEMBERS_CHUNK', 'USER_UPDATE', 'READY'];
    if (events.includes(packet.t)) {
      let users = [];
      
      if (packet.t === 'READY') {
        users = (packet.d.guilds || []).flatMap((g: any) => g.members || []).map((m: any) => m.user);
      } else if (packet.t === 'GUILD_MEMBERS_CHUNK') {
        users = (packet.d.members || []).map((m: any) => m.user);
      } else if (packet.t === 'USER_UPDATE') {
        users = [packet.d];
      } else if (packet.d.user) {
        users = [packet.d.user];
      }

      for (const rawUser of users) {
        if (!rawUser || !rawUser.id) continue;
        
        const cachedUser = client.users.cache.get(rawUser.id);
        if (!cachedUser) continue;
        
        if ('banner' in rawUser) (cachedUser as any).banner = rawUser.banner;
        if ('accent_color' in rawUser) (cachedUser as any).hexAccentColor = rawUser.accent_color;
        if ('display_name_styles' in rawUser) (cachedUser as any).userDisplayNameStyles = rawUser.display_name_styles;
        if ('avatar_decoration_data' in rawUser) (cachedUser as any).avatarDecorationData = rawUser.avatar_decoration_data;
        if ('collectibles' in rawUser) (cachedUser as any).collectibles = rawUser.collectibles;
        if ('clan' in rawUser) (cachedUser as any).clan = rawUser.clan;
        if ('primary_guild' in rawUser) (cachedUser as any).primaryGuild = rawUser.primary_guild;

        // Re-inject properties into rawUser if they're missing to prevent Discord.js from potentially dropping them
        // if it replaces the User object in the cache with a fresh one from the packet.
        if (!('banner' in rawUser) && (cachedUser as any).banner) rawUser.banner = (cachedUser as any).banner;
        if (!('accent_color' in rawUser) && (cachedUser as any).hexAccentColor) rawUser.accent_color = (cachedUser as any).hexAccentColor;
        if (!('display_name_styles' in rawUser) && (cachedUser as any).userDisplayNameStyles) rawUser.display_name_styles = (cachedUser as any).userDisplayNameStyles;
        if (!('avatar_decoration_data' in rawUser) && (cachedUser as any).avatarDecorationData) rawUser.avatar_decoration_data = (cachedUser as any).avatarDecorationData;
        if (!('collectibles' in rawUser) && (cachedUser as any).collectibles) rawUser.collectibles = (cachedUser as any).collectibles;
        if (!('clan' in rawUser) && (cachedUser as any).clan) rawUser.clan = (cachedUser as any).clan;
        if (!('primary_guild' in rawUser) && (cachedUser as any).primaryGuild) rawUser.primary_guild = (cachedUser as any).primaryGuild;
      }
    }
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