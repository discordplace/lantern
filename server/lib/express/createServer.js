const express = require('express');
const compression = require('compression');
const { createRouter } = require('express-file-routing');
const morganMiddleware = require('@/lib/express/middlewares/morganMiddleware');
const handleSimultaneousRequests = require('@/lib/express/middlewares/handleSimultaneousRequests');
const ws = require('express-ws');
const path = require('node:path');
const fs = require('node:fs');
const swaggerUi = require('swagger-ui-express');

async function createServer() {
  const options = {
    wsOptions: {
      maxPayload: config.server.socket.maxpayload,
      clientTracking: config.server.socket.clienttracking,
      keepAlive: config.server.socket.keepalive
    }
  };
  const { app, getWss } = ws(express(), null , options);

  global.getWss = getWss;

  // Configure the server
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
  app.set('etag', false);

  // Add middlewares
  app.use(morganMiddleware);
  app.use(compression());
  app.use(handleSimultaneousRequests);

  // Add 'Access-Control-Allow-Origin' header to the response to allow CORS
  app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  /*
    Configure the express-file-routing package
    to automatically load routes from the 'routes' directory
  */
  await createRouter(app, {
    directory: path.join(__dirname, 'routes'),
    additionalMethods: ['ws']
  });

  const swaggerSpec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../swagger.json')));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use((request, response) => response.status(404).json({ error: 'Resource not found.' }));

  app.listen(config.server.port, () => {
    logger.http(`Server is listening on port ${config.server.port}.`);
  });
}

module.exports = createServer;
