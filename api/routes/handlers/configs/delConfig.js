import fs from 'fs';

import { getClientIp } from '../../../logic';
import { configsPath } from '../../../config';
import logger from '../../../logger';

/**
 * DEL METHOD
 * @param {params} name
 */
const delConfig = (req, res) => {
  const fileName = req.params.name;
  const ip = getClientIp(req);
  const filePath = `${configsPath}/${fileName}`;
  fs.unlink(filePath, (error) => {
    if (error) {
      res.status(404).json({ message: 'File not found' });  
      logger.error(`${fileName} not found in ${configsPath}, request by ${ip}`);
    } else {
      res.status(200).json({ message: 'Succesfully deleted' });
      logger.info(`${fileName} successfully deleted by ${ip}`);
    }
  });
}

export default delConfig;
