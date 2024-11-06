import 'dotenv/config';

import '@/scripts/handleUncaughtExceptions';
import '@/scripts/loadConfig';
import '@/scripts/loadLogger';
import '@/scripts/validateEnvironmentVariables';

import fetchCommands from '@/bot/handlers/commands/fetchCommands';
import registerCommands from '@/bot/handlers/commands/registerCommands';
import getApplicationIdFromToken from '@/utils/bot/getApplicationIdFromToken';

const commands = await fetchCommands();

registerCommands({ token: process.env.DISCORD_BOT_TOKEN, commands, application_id: getApplicationIdFromToken(process.env.DISCORD_BOT_TOKEN), base_guild_id: config.base_guild_id })
  .then(() => process.exit(0));