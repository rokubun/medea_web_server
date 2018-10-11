// this function will be used to get all the rtkconfings inside the folder
import fs from 'fs';

import logger from '../../../logger';
import { readConfigFile, getClientIp } from '../../../logic';

/**
 * GET METHOD
 */
const getAllConfigs = (req, res) => {
  const { configsPath, type } = req.custom;
  const ip = getClientIp(req);
  fs.readdir(configsPath, (error, files) => {
    if (error) {
      logger.error(`reading the ${type} configs folder ${configsPath}, request by ${ip}`);
      res.status(500).json({ message: `Error trying to access to ${type} configs folder` });
    } else {
      const configs = files.map((fileName) => (readConfigFile(configsPath, fileName)));
      logger.info(`${configs.length} configs read and sent by ${ip}`);
      res.status(200).json({ message: 'Successfully read', configs });
    }
  });
}

export default getAllConfigs;
