process.on('unhandledRejection', error => logger.error(error));
process.on('uncaughtException', error => logger.error(error));

process.removeAllListeners('warning');

process.on('warning', warning => {
  const warningsToIgnore = [
    'The `prompts` module is deprecated'
  ];

  if (warningsToIgnore.some(warningToIgnore => warning.message.includes(warningToIgnore))) return;

  logger.warn(warning);
});