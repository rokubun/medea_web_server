import { confNet } from '../config';
import { rtklib } from './state';
import logger from '../logger';

import isRunning from 'is-running';

/**
 * Connects to rtkrcv terminal to listen status
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
 * Connects to rtkrcv via TCP to listen results
 * @param {object} server
 */
const connectTcp = async (client) => {
  const pid = rtklib.checkState('pid');
  if (isRunning(pid)) {
    client.connect(confNet.port, confNet.host, () => {
      logger.info(`Tcp connected to RTKrcv, using ${confNet.host}:${confNet.port}`);
    });
  }
}

export { connectTcp, connectTelnet }