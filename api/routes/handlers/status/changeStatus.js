import process from 'process';
import isRunning from 'is-running';

import logger from '../../../logger';
import { openRTK } from '../../../RTKLIB/controller';
import { rtklib } from '../../../RTKLIB/state';

const { checkState } = rtklib;

/**
 * PUT METHOD
 * @param {body} state
 */
const changeStatus = async (req, res) => {
  const { state } = req.body;
  const { telnet, tcp, io } = req.body;
  
  logger.info(`Turn rtkrcv ${state ? 'ON' : 'OFF'}`);
  const pid = checkState('pid');

  if (state && !isRunning(pid)) {
    await openRTK(io, telnet, tcp);
  } else if (isRunning(pid)) {
    process.kill(pid);
  }

  return res.status(200).json({ message: 'State request successfully' , state: isRunning(pid)});
}

export default changeStatus;
