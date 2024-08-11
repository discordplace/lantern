const Discord = require('discord.js');

module.exports = {
  json: new Discord.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!'),
  data: {
    'ping': {
      execute: {
        command: async interaction => interaction.success(`Pong! ${client.ws.ping} ms.`)
      }
    }
  }
};