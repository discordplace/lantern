const User = require('@/models/User');
const Storage = require('@/models/Storage');
const { param, matchedData } = require('express-validator');
const validateRequest = require('@/lib/express/middlewares/validateRequest');
const { decrypt } = require('@/utils/encryption');
const bodyParser = require('body-parser');

module.exports = {
  get: [
    param('user_id')
      .exists().withMessage('user_id is required.')
      .isNumeric().withMessage('user_id must be a number.')
      .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
    validateRequest,
    async (request, response) => {
      const { user_id } = matchedData(request);

      const guild = client.guilds.cache.get(config.base_guild_id);
      const member = guild.members.cache.get(user_id);

      if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

      const user = await User.findOne({ id: user_id }).lean();
      if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

      const storage = await Storage.findOne({ userId: user_id });
      if (!storage) return response.status(404).json({ error: `User ${user_id} does not have any storage.` });

      return response.json(storage.kv || {});
    }
  ],
  delete: [
    bodyParser.json(),
    param('user_id')
      .exists().withMessage('user_id is required.')
      .isNumeric().withMessage('user_id must be a number.')
      .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
    validateRequest,
    async (request, response) => {
      const { user_id } = matchedData(request);

      const guild = client.guilds.cache.get(config.base_guild_id);
      const member = guild.members.cache.get(user_id);

      if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

      const user = await User.findOne({ id: user_id }).lean();
      if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

      const storage = await Storage.findOne({ userId: user_id });
      if (!storage) return response.status(404).json({ error: `User ${user_id} does not have any storage.` });

      if (!request.headers.authorization) return response.status(401).json({ error: 'Unauthorized.' });

      const decryptedToken = decrypt(storage.token, process.env.KV_TOKEN_ENCRYPTION_SECRET);
      if (request.headers.authorization !== decryptedToken) return response.status(401).json({ error: 'Unauthorized.' });

      delete storage.kv;

      await Storage.save();

      return response.json({ success: true });
    }
  ]
};