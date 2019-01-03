'use strict';

import { spawn } from 'child_process';
import logger from '../logger';
import path from 'path';
import fs from 'fs';
import isRunning from 'is-running';

import { rtklib } from './state';
import { connectTelnet, connectTcp } from './clients';
import { confNet } from '../config';
import { jsonToRtkSettings } from '../utils/rtkutils';
import UserModel from '../database/models/user';
import db from '../database/helpers';


/**
 * Launch a rtkrcv instance as a child
 * @param {object} 'io'
 */
const openRTK = async (io, telnet, tcp) => {
  let configDoc, userDoc, rtkParams, parameters;

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

  try {
    rtkParams = jsonToRtkSettings(JSON.stringify(configDoc.options));
  } catch (error) {
    throw new Error('Error converting json to rtksettings');
  }
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib') + '/rtkrcv';
  const configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs') + '/' + configDoc.name;

  // Create a temporary file
  try {
    fs.writeFileSync(configPath, rtkParams);
  } catch (error) {
    throw new Error('(Controller) Unable to write a config file');
  }

  // Starts rtkrcv and update the state
  if (process.env.NODE_ENV !== 'production') {
    parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort, '-r', '2', '-t', '3']
  } else {
    parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort];
  }

  // Starts rtklib child process
  const rtkrcv = await spawn(rtkPath, parameters);
  
  // Delete the temp file
  fs.unlinkSync(configPath);
  
  rtklib.updateState('isOpen', true, io);
  rtklib.updateState('isRunning', false, io);
  rtklib.updateState('pid', rtkrcv.pid);
  
  rtkrcv.on('error', (err) => {
    io.emit('notification', 'Unable to open Rokubun Engine');
    logger.error('spawning rtkrcv');
    rtklib.updateState('isRunning', false, io);
    rtklib.updateState('isOpen', false, io);
  });

  rtkrcv.on('exit', (code) => {
    const pid = rtklib.checkState('pid');
    // Check if rtklib is lying and there is not exit
    if (!isRunning(pid)) {
      rtklib.updateState('isOpen', false, io);
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
