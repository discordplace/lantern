process.on('unhandledRejection', error => logger.error(error));
process.on('uncaughtException', error => logger.error(error));

process.removeAllListeners('warning');

process.on('warning', warning => {
  if (warning.toString().includes('The `punycode` module is deprecated.')) return;
  logger.warn(warning);
});