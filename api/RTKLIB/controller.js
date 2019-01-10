'use strict';

import { spawn } from 'child_process';
import logger from '../logger';
import path from 'path';
import fs from 'fs';
import isRunning from 'is-running';
import mongoose from 'mongoose';

import { rtklib } from './state';
import { connectTelnet, connectTcp } from './clients';
import { confNet, rtkDefault } from '../config';
import { jsonToRtkSettings } from '../utils/rtkutils';
import UserModel from '../database/models/user';
import db from '../database/helpers';


/**
 * Launch a rtkrcv instance as a child
 * @param {object} 'io'
 */
const openRTK = async (io, telnet, tcp) => {
  let configDoc, userDoc, rtkParams, parameters;

  let configName = 'default.conf';

  const { readyState } = mongoose.connection

  if (readyState === 1) {
    // Find the conf name in user document
    try {
      userDoc = await UserModel.findOne(null);
      if (userDoc === null) {
        throw new Error('(Database) empty user document, check the database');
      }
    } catch (error) {
      throw new Error(`(Database) ${error.errmsg}`);
    }
    // Find the config by the name
    try {
      configDoc = await db.findConfig(userDoc.currentConf);
    } catch (error) {
      throw new Error(`(Database) ${error.errmsg}`);
    }
    // If conf not found, use default.conf instead
    if (configDoc === null) {
      try {
        configDoc = await db.findConfig('default.conf');
      } catch (error) {
        throw new Error(`(Database) ${error.errmsg}`);
      } finally {
        if (configDoc === null) {
          throw new Error('(Database) fatal error... default config is empty, check the database');
        }
      }
    }
    configName = configDoc.name;
    try {
      rtkParams = jsonToRtkSettings(JSON.stringify(configDoc.options));
    } catch (error) {
      throw new Error('Error converting json to rtksettings');
    }
  } else {
    // Use default values instead
    try {
      rtkParams = jsonToRtkSettings(JSON.stringify(rtkDefault));
    } catch (error) {
      throw new Error('Error converting json to rtksettings');
    }
  }
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib') + '/rtkrcv';
  const configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs') + '/' + configName;

  if (process.env.NODE_ENV !== 'production') {
    parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort, '-r', '2', '-t', '3']
  } else {
    parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort];
  }

  // Create a temporary file
  try {
    fs.writeFileSync(configPath, rtkParams);
  } catch (error) {
    throw new Error('(Controller) Unable to write a config file');
  }

  // Starts rtklib child process
  logger.info('Trying to start rtkrcv');
  const rtkrcv = spawn(rtkPath, parameters);

  // Delete the temp file
  if (configName !== 'default.conf') {
    fs.unlinkSync(configPath);
  }
  
  if (rtkrcv.pid) {
    rtklib.updateState('pid', rtkrcv.pid);
  }

  rtkrcv.on('error', (err) => {
    io.emit('notification', 'Unable to open Rokubun Engine');
    logger.error('spawning rtkrcv');
    rtklib.updateState('isRunning', false, io);
  });

  rtkrcv.on('exit', (code) => {
    const pid = rtklib.checkState('pid');
    // Check if rtklib is lying and there is not exit
    if (!isRunning(pid)) {
      rtklib.updateState('isRunning', false, io);
      logger.error(`rtkrcv process exited with code ${code}`);
    } else {
      logger.error(`rtkrcv error code ${code}, but is still running`);
    }
  });

  // Starts telnet to interact with rtkrcv
  setTimeout(() => (connectTelnet(telnet)), 2000);
  // Starts tcp connection to listen rtkrcv process result
  setTimeout(() => (connectTcp(tcp)), 2000);
}

export {
  openRTK,
};
