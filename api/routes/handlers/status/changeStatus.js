import process from 'process';

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
  
  logger.info('Turn rtkrcv', state ? 'ON' : 'OFF');

  if (state && !checkState('isOpen')) {
    await openRTK(io, telnet, tcp);
  } else if (checkState('isOpen')) {
    process.kill(rtklib.checkState('pid'));
  }
  res.status(200).json({ message: 'State request successfully' , state: checkState('isRunning')});
}

export default changeStatus;
