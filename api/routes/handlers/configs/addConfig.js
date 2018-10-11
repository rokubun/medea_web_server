import fs from 'fs';

import logger from '../../../logger';
import { getClientIp } from '../../../logic';

/** 
 * POST METHOD
 * Takes the settings in base 64 and saves them to a file
 * @param {body} file
 */
const addConfig = (req, res) => {
  const ip = getClientIp(req);
  const { file } = req.body;
  const { configsPath, type } = req.custom;
  let dataParsed = new Buffer.from(file.data, 'base64')
  dataParsed = dataParsed.toString();
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

export default addConfig;
