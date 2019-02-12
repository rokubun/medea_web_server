import logger from '../../../logger';

const { execSync } = require('child_process');

/**
 * GET METHOD
 */
const getStatus = (req, res) => {
  const source = 'source /root/medea_web_server/scripts';
  try {
    let status = execSync(`${source}/get_cellular_status.sh`).toString();
    res.status(200).json({ status: parseInt(status) });
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
}

export default getStatus;