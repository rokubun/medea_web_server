import { rtklib } from '../../../RTKLIB/state';
const { checkState } = rtklib;

/**
 * GET METHOD
 */
const getStatus = (req, res) => {
  const isRunning = checkState('isRunning');
  const isOpen = checkState('isOpen');
  res.status(200).json({ isRunning, isOpen });
}

export default getStatus;
