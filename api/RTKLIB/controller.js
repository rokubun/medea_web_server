'use strict';

import { spawn } from 'child_process';
import logger from '../logger';
import path from 'path';
import fs from 'fs';

import { rtklib } from './state';
import isRunning from 'is-running';

import { confNet } from '../config';

import { jsonToRtkSettings } from '../utils/rtkutils';

import UserModel from '../database/models/user';
import { ConfigModel } from '../database/models/config';

const sendCommand = (command, server) => {
  server.send(command + '\r\n');
}

const initWatcher = (server, cb) => {
  if (rtklib.checkState('isOpen')) {
    sendCommand('status', server);
    setTimeout(cb, 1000, server, cb);
  }
}


/**
 * Launch a rtkrcv instance as a child
 * @param {object} 'io'
 */
const openRTK = async (io) => {
  // Find the conf name in user document
  const userDoc = await UserModel.findOne(null, (error, doc) => {
    if (error) throw `(Database) ${error.errmsg}`;
    else if (doc === null) {
      throw '(Database) empty user document, check the database';
    }
    return doc;
  });

  // Find the config by the name
  let configDoc = await ConfigModel.findOne({ name: userDoc.currentConf }, (error, doc) => {
    if (error) throw `(Database) ${error.errmsg}`;
    return doc;
  });

  // If conf not found, use default.conf instead
  if (configDoc === null) {
    configDoc = await ConfigModel.findOne({ name: 'default.conf' }, (error, doc) => {
      if (error) throw `(Database) ${error.errmsg}`;
      else if (doc === null) {
        throw '(Database) fatal error... default config is empty, check the database';
      }
      return doc;
    });
  }
  
  const rtkParams = jsonToRtkSettings(JSON.stringify(configDoc.options));
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib') + '/rtkrcv';
  const configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs') + '/' + configDoc.name;

  // Create a temporary file
  fs.writeFile(configPath, rtkParams, (err) => {
    if (err) throw '(Controller) Unable to write a config file';
  });

  // Starts rtkrcv and update the state
  if (process.env.NODE_ENV !== 'production') {
    var parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort, '-r', '2', '-t', '3']
  } else {
    var parameters = ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort];
  }

  // Starts rtklib child process
  const rtkrcv = spawn(rtkPath, parameters);
  
  // Delete the temporary file
  fs.unlinkSync(configPath);
  
  rtklib.updateState('isOpen', true, io);
  rtklib.updateState('isRunning', false, io);
  rtklib.updateState('pid', rtkrcv.pid);
  
  rtkrcv.on('error', (err) => {
    const error = err.toString();
    logger.error(error.substr(error.indexOf('spawn')));
    rtklib.updateState('isOpen', false, io);
    rtklib.updateState('isRunning', false, io);
    // TODO : Show an error in frontend
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
}

/* 
* Connects to rtkrcv terminal
*/
const connectTelnet = (server) => {
  server.connect({
    host: confNet.host,
    port: confNet.telnetPort,
    timeout: 2500,
  });
}


const initTelnetInstance = (server, io) => {
  server.on('connect', () => {
    logger.info('connected to telnet');
    server.send('rtkpsswd32\r\n');
    server.send('start\r\n');
    initWatcher(server, initWatcher);
  });

  server.on('timeout', () => {
    logger.warn('telnet timeout');
  });

  server.on('error', (error) => {
    const { errno, address, port } = error;
    logger.error(`Telnet ${errno} ${address}:${port}`);
  });

  server.on('close', () => {
    logger.info('Telnet connection closed');
    if (rtklib.checkState('isOpen')) {
      logger.info(`trying to connect to telnet ${server}`);
      setTimeout(connectTelnet, 2500, server);
    }
  });

  let line = '';
  // display server response
  server.on('data', (chunk) => {
    let str = chunk.toString();

    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str[i];
        line += chr;

        if (/[\n\r]$/.test(chr)) {
            // process.stdout.write(line);
            if (line.indexOf('rtk server state') !== -1) {
              // console.log(line);
              const value = line.split(':');
              if (value[1].trim() === 'stop') {
                rtklib.updateState('isRunning', false, io);
              } else if (value[1].trim() === 'run') {
                rtklib.updateState('isRunning', true, io);
              }
            }
            line = '';
        }
    }
  });
}

export {
  openRTK,
  connectTelnet,
  sendCommand,
  initWatcher,
  initTelnetInstance,
};
