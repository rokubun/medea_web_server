import fs from 'fs';

import logger from '../../../logger';
import { getClientIp } from '../../../logic';
import { configsPath } from '../../../config';


/**
 * PUT METHOD
 * @param {params} name
 */
const editCurrentConfig = (req, res) => {
  const ip = getClientIp(req);
  const nameSelected = req.params.name;

  let jsonData = {
    name: nameSelected,
    str: "",
    mtime: "",
    size: "",
  };

  const data = JSON.stringify(jsonData);
  
  try {
    const files = fs.readdirSync(configsPath);
    if (files.indexOf(nameSelected) !== -1) {
      fs.writeFile('RTKLIB/config.json', data, (err) => {
        if (err) {
          logger.error('updating current config file');
          res.status(406).json({ message: 'Unable to edit the config' });
        }
        logger.info(`config.json updated by ${ip}`);
        res.status(200).json({ message: 'Sucessfully edited' });
      });
    } else {
      res.status(404).json({ message: 'config file not found' });
    }
  } catch (error) {
    logger.error(`reading the dir ${configsPath}`);
  }
}

export default editCurrentConfig;
