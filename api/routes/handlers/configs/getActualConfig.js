import fs from 'fs';

import logger from '../../../logger';
import { resolveClientIp } from '../../../utils/resolvers';



/**
 * GET METHOD
 */
const getActualConfig = (req, res) => {
  const ip = resolveClientIp(req);
  const { rootPath } = req.custom;
  fs.readFile(`${rootPath}/RTKLIB/config.json`, 'utf8',  (err, data) => {
    if (err) {
      logger.error(`unable to use config.json by ${ip}`);
      logger.error(err);
      res.status(406).json({ message: 'Unable to read config.json' });
    } else {
      logger.info(`requested rtk config.json by ${ip}`);
      res.status(200).json({ message: 'Successfully read', config: data });
    }
  });
}

export default getActualConfig;
