const fs = require('node:fs');
const Discord = require('discord.js');

function fetchEvents() {
  const eventsFolders = fs.readdirSync('./lib/bot/events');
  const eventsCollection = new Discord.Collection();

  function readRecursive(folderOrFile) {
    if (fs.lstatSync(`./lib/bot/events/${folderOrFile}`).isDirectory()) {
      const files = fs.readdirSync(`./lib/bot/events/${folderOrFile}`);
      files.forEach(file => readRecursive(`${folderOrFile}/${file}`, eventsCollection));
    } else {
      const event = require(`../../events/${folderOrFile}`);
      const eventName = folderOrFile.split('.')[0];

      eventsCollection.set(eventName, event);
    }
  }

  eventsFolders.map(folderOrFile => readRecursive(folderOrFile));

  return eventsCollection;
}

module.exports = fetchEvents;