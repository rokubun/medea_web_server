'use strict';

const spawn = require('child_process').spawn;
const debug = require('debug')('RtkController');
var path = require('path');

const telnet = require('telnet-client');
const { rtklib } = require('./state');
const isRunning = require('is-running');

const { confNet } = require('../config');

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
 * @param {string} 'configFile'
 * @return {object} 'io'
 */
const openRTK = (configFile, io) => {
  if (!configFile) {
    configFile = 'rok-rtk.conf';
  }
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib') + '/rtkrcv';
  const configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs') + '/' + configFile;

  debug('Using this rtkrcv path : ', rtkPath);
  debug('Using this config path : ', configPath);

  // Starts rtkrcv and update the state
  const rtkrcv = spawn(rtkPath, ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort]);
  rtklib.updateState('isOpen', true, io);
  rtklib.updateState('isRunning', false, io);
  rtklib.updateState('pid', rtkrcv.pid);
  
  rtkrcv.on('error', (err) => {
    debug(`${err.toString()}`);
    rtklib.updateState('isOpen', false, io);
    // TODO : Show an error in frontend
  });

  rtkrcv.on('exit', (code) => {
    const pid = rtklib.checkState('pid');
    if (!isRunning(pid)) {
      debug(`rtkrcv process exited with code ${code}`);
      rtklib.updateState('isOpen', false, io);
    } else {
      debug(`rtkrcv error code ${code}, but is still running`);
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
    debug('connected to telnet');
    server.send('rtkpsswd32\r\n');
    server.send('start\r\n');
    initWatcher(server, initWatcher);
  });

  server.on('timeout', () => {
    debug('telnet timeout...');
  });

  server.on('error', (error) => {
    debug(error);
  });

  server.on('close', () => {
    debug('Telnet connection closed');
    if (rtklib.checkState('isOpen')) {
      debug(`Trying to connect to telnet ${server}`);
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


module.exports = {
  openRTK,
  connectTelnet,
  sendCommand,
  initWatcher,
  initTelnetInstance,
};
