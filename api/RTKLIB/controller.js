'use strict';

const spawn = require('child_process').spawn;
const debug = require('debug')('RtkReceiver');
var path = require('path');

const { rtklib } = require('./state');
const isRunning = require('is-running');

const { confNet } = require('../config');

/**
 * Launch a rtkrcv instance as a child
 * @param {string} 'configFile'
 * @return {object} 'io'
 */
const openRTK = (configFile, io) => {
  let configPath;
  
  const rtkPath = path.join(__dirname, '..', '..', 'rtklib');

  if (!configFile) {
    configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs', 'rok-rtk.conf');
  } else {
    configPath = path.join(__dirname, '..', '..', 'rtklib', 'confs', configFile);
  }
  
  // Starts rtkrcv and update the state
  const rtkrcv = spawn(rtkPath + '/rtkrcv', ['-o', configPath, '-w', 'rtkpsswd32', '-p', confNet.telnetPort]);
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
const connectTelnet = (server, io) => {
  server.on('connect', () => {
    server.send('rtkpsswd32\r\n');
  });

  server.on('error', (error) => {
    console.log(error);
  })

  server.on('close', () => {
    debug(`Telnet connection closed`);
    // TODO : Check if rtklib is running, if it's running, try to close and re-open rtkrcv
    setTimeout((server) => {
      debug(`Trying to connect to telnet ${server}`);
      connectTelnet(server);
    }, 2000, server, connectTelnet);
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

const sendCommand = (command, server) => {
  server.send(command + '\r\n');
}

const initWatcher = (server, cb) => {
  setTimeout(cb, 1000, server, cb);
  sendCommand('status', server);
}

module.exports = {
  openRTK,
  connectTelnet,
  sendCommand,
  initWatcher,
};
