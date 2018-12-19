import fs from 'fs';

import { resolveClientIp } from '../../../utils/resolvers';
import logger from '../../../logger';

import { ConfigModel } from '../../../database/models/config';

import Joi from 'joi';

/**
 * DEL METHOD
 * @param {params} name
 */
const delConfig = (req, res) => {
  const { configsPath, type } = req.custom;
  const ip = resolveClientIp(req);

  const paramSchema = Joi.object().keys({
    name: Joi.string().required(),
  }).unknown();

  const paramsValidation = Joi.validate(req.params, paramSchema);

  if (paramsValidation.error) {
    return res.status(400).json({ message: `Bad Request ${paramsValidation.error.details[0].message}` });
  }

  const { name } = req.params;

  if (type === 'rtk') {
    ConfigModel.findOne({ name }, function (err, doc) {
      if (err) {
        logger.error(`(Database) [${type}] ${name} Internal Server Error ${ip}`);
        return res.status(500).json({ message: 'Internal Server Error' });
      } if (doc === null) {
        logger.info(`(Database) [${type}] ${name} not found request by ${ip}`);
        return res.status(404).json({ message: 'Config not found' });
      }
      ConfigModel.deleteOne({ name }, function (err) {
        if (err) {
          logger.error(`(Database) [${type}] ${name} Internal Server Error ${ip}`);
          return res.status(500).json({ message: 'Internal Server Error' });
        } else {
          logger.info(`(Database) [${type}] ${name} successfully deleted by ${ip}`);
          return res.status(200).json({ message: 'Succesfully deleted' });
        }
      });
    });
  } else {
    const filePath = `${configsPath}/${name}`;
  
    fs.unlink(filePath, (error) => {
      if (error) {
        logger.error(`[${type}] ${name} not found in ${configsPath}, request by ${ip}`);
        return res.status(404).json({ message: 'File not found' });  
      }
      logger.info(`[${type}] ${name} successfully deleted by ${ip}`);
      return res.status(200).json({ message: 'Succesfully deleted' });
    });
  }
  
}

export default delConfig;
