import { confNet } from '../config';
import { rtklib } from './state';
import logger from '../logger';

import isRunning from 'is-running';

/**
 * Connects to rtkrcv terminal to interact via terminal and check the actual status
 * @param {object} server
 */
const connectTelnet = (client) => {
  const pid = rtklib.checkState('pid');
  if (isRunning(pid)) {
    client.connect({
      host: confNet.host,
      port: confNet.telnetPort,
      timeout: 2500,
    });
  }
}

/**
 * Connects to rtkrcv via TCP to listen processed results
 * It needs a TCP client instance and an io to notify frontend
 * @param {object} client
 * @param {object} io
 */
const connectTcp = async (client, io) => {
  const pid = rtklib.checkState('pid');
  if (isRunning(pid)) {
    client.connect(confNet.port, confNet.host, () => {
      logger.info(`Tcp connected to RTKrcv, using ${confNet.host}:${confNet.port}`);
      // Connected, no need to show the message on frontend
      io.emit('tcp_error', false);
    });
  }
}

export { connectTcp, connectTelnet }