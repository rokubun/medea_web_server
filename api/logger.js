import {
  createLogger,
  transports,
  format,
} from 'winston';

import moment from 'moment';

import chalk from 'chalk';

import fs from 'fs';

const logsPath = `${__dirname}/logs/`;

// If logs folder doesn't exist create it
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  const timeStr = `(${moment(info.timestamp).format('MMMM Do YYYY, h:mm:ss a')})`;
  if (process.env.NODE_ENV  !== 'production') {
    return `(${info.level}) ${info.message}\t ${chalk.grey(timeStr)}`;
  } else {
    return `(${info.level}) ${info.message}\t${timeStr}`;
  }
});

const loggerSettings = {
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: `${__dirname}/logs/error.log`, level: 'error' }),
    new transports.File({ filename: `${__dirname}/logs/info.log`, level: 'info' }),
    new transports.File({ filename: `${__dirname}/logs/warnings.log`, level: 'warn' }),
  ]
}

const logger = createLogger(loggerSettings);

// Make logs silent when the api runs tests
if (/mocha/.test(process.argv)) {
  logger.silent = true;
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      myFormat,
    )
  }));
} else {
  // Only catch exceptions on production
  logger.add(new transports.File({
    filename: `${__dirname}/logs/exceptions.log`, exitOnError: false, handleExceptions: true
  }));
}

export default logger;
