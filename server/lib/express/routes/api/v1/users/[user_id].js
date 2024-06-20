const User = require('@/models/User');
const { param, query } = require('express-validator');
const validateRequest = require('@/lib/express/middlewares/validateRequest');
const createUserData = require('@/utils/createUserData');
const createSvg = require('@/lib/express/routes/api/v1/users/createSvg');

module.exports = {
  get: [
    validateRequest,
    param('user_id')
      .exists().withMessage('user_id is required.')
      .isNumeric().withMessage('user_id must be a number.')
      .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
    query('svg')
      .optional()
      .isNumeric().withMessage('svg must be a number.')
      .isIn([0, 1]).withMessage('svg must be either 0 or 1.'),
    query('theme')
      .optional()
      .isString().withMessage('Theme must be a string.')
      .isIn(['light', 'dark']).withMessage('Theme must be either "light" or "dark".'),
    query('borderRadius')
      .optional()
      .isNumeric().withMessage('borderRadius must be a number.'),
    query('hideGlobalName')
      .optional()
      .isNumeric().withMessage('hideGlobalName must be a number.')
      .isIn([0, 1]).withMessage('hideGlobalName must be either 0 or 1.'),
    query('hideStatus')
      .optional()
      .isNumeric().withMessage('hideStatus must be a number.')
      .isIn([0, 1]).withMessage('hideStatus must be either 0 or 1.'),
    query('hideBadges')
      .optional()
      .isNumeric().withMessage('hideBadges must be a number.')
      .isIn([0, 1]).withMessage('hideBadges must be either 0 or 1.'),
    query('hideActivity')
      .optional()
      .isNumeric().withMessage('hideActivity must be a number.')
      .isIn([0, 1]).withMessage('hideActivity must be either 0 or 1.'),
    query('t')
      .optional()
      .isNumeric().withMessage('t must be a number.'),
    async (request, response) => {
      const { user_id } = request.params;
      const { svg, t } = request.query;
      
      if (svg == 1 && !t) {
        // if no t query parameter is provided, add a t query parameter with the current time and redirect to the same URL
        const fullUrl = `${request.protocol}://${request.get('host')}${request.originalUrl}&t=${Date.now()}`;
        return response.redirect(301, fullUrl);
      }

      const guild = client.guilds.cache.get(config.base_guild_id);
      const member = guild.members.cache.get(user_id);

      if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitoring by Lantern.` });

      const user = await User.findOne({ id: user_id }).lean();
      if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitoring by Lantern.` });
   
      const createdUserData = createUserData(user_id);

      if (svg == 1) {
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Content-Type', 'image/svg+xml');
        response.setHeader('content-security-policy', 'default-src \'none\'; img-src * data:; style-src \'unsafe-inline\'');

        const defaultOptions = {
          theme: 'dark',
          borderRadius: '2rem',
          hideGlobalName: false,
          hideStatus: false,
          hideBadges: false,
          hideActivity: false
        };

        const svg = await createSvg(
          createdUserData,
          {
            ...defaultOptions,
            ...Object.keys(request.query).reduce((acc, key) => {
              if (key !== 'svg') return {
                ...acc,
                // If the value is 0 or 1, convert it to a number
                // Otherwise, keep it as a string (for theme or borderRadius for example)
                [key]: [0, 1].includes(parseInt(request.query[key])) ? parseInt(request.query[key]) : request.query[key]
              };
            }, {})
          }
        );

        return response.send(svg);
      }

      return response.json(createdUserData);
    }
  ]
};