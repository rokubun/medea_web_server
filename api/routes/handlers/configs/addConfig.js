import fs from 'fs';

import logger from '../../../logger';

// Utils
import { resolveClientIp } from '../../../utils/resolvers';
import { rtkSettingsToObject } from '../../../utils/rtkutils';

import { ConfigModel } from '../../../database/models/config';

import Joi from 'joi';

/** 
 * POST METHOD
 * Takes the settings in base 64 and saves them to a file
 * @param {body} file
 */
const addConfig = (req, res) => {
  const ip = resolveClientIp(req);
  const { configsPath, type } = req.custom;

  const schema = Joi.object().keys({
    file: Joi.object().keys({
      name: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }).unknown();
  
  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).json({ message: `Bad Request ${validation.error.details[0].message}` });
  }
  
  const { file } = req.body;
  let dataParsed = new Buffer.from(file.data, 'base64').toString();

  if (type === 'rtk') {
    const config = new ConfigModel;
  
    config.name = file.name.slice(0, 12);

    config.options = rtkSettingsToObject(dataParsed);

    config.save((error, config) => {
      if (error) {
        logger.error(`(Database) ${error.errmsg}`);
        return res.status(409).json({ message: 'There is a profile with the same name', error });
      }
      logger.info(`(Database) new config ${config.name} submitted`);
      return res.status(200).json({ message: 'Config successfully updated' });
    });

  } else {
    // For ublox settings
    try {
      const files = fs.readdirSync(configsPath);
      if (files.indexOf(file.name) === -1) {
        fs.writeFile(`${configsPath}/${file.name}`, dataParsed, (err) => {
          if (err) {
            logger.error(`[${type}] saving the config... uploaded by ${ip}`);
            res.status(406).json({ message: 'Error saving the file', error: err });
          } else {
            logger.info(`[${type}] config has been saved! uploaded by ${ip}`);
            res.status(200).json({ message: 'File successfully updated' });
          }
        });
      } else {
        logger.info(`[${type}] ${ip} tried to upload a file with a name used`);
        res.status(409).json({ message: 'There is a file with the same name' });
      }
    } catch (error) {
      logger.error(`reading the dir ${configsPath}`);
    }
  }
}

export default addConfig;
