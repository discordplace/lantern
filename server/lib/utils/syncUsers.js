const User = require('@/models/User');

async function syncUsers() {
  const guild = client.guilds.cache.get(config.base_guild_id);
  const members = await guild.members.fetch({ withPresences: true });

  const allUsers = await User.find().lean();
  const usersToCreate = members.filter(member => !allUsers.some(user => user.id === member.user.id)).map(member => member);

  await Promise.all(usersToCreate.map(async member => {
    const newUser = new User({ id: member.user.id });

    await newUser.save()
      .then(() => logger.database(`User ${member.user.tag} (${member.user.id}) has been added to the database.`))
      .catch(error => logger.error(error));
  }));

  const usersToDelete = allUsers.filter(user => !members.some(member => user.id === member.user.id));

  await Promise.all(usersToDelete.map(async user => {
    await User.deleteOne({ id: user.id })
      .then(() => logger.database(`User ${user.id} has been removed from the database.`))
      .catch(error => logger.error(error));
  }));
}

module.exports = syncUsers;