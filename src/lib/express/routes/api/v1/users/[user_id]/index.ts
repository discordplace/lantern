import User from '@/models/User';
import { param, query } from 'express-validator';
import validateRequest from '@/express/middlewares/validateRequest';
import createUserData from '@/utils/bot/createUserData';
import createSvg from '@/express/routes/api/v1/users/[user_id]/createSvg';
import Storage from '@/models/Storage';
import type { Request, Response } from 'express';
import type { APIUsersGETRequestQuery } from '@/src/types';

interface RequestParams {
  user_id: string;
}

export const get = [
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  query('svg')
    .optional()
    .isNumeric().withMessage('svg must be a number.')
    .isIn([0, 1]).withMessage('svg must be either 0 or 1.')
    .toInt(),
  query('theme')
    .optional()
    .isString().withMessage('Theme must be a string.')
    .isIn(['light', 'dark']).withMessage('Theme must be either "light" or "dark".'),
  query('borderRadius')
    .optional()
    .isNumeric().withMessage('borderRadius must be a number.')
    .toInt(),
  query('hideGlobalName')
    .optional()
    .isNumeric().withMessage('hideGlobalName must be a number.')
    .isIn([0, 1]).withMessage('hideGlobalName must be either 0 or 1.')
    .toInt(),
  query('hideStatus')
    .optional()
    .isNumeric().withMessage('hideStatus must be a number.')
    .isIn([0, 1]).withMessage('hideStatus must be either 0 or 1.'),
  query('hideBadges')
    .optional()
    .isNumeric().withMessage('hideBadges must be a number.')
    .isIn([0, 1]).withMessage('hideBadges must be either 0 or 1.')
    .toInt(),
  query('hideActivity')
    .optional()
    .isNumeric().withMessage('hideActivity must be a number.')
    .isIn([0, 1]).withMessage('hideActivity must be either 0 or 1.')
    .toInt(),
  query('hideLastSeen')
    .optional()
    .isNumeric().withMessage('hideLastSeen must be a number.')
    .isIn([0, 1]).withMessage('hideLastSeen must be either 0 or 1.')
    .toInt(),
  query('hideServerTag')
    .optional()
    .isNumeric().withMessage('hideServerTag must be a number.')
    .isIn([0, 1]).withMessage('hideServerTag must be either 0 or 1.')
    .toInt(),
  query('noActivityTitle')
    .optional()
    .isString().withMessage('noActivityTitle must be a string.')
    .isLength({ min: 1, max: 64 }).withMessage('noActivityTitle must be 1-64 characters long.'),
  query('noActivityMessage')
    .optional()
    .isString().withMessage('noActivityMessage must be a string.')
    .isLength({ min: 1, max: 256 }).withMessage('noActivityMessage must be 1-256 characters long.'),
  validateRequest,
  async (request: Request<RequestParams, unknown, unknown, APIUsersGETRequestQuery>, response: Response) => {
    const { user_id } = request.params;
    const { svg } = request.query;

    const guild = client.guilds.cache.get(config.base_guild_id);
    const member = guild.members.cache.get(user_id);

    if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const user = await User.findOne({ id: user_id }).lean();
    if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const user_storage = await Storage.findOne({ userId: user_id });

    const createdUserData = createUserData(user_id, user_storage?.kv || {});

    if (svg == 1) {
      const options = {};

      for (const key in request.query) {
        if (key !== 'svg') {
          options[key] = [0, 1].includes(parseInt(request.query[key])) ? parseInt(request.query[key]) : request.query[key];
        }
      }

      try {
        const svg = await createSvg(
          createdUserData,
          options
        );

        response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.setHeader('Content-Type', 'image/svg+xml');
        response.setHeader('content-security-policy', 'default-src \'none\'; img-src * data:; style-src \'unsafe-inline\'');

        return response.send(svg);
      } catch (error) {
        logger.error(`There was an error creating the SVG for user ${user_id}:`);
        logger.error(error);

        return response.status(500).json({ error: 'An error occurred while creating the SVG.' });
      }
    }

    return response.json(createdUserData);
  }
];