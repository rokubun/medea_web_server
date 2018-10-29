import {
  createLogger,
  transports,
  format,
} from 'winston';

import chalk from 'chalk';

import fs from 'fs';

const logsPath = `${__dirname}/logs/`;

// If logs folder doesn't exist create it
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  if (process.env.NODE_ENV === 'development') {
    return chalk.yellow(info.message);
  } else {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }
});


const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: `${__dirname}/logs/error.log`, level: 'error' }),
    new transports.File({ filename: `${__dirname}/logs/info.log`, level: 'info' }),
    new transports.File({ filename: `${__dirname}/logs/warnings.log`, level: 'warn' }),
    
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${__dirname}/logs/exceptions.log` })
  ]
});


// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

export default logger;
