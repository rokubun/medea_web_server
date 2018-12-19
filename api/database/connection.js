import mongoose from 'mongoose';

import logger from '../logger';

import { DB_USER, DB_PASS } from '../config'

export default () => {
  const options = {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    useNewUrlParser: true,
    keepAliveInitialDelay: 300000,
    autoReconnect: true,
    // Where the users are stored
    authSource: 'admin',
    
  }
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to database');
  });

  mongoose.connection.on('error', function (err) {
    logger.error('Mongoose default connection has occured ' + err + ' error');
  });

  mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose default connection is disconnected');
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      logger.info('Mongoose default connection is disconnected due to application termination');
      process.exit(0)
    });
  });

  // Prevents a warning
  // https://github.com/Automattic/mongoose/issues/6890
  mongoose.set('useCreateIndex', true);

  return mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@127.0.0.1:27017/local`, options);
}
