// this function will be used to get all the rtkconfings inside the folder
import fs from 'fs';

import logger from '../../../logger';
import { resolveClientIp } from '../../../utils/resolvers';
import { readConfigFile } from '../../../utils/files';

import { ConfigModel } from '../../../database/models/config';

/**
 * It gets all configs from db in rtklib case or from files
 * GET METHOD
 */
const getAllConfigs = async (req, res) => {
  const { configsPath, type } = req.custom;
  const ip = resolveClientIp(req);

  if (type === 'rtk') {
    try {
      const result = await ConfigModel.find(null);
      logger.info(`${result.length} configs read by ${ip}`);
      return res.status(200).json({ message: 'Configs successfully read from db', configs: result });
    } catch (err) {
      return res.status(500).json({ message: '(Database) Internal Server Error' });
    }
  } else {
    fs.readdir(configsPath, (error, files) => {
      if (error) {
        logger.error(`reading the ${type} configs folder ${configsPath}, request by ${ip}`);
        return res.status(500).json({ message: `Error trying to access to ${type} configs folder` });
      }
      const configs = files.map((fileName) => (readConfigFile(configsPath, fileName)));
      logger.info(`${configs.length} configs read by ${ip}`);
      return res.status(200).json({ message: 'Configs successfully read', configs });
    });
  }
}

export default getAllConfigs;
