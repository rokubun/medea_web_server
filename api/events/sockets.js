import whitelist from 'validator/lib/whitelist';

import logger from '../logger';
import { rtklib } from '../RTKLIB/state';

/**
 * @param {object} io 
 */
const listenSocketEvents = async (io) => {
  let ip;
  const client = await io.on('connection', (client) => {
    //logger.info('Socket initializted')  
    ip = whitelist(client.handshake.address, '\\[0-9\.\\]');
    return client;
  });


  io.sockets.emit('client-connected');

  logger.info(`Connection via sockets => ${ip}`);
  io.sockets.emit('rtkrcv_status', { state: rtklib.checkState('isRunning') });

  client.on('disconnect', () => {
    console.log('client disconnected...', client.id);
  });

  client.on('error', (err) => {
    console.log('received error from client:', client.id);
    console.log(err);
  });

  return client;
}

export default listenSocketEvents;
