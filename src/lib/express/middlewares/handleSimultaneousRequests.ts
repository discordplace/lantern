import crypto from 'node:crypto';
import AsyncLock from 'async-lock';
import type { Request, Response, NextFunction } from 'express';

const lock = new AsyncLock();

// Function to generate a unique request key
const generateRequestKey = (request: Request) => {
  const { method, originalUrl, body } = request;
  const bodyString = JSON.stringify(body);
  const requestIp = request.ip; // Use request.ip instead of request.clientIp

  // Create an MD5 hash from the method, URL, body, and IP address
  return crypto.createHash('md5').update(`${method}${originalUrl}${bodyString}${requestIp}`).digest('hex');
};

async function handleSimultaneousRequests(request: Request, response: Response, next: NextFunction): Promise<void> {
  const { method } = request;

  // Only handle specific HTTP methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) return next();

  const requestKey = generateRequestKey(request);

  try {
    await new Promise<void>((resolve, reject) => {
      lock.acquire(requestKey, async done => {
        try {
          response.on('finish', () => {
            done();
            resolve();
          });

          response.on('error', error => {
            done();
            reject(error);
          });

          next();
        } catch (error) {
          done();
          reject(error);
        }
      });
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    response.status(500).json({ error: `Failed to process the request: ${errorMessage}` });

    logger.error('There was an error while processing the request:');
    logger.error(error);
  }
};

export default handleSimultaneousRequests;