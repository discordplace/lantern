import { param } from 'express-validator';
import bodyParser from 'body-parser';
import User from '@/models/User';
import Storage from '@/models/Storage';
import validateRequest from '@/express/middlewares/validateRequest';
import { decrypt } from '@/utils/encryption';
import type { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'node:http';

interface RequestParams {
  user_id: string;
}

interface RequestHeaders extends IncomingHttpHeaders {
  authorization?: string;
}

export const get = [
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  validateRequest,
  async (request: Request<RequestParams>, response: Response) => {
    const { user_id } = request.params;

    const guild = client.guilds.cache.get(config.base_guild_id);
    const member = guild.members.cache.get(user_id);

    if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const user = await User.findOne({ id: user_id }).lean();
    if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const storage = await Storage.findOne({ userId: user_id });
    if (!storage) return response.status(404).json({ error: `User ${user_id} does not have any storage.` });

    return response.json(storage.kv || {});
  }
];

export const del = [
  bodyParser.json(),
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  validateRequest,
  async (request: Request<RequestParams>, response: Response) => {
    const { user_id } = request.params;

    const guild = client.guilds.cache.get(config.base_guild_id);
    const member = guild.members.cache.get(user_id);

    if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const user = await User.findOne({ id: user_id }).lean();
    if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const storage = await Storage.findOne({ userId: user_id });
    if (!storage) return response.status(404).json({ error: `User ${user_id} does not have any storage.` });

    const headers = request.headers as RequestHeaders;
    const authorizationHeader = headers.authorization;

    if (!authorizationHeader) return response.status(401).json({ error: 'Unauthorized.' });

    const decryptedToken = decrypt(storage.token, process.env.KV_TOKEN_ENCRYPTION_SECRET);
    if (authorizationHeader !== decryptedToken) return response.status(401).json({ error: 'Unauthorized.' });

    delete storage.kv;

    await storage.save();

    return response.json({ success: true });
  }
];