const fetchCommands = require('@/lib/bot/handlers/commands/fetchCommands');
const commands = fetchCommands();

const registerCommands = require('@/lib/bot/handlers/commands/registerCommands');

registerCommands({
  token: process.env.DISCORD_BOT_TOKEN,
  commands,
  applicationId: config.application_id
}).then(() => process.exit(0));