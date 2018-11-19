import { exec } from 'child_process';
import logger from '../../../logger';

/**
 * GET METHOD
 * Get the tethering status
 */
const getStatus = (req, res) => {
  const errorMessage = 'Unable to get the Tethering Status';
  const successMessage = 'Success reading the Tethering Status';
  exec('ifconfig', (error, stdout, stderr) => {
    if (error) {
      if (stderr) {
        logger.error(stderr);
      }
      logger.error(error);
      res.status(500).json({ message: errorMessage });
    } else {
      if (stdout.includes('tether')) {
        res.status(200).json({ message: successMessage, status: true });
      } else {
        res.status(200).json({ message: successMessage, status: false });
      }
    }
  });
}

export default getStatus;
