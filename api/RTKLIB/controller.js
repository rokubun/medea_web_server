'use strict';

import { spawn } from 'child_process';
import logger from '../logger';
import path from 'path';


import { rtklib } from './state';
import isRunning from 'is-running';
import { getRtkConfigsFromJson } from '../logic';

import { confNet } from '../config';

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
  const configs = await getRtkConfigsFromJson();

  if (configs.error) {
    configs.name = 'default.conf';
  }
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib') + '/rtkrcv';
  const configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs') + '/' + configs.name;

  logger.info('Rtkrcv path : ' + rtkPath);
  logger.info('Config path : ' + configPath);

  // Starts rtkrcv and update the state
  const rtkrcv = spawn(rtkPath, ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort]);
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
    if (!isRunning(pid)) {
      logger.error(`rtkrcv process exited with code ${code}`);
      rtklib.updateState('isOpen', false, io);
      rtklib.updateState('isRunning', false, io);
    } else {
      logger.error(`rtkrcv error code ${code}, but is still running`);
    }
  });

}


const checkRTKstatus = () => {
  if (rtklib.isOpen && rtklib.isRunning) { return true; }
  return false;
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
    logger.warn('telnet timeout...');
  });

  server.on('error', (error) => {
    logger.error(error);
  });

  server.on('close', () => {
    logger.info('Telnet connection closed');
    if (rtklib.checkState('isOpen')) {
      logger.info(`Trying to connect to telnet ${server}`);
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
