const express = require('express');
const compression = require('compression');
const path = require('node:path');
const { router } = require('express-file-routing');
const morganMiddleware = require('@/lib/express/middlewares/morganMiddleware');
const ws = require('express-ws');

async function createServer() {
  const { app, getWss } = ws(express());

  global.getWss = getWss;

  // Configure the server
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
  app.set('etag', false);

  // Add middlewares
  app.use(morganMiddleware);
  app.use(compression());

  // Configure express-file-routing
  app.use('/', await router({
    directory: path.join(__dirname, 'routes'),
    additionalMethods: ['ws']
  }));

  app.listen(config.server.port, () => {
    logger.http(`Server is listening on port ${config.server.port}.`);
  });
}

module.exports = createServer;