
import { exec } from 'child_process';
import logger from '../../../logger';

/**
 * PUT METHOD
 * Activates the tethering or desactivates it
 */
const useTethering = (req, res) => {
  const { tether } = req.params;
  let order;

  tether ? order = 'on' : order = 'off';

  const command = `connmanctl tether wifi ${order}`;
  exec(command, (error, stout, sterr) => {
    if (error) {
      if (sterr) {
        logger.error(sterr);
      }
      logger.error(error);
      res.status(500).json({ message: 'Issues using the tethering command' });
    } else {
      logger.info(stout);
      res.status(200).json({ message: 'Enabled tethering' });
    }
  });
}

export default useTethering;