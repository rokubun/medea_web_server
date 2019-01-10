import logger from '../logger';
import { rtklib } from '../RTKLIB/state';
import whitelist from 'validator/lib/whitelist';

/**
 * @param {object} io 
 */
const listenSocketsEvents = (io) => {
  io.sockets.on('connection', (client) => {
    const { remoteAddress } = client.request.connection;
    const ip = whitelist(remoteAddress, '\\[0-9\.\\]');

    io.sockets.emit('client-connected');

    logger.info(`${ip} connected via sockets`);
    io.sockets.emit('rtkrcv_status', { state: rtklib.checkState('isRunning') });

    client.on('disconnect', () => {
      logger.info(`${ip} disconnected from sockets`);
    });

    client.on('error', (err) => {
      logger.info(`An error from ${ip} : ${err}`);
    });
  });
}

export default listenSocketsEvents;
