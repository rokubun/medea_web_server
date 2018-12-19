import fs from 'fs';

import logger from '../../../logger';

import { rtkDefault } from '../../../config';

import {
  rtkSettingsToObject,
  // TODO: use isRtkConfig function
  isRtkConfig,
} from '../../../utils/rtkutils';

import { resolveClientIp } from '../../../utils/resolvers';

import { ConfigModel, rtkDictionary } from '../../../database/models/config';

import Joi from 'joi';


/**
 * PUT METHOD
 * @param {params} name
 * @param {body} configs
 */
const editConfig = (req, res) => {
  const ip = resolveClientIp(req);
  
  const bodySchema = Joi.object().keys({
    configs: Joi.string().required().regex(/[a-z-A-Z-0-9-(). #=,:]/),
  }).unknown();
  
  const paramSchema = Joi.object().keys({
    name: Joi.string().required(),
  }).unknown();

  const bodyValidation = Joi.validate(req.body, bodySchema);
  const paramsValidation = Joi.validate(req.params, paramSchema);
  
  if (bodyValidation.error) {
    return res.status(400).json({ message: `Bad Request ${bodyValidation.error.details[0].message}` });
  }

  if (paramsValidation.error) {
    return res.status(400).json({ message: `Bad Request ${paramsValidation.error.details[0].message}` });
  }
  
  const { name } = req.params;
  const { configs } = req.body;

  if (name === 'default.conf') {
    return res.status(400).json({ message: `Bad Request you can't edit the default.conf` });
  }

  const rtkConfigs = rtkSettingsToObject(configs);

  const keyValidation = Object.keys(rtkConfigs).filter(key => {
    if (rtkDictionary.indexOf(key) === -1) {
      // Key don't found... then invalid key
      return `Invalid key => ${key}`;
    }
  })[0];

  if (keyValidation) {
    return res.status(400).json({ message: `Invalid parameter ${keyValidation}` });
  }

  ConfigModel.findOne({ name }, function (err, doc) {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    else if (doc === null) {
      logger.error(`editing ${name} by ${ip}`);
      return res.status(404).json({ message: 'Config not found' });
    }

    doc.options = rtkConfigs;

    doc.save((error, doc) => {
      if (error) {
        if (error.name === 'ValidationError') {
          // TODO : Send the invalid value
          return res.status(400).json({ message: `Invalid values sent!` });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      logger.info(`sucessfully edited by ${ip}`);
      return res.status(200).json({ message: 'Succesfully edited' });
    });
  });

}

export default editConfig;
