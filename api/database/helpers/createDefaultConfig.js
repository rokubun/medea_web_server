import { ConfigModel } from '../models/config';

import findConfig from './findConfig';
import logger from '../../logger';

/**
 * Creates the default config if doesn't exist
 */
const createDefaultConfig = async () => {
  let config;

  try {
    config = await findConfig('default.conf');
  } catch (error) {
    throw new Error(error);
  }

  if (config === null) {
    const config = new ConfigModel;

    config.name = 'default.conf';

    try {
      config.save();
      logger.info('(Database) default.conf created');
    } catch (error) {
      throw new Error(`(Database) ${error.errmsg}`);
    }
  }
}

export default createDefaultConfig;
