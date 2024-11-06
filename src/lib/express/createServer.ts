import express from 'express';
import { createRouter } from 'express-file-routing';
import compression from 'compression';
import morganMiddleware from '@/express/middlewares/morganMiddleware';
import handleSimultaneousRequests from '@/express/middlewares/handleSimultaneousRequests';
import notFoundHandler from '@/express/middlewares/notFoundHandler';
import addCustomMethods from '@/express/middlewares/addCustomMethods';
import handleErrors from '@/express/middlewares/handleErrors';
import ws from 'express-ws';
import path from 'node:path';
import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';

async function createServer() {
  const options = {
    wsOptions: {
      maxPayload: config.server.socket.maxpayload,
      clientTracking: config.server.socket.clienttracking,
      keepAlive: config.server.socket.keepalive
    }
  };
  const { app, getWss } = ws(express(), undefined, options);

  global.getWss = getWss;

  // Configure the server
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
  app.set('etag', false);

  // Add middlewares
  app.use(morganMiddleware);
  app.use(compression());
  app.use(handleSimultaneousRequests as express.RequestHandler);
  app.use(addCustomMethods as express.RequestHandler);

  function corsMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    response.header('Access-Control-Allow-Origin', '*');
    next();
  }

  // Add 'Access-Control-Allow-Origin' header to the response to allow CORS
  app.use(corsMiddleware as express.RequestHandler);

  /*
    Configure the express-file-routing package
    to automatically load routes from the 'routes' directory
  */
  await createRouter(app, {
    directory: path.join(process.cwd(), 'src/lib/express/routes'),
    additionalMethods: ['ws']
  });

  const swaggerSpec = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'swagger.json'), 'utf-8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(notFoundHandler as express.RequestHandler);
  app.use(handleErrors as express.ErrorRequestHandler);

  app.listen(config.server.port, () => {
    logger.log('http', `Server is listening on port ${config.server.port}.`);
  });
}

export default createServer;