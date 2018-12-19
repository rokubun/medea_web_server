import { rtklib } from '../../../RTKLIB/state';
const { checkState } = rtklib;

/**
 * GET METHOD
 */
const getStatus = (req, res) => {
  let isRunning;
  let isOpen;

  try {
    isRunning = checkState('isRunning');
  } catch (err) {
    throw Error(err);
  }
  try {
    isOpen = checkState('isOpen');
  } catch (err) {
    throw Error(err);
  }
  return res.status(200).json({ isRunning, isOpen });
}

export default getStatus;
