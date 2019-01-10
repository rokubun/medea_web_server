import mongoose from 'mongoose';

import logger from '../logger';

import { DB_USER, DB_PASS } from '../config'

const options = {
  keepAlive: true,
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  // Where the users are stored
  authSource: 'admin',
}

export default () => {
  const db = mongoose.connection;

  const connectUrl = `mongodb://${DB_USER}:${DB_PASS}@192.168.1.250:27017/local`;
 
  db.on('connected', () => {
    logger.info('Mongoose connected to database');
  });

  db.on('error', (err) => {
    logger.error('Mongoose default connection has occured ' + err + ' error');
    mongoose.disconnect();
  });
  
  db.on('disconnected', () => {
    logger.error('Mongoose default connection is disconnected');
    setTimeout(() => { mongoose.connect(connectUrl, options) }, 5000);
  });

  process.on('SIGINT', () => {
    db.close(() => {
      logger.info('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });

  mongoose.connect(connectUrl, options);
}
