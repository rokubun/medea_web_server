import { rtklib } from '../../../RTKLIB/state';
import isRunning from 'is-running';

const { checkState } = rtklib;

/**
 * GET METHOD
 */
const getStatus = (req, res) => {
  const pid = checkState('pid');
  
  return res.status(200).json({ state: isRunning(pid) });
}

export default getStatus;
