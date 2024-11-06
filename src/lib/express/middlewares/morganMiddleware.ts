import morgan from 'morgan';

const morganMiddleware = morgan(':method :url from :remote-addr | Status: :status | Response Time: :response-time ms', {
  stream: {
    write: (message: string) => logger.log('http', message.trim())
  }
});

export default morganMiddleware;