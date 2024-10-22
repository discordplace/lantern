const Discord = require('discord.js');
const registerCommands = require('@/lib/bot/handlers/commands/registerCommands');

registerCommands({
  token: process.env.DISCORD_BOT_TOKEN,
  commands: new Discord.Collection(),
  applicationId: config.application_id
}).then(() => process.exit(0));