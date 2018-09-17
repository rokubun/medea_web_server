const { createLogger, transports, format } = require('winston');
const chalk = require('chalk');

const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  if (process.env.NODE_ENV === 'production') {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  } else {
    return chalk.yellow(info.message);
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
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/warnings.log', level: 'warn' }),
    
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});


// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

module.exports = logger;