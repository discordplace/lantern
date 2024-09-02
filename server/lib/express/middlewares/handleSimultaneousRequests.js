const crypto = require('crypto');
const AsyncLock = require('async-lock');

const lock = new AsyncLock({ timeout: 5000 });

const generateRequestKey = (request) => {
  const { method, originalUrl, body } = request;
  const bodyString = JSON.stringify(body); 
  const requestIp = request.clientIp;

  // Create an MD5 hash from the method, URL, body, and IP address
  return crypto.createHash('md5').update(`${method}${originalUrl}${bodyString}${requestIp}`).digest('hex');
};

const handleSimultaneousRequests = async (request, response, next) => {
  const requestKey = generateRequestKey(request);

  try {
    await lock.acquire(requestKey, async () => {
      // Create a new promise that resolves when the response is finished or fails if there's an error
      await new Promise((resolve, reject) => {
        response.on('finish', resolve);
        response.on('error', reject);
        next();
      });
    });
  } catch (error) {
    response.status(500).json({ error: `Failed to process the request: ${error.message}` });
    logger.error('There was an error while processing the request:', error);
  }
};

module.exports = handleSimultaneousRequests;
