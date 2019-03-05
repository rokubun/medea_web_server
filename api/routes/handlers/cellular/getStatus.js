import logger from '../../../logger';

const { execSync } = require('child_process');

/**
 * GET METHOD
 */
const getStatus = (req, res, next) => {
  try {
    let status = execSync(`cat /sys/class/gpio/gpio0/value`).toString();
    res.status(200).json({ status: parseInt(status) });
  } catch (err) {
    next(err);
  }
}

export default getStatus;