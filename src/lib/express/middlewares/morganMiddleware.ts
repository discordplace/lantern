import type { Request, Response } from 'express';
import morgan from 'morgan';

function customMorgan(tokens: morgan.TokenIndexer, request: Request, response: Response) {
  return [
    tokens.status(request, response),
    tokens.method(request, response),
    tokens.url(request, response),
    'from ip',
    request.clientIp,
    tokens['response-time'](request, response),
    'ms'
  ].join(' ');
}

const morganMiddleware = morgan(customMorgan, {
  stream: {
    write: (message: string) => logger.log('http', message.trim())
  },
  skip: request => {
    if (request.method === 'OPTIONS') return true;
  }
});

export default morganMiddleware;