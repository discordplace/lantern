const User = require('@/models/User');
const { query } = require('express-validator');
const validateRequest = require('@/lib/express/middlewares/validateRequest');
const createUserData = require('@/utils/createUserData');
const Storage = require('@/models/Storage');

module.exports = {
  get: [
    query('user_ids')
      .exists().withMessage('user_ids is required.')
      .isArray().withMessage('user_ids must be an array.')
      .custom(value => value.every(id => typeof id === 'string' && id.length >= 17 && id.length <= 19)).withMessage('user_ids must be an array of strings with 17-19 characters long.')
      .custom(value => value.length === new Set(value).size).withMessage('user_ids must not contain duplicates.'),
    validateRequest,
    async (request, response) => {
      const { user_ids } = request.query;
      
      if (user_ids.length === config.max_bulk_get_users_size) return response.status(400).json({ error: `You can only request up to ${config.max_bulk_get_users_size} users at once.` });

      const users = await User.find({ id: { $in: user_ids } }).lean();
      
      const notMonitoredUsers = user_ids.filter(id => !users.some(({ id: user_id }) => user_id === id));
      if (notMonitoredUsers.length === user_ids.length) return response.status(404).json({ error: 'Users you requested are not monitored by Lantern.' });

      const usersStorages = await Storage.find({ userId: { $in: user_ids } });

      const createdUsersData = users.map(user => {
        const user_storage = usersStorages.find(({ userId }) => userId === user.id);
        return createUserData(user.id, user_storage?.kv || {});
      });

      return response.json(createdUsersData);
    }
  ]
};