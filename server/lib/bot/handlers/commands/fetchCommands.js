const fs = require('node:fs');
const Discord = require('discord.js');

function fetchCommands() {
  const commandsFolders = fs.readdirSync('./lib/bot/commands');
  const commandsCollection = new Discord.Collection();

  function readRecursive(folderOrFile) {
    if (fs.lstatSync(`./lib/bot/commands/${folderOrFile}`).isDirectory()) {
      const files = fs.readdirSync(`./lib/bot/commands/${folderOrFile}`);
      files.forEach(file => readRecursive(`${folderOrFile}/${file}`, commandsCollection));
    } else {
      const command = require(`../../commands/${folderOrFile}`);
      if (command?.json) commandsCollection.set(command.json.name, command);
    }
  }

  commandsFolders.map(folderOrFile => readRecursive(folderOrFile, this.commands));

  return commandsCollection;
}

module.exports = fetchCommands;