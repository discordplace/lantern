const User = require('@/models/User');
const Storage = require('@/models/Storage');

async function syncUsers() {
  const guild = client.guilds.cache.get(config.base_guild_id);
  const members = await guild.members.fetch();

  const allUsers = await User.find().lean();
  const usersToCreate = members.filter(member => !allUsers.some(user => user.id === member.user.id)).map(member => member);

  if (usersToCreate.length > 0) {
    await User.insertMany(usersToCreate.map(member => ({ id: member.user.id })))
      .then(() => logger.database(`${usersToCreate.length} users have been added to the database.`))
      .catch(error => logger.error(error));
  }

  const usersToDelete = allUsers.filter(user => !members.some(member => user.id === member.user.id));

  if (usersToDelete.length > 0) {
    await User.deleteMany({ id: { $in: usersToDelete.map(user => user.id) } })
      .then(() => logger.database(`${usersToDelete.length} users have been removed from the database.`))
      .catch(error => logger.error(error));

    await Storage.deleteMany({ userId: { $in: usersToDelete.map(user => user.id) } })
      .then(() => logger.database(`${usersToDelete.length} user storages have been removed from the database.`))
      .catch(error => logger.error(error));
  }
}

module.exports = syncUsers;