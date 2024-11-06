import * as winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';

const highestLevel = Object.keys(config.logger.levels)[Object.keys(config.logger.levels).length - 1];

const transports = [
  new winston.transports.Console({
    level: highestLevel
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    zippedArchive: true
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
    zippedArchive: true
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'error'
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d'
  })
];

const logger = winston.createLogger({
  levels: Object.keys(config.logger.levels).map((key, index) => ({ [key]: index }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const color = chalk[config.logger.levels[level] as keyof typeof chalk] as any;

      const formattedMessage = level === 'error' ? chalk.gray(stack || message) : message;

      const paddedLevel = level.toUpperCase().padEnd(9, ' ');

      return `${chalk.gray(timestamp)} ${chalk.bold(color(paddedLevel))}${formattedMessage}`;
    })
  ),
  transports
});

global.logger = logger;