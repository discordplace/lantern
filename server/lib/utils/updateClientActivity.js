const Discord = require('discord.js');
const User = require('@/models/User');

async function updateClientActivity() {
  const currentlyMonitoringUsers = await User.countDocuments();

  const state = `Monitoring ${currentlyMonitoringUsers} users`;

  client.user.setActivity({
    type: Discord.ActivityType.Custom,
    name: state,
    state
  });

  logger.bot(`Updated activity to "${state}".`);
}

module.exports = updateClientActivity;