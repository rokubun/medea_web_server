import fs from 'fs';

import logger from '../../../logger';
import { resolveClientIp } from '../../../utils/resolvers';

import Joi from 'joi';

import UserModel from '../../../database/models/user';
import { ConfigModel } from '../../../database/models/config';

/**
 * PUT METHOD
 * This methods is to update the config already in use by the admin user
 * @param {params} name
 */
const updateCurrentConfig = (req, res) => {
  const ip = resolveClientIp(req);
  
  const schema = Joi.object().keys({
    name: Joi.string().required(),
  }).unknown();
  
  const validation = Joi.validate(req.params, schema);
  
  if (validation.error) {
    return res.status(400).json({ message: `Bad request ${validation.error.details[0].message}` });
  }
  
  const { name } = req.params;

  
  // Find in configs to check if exist before update the user
  ConfigModel.findOne({ name }, function (err, doc) {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    else if (doc === null) {
      return res.status(404).json({ message: 'Config selected not found in db' });
    }
    UserModel.findOne(null, function (err, doc) {
      if (err) return res.status(500).json({ message: 'Internal Server Error' });
      else if (doc === null) {
        return res.status(404).json({ message: 'No users found in db' });
      }

      doc.currentConf = name;

      doc.save((error, doc) => {
        if (error) {
          if (error.name === 'ValidatorError') {
            return res.status(400).json({ message: `Bad Request ${error.path}` });
          }
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        logger.info(`user config updated by ${ip}`);
        return res.status(200).json({ message: 'Current config successfully updated' });
      });
    });
  });
}

export default updateCurrentConfig;
