import logger from '../logger';
import { rtklib } from '../RTKLIB/state';
import isRunning from 'is-running';

import { connectTelnet } from '../RTKLIB/clients';



const sendCommand = (command, server) => {
  server.send(command + '\r\n');
}

const initWatcher = (server, cb) => {
  const pid = rtklib.checkState('pid');
  if (isRunning(pid)) {
    sendCommand('status', server);
    setTimeout(cb, 1000, server, cb);
  }
}


/**
 * 
 * @param {*} server 
 * @param {*} io 
 */
const listenTelnetEvents = (server, io) => {
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
    setTimeout(connectTelnet, 2500, server);
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

export default listenTelnetEvents;
