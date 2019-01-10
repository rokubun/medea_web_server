import logger from '../../../logger';
import { resolveClientIp } from '../../../utils/resolvers';

import UserModel from '../../../database/models/user';

/**
 * GET METHOD
 * Returns the name of the current config
 */
const getCurrentConfig = (req, res) => {
  const ip = resolveClientIp(req);

  UserModel.findOne(null, function(err, doc) {
    if (err) {
      logger.error('Internal Server Error');
      return res.status(500).json({ message: 'Internal Server Error' });
    } else if (doc === null) {
      logger.error('user document seems to be empty');
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    logger.info(`${ip} received the config name in use`);
    return res.status(200).json({ message: 'Successfully read', name: doc.currentConf });
  });
}

export default getCurrentConfig;
