import User from '@/models/User';
import Storage from '@/models/Storage';
import { param, body, matchedData } from 'express-validator';
import validateRequest from '@/express/middlewares/validateRequest';
import { decrypt } from '@/utils/encryption';
import getValidationError from '@/utils/getValidationError';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import type { IncomingHttpHeaders } from 'node:http';

interface PutRequestParams {
  user_id: string;
  key: string;
}

interface PutRequestBody {
  value: string;
}

interface RequestHeaders extends IncomingHttpHeaders {
  authorization?: string;
}

export const put = [
  bodyParser.json(),
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  param('key')
    .exists().withMessage('key is required.')
    .isString().withMessage('key must be a string.')
    .isLength({ min: 1, max: 255 }).withMessage('key must be 1-255 characters long.')
    .custom(value => /^[a-zA-Z0-9]+$/.test(value)).withMessage('key must be alphanumeric.'),
  body('value')
    .exists().withMessage('value is required.')
    .isString().withMessage('value must be a string.')
    .isLength({ max: 30000 }).withMessage('value must not exceed 30,000 characters.'),
  validateRequest,
  async (request: Request<PutRequestParams, unknown, PutRequestBody, RequestHeaders>, response: Response) => {
    const { user_id, key, value } = matchedData(request);

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

    if (!storage.kv) storage.kv = new Map();

    storage.kv.set(key, value);

    const validationError = getValidationError(storage);
    if (validationError) return response.status(400).json({ error: validationError });

    await storage.save();

    return response.json({ success: true });
  }
];

interface GetRequestParams {
  user_id: string;
  key: string;
}

export const get = [
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  param('key')
    .exists().withMessage('key is required.')
    .isString().withMessage('key must be a string.')
    .isLength({ min: 1, max: 255 }).withMessage('key must be 1-255 characters long.')
    .custom(value => /^[a-zA-Z0-9]+$/.test(value)).withMessage('key must be alphanumeric.'),
  validateRequest,
  async (request: Request<GetRequestParams, unknown, unknown, RequestHeaders>, response: Response) => {
    const { user_id, key } = matchedData(request);

    const guild = client.guilds.cache.get(config.base_guild_id);
    const member = guild.members.cache.get(user_id);

    if (!member) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const user = await User.findOne({ id: user_id }).lean();
    if (!user) return response.status(404).json({ error: `User ${user_id} is not being monitored by Lantern.` });

    const storage = await Storage.findOne({ userId: user_id });
    if (!storage) return response.status(404).json({ error: `User ${user_id} does not have any storage.` });

    if (!storage.kv) storage.kv = new Map();

    const value = storage.kv.get(key);
    if (!value) return response.status(404).json({ error: `Key ${key} does not exist in the storage.` });

    return response.json({ value });
  }
];

interface PatchRequestParams {
  user_id: string;
  key: string;
}

interface PatchRequestBody {
  value: string;
}

export const patch = [
  bodyParser.json(),
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  param('key')
    .exists().withMessage('key is required.')
    .isString().withMessage('key must be a string.')
    .isLength({ min: 1, max: 255 }).withMessage('key must be 1-255 characters long.')
    .custom(value => /^[a-zA-Z0-9]+$/.test(value)).withMessage('key must be alphanumeric.'),
  body('value')
    .exists().withMessage('value is required.')
    .isString().withMessage('value must be a string.')
    .isLength({ max: 30000 }).withMessage('value must not exceed 30,000 characters.'),
  validateRequest,
  async (request: Request<PatchRequestParams, unknown, PatchRequestBody, RequestHeaders>, response: Response) => {
    const { user_id, key, value } = matchedData(request);

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

    if (!storage.kv) storage.kv = new Map();

    if (!storage.kv.has(key)) return response.status(404).json({ error: `Key ${key} does not exist in the storage.` });

    storage.kv.set(key, value);

    const validationError = getValidationError(storage);
    if (validationError) return response.status(400).json({ error: validationError });

    await storage.save();

    return response.json({ success: true });
  }
];

interface DeleteRequestParams {
  user_id: string;
  key: string;
}

export const del = [
  param('user_id')
    .exists().withMessage('user_id is required.')
    .isNumeric().withMessage('user_id must be a number.')
    .isLength({ min: 17, max: 19 }).withMessage('user_id must be 17-19 characters long.'),
  param('key')
    .exists().withMessage('key is required.')
    .isString().withMessage('key must be a string.')
    .isLength({ min: 1, max: 255 }).withMessage('key must be 1-255 characters long.')
    .custom(value => /^[a-zA-Z0-9]+$/.test(value)).withMessage('key must be alphanumeric.'),
  validateRequest,
  async (request: Request<DeleteRequestParams, unknown, unknown, RequestHeaders>, response: Response) => {
    const { user_id, key } = matchedData(request);

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

    if (!storage.kv) storage.kv = new Map();

    if (!storage.kv.has(key)) return response.status(404).json({ error: `Key ${key} does not exist in the storage.` });

    storage.kv.delete(key);

    if (storage.kv.size === 0) delete storage.kv;

    await storage.save();

    return response.json({ success: true });
  }
];