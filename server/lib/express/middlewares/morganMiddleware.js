const morgan = require('morgan');

module.exports = morgan(':method :url from :remote-addr | Status: :status | Response Time: :response-time ms', {
  stream: {
    write: message => logger.http(message.trim())
  }
});