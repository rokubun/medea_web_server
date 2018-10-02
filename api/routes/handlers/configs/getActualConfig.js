const fs = require('fs');
const logger = require('../../../logger');
const { getClientIp } = require('../../../logic/logic');

/**
 * GET METHOD
 */
const getActualConfig = (req, res) => {
  const ip = getClientIp(req);
  fs.readFile('../../RTKLIB/config.json', 'utf8',  (err, data) => {
    if (err) {
      logger.error('Unable to use config.json');
      res.status(406).json({ message: 'Unable to read config.json' });
    }
    logger.info(`Requested rtk config.json by ${ip}`);
    res.status(200).json(data);
  });
}

module.exports = getActualConfig;
