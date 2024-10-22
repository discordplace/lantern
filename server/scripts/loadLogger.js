const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, errors, printf, timestamp } = winston.format;
const { Console, File, DailyRotateFile } = winston.transports;

const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const chalk = require('chalk');
const { inspect } = require('node:util');

const highestLevel = Object.keys(config.logger.levels)[Object.keys(config.logger.levels).length - 1];

const defaultTransports = [
  new Console({
    level: highestLevel
  }),
  new File({
    filename: 'logs/error.log',
    level: 'error',
    zippedArchive: true
  }),
  new File({
    filename: 'logs/combined.log',
    zippedArchive: true
  }),
  new DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'error'
  }),
  new DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d'
  })
];

if (process.env.NODE_ENV === 'production' && process.env.LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
  const transport = new LogtailTransport(logtail, {
    level: highestLevel
  });

  defaultTransports.push(transport);
}

const logger = winston.createLogger({
  levels: Object.keys(config.logger.levels).map((key, index) => ({ [key]: index }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    printf(({ level, message, timestamp, stack }) => {
      const color = chalk[config.logger.levels[level]];

      if (stack) {
        const paddedLevel = level.toUpperCase().padEnd(9, ' ');

        return `${chalk.gray(timestamp)} ${chalk.bold(color(paddedLevel))}${chalk.gray(stack)}`;
      } else {
        const paddedLevel = level.toUpperCase().padEnd(9, ' ');

        return `${chalk.gray(timestamp)} ${chalk.bold(color(paddedLevel))}${message}`;
      }
    })
  ),
  transports: defaultTransports
});

global.logger = Object.keys(config.logger.levels)
  .reduce((acc, cur) => (
    {
      ...acc,
      [cur]: (...args) => logger[cur](args.map(arg => typeof arg === 'object' ? inspect(arg, { depth: 2 }) : arg).join(' '))
    }
  ), {});