import fs from 'fs';

import logger from '../../../logger';

import { configsPath, rtkDefault } from '../../../config';

import {
  parseRtkConfigs,
  isRtkConfig,
  getClientIp,
} from '../../../logic';

/**
 * PUT METHOD
 * @param {params} name
 * @param {body} data
 */
const editConfig = (req, res) => {
  const ip = getClientIp(req);
  const fileName = req.params.name;
  const { data } = req.body;
  let rtkConfigs = '';
  const pathToFile = `${configsPath}/${fileName}`;

  if (data) {
    rtkConfigs = parseRtkConfigs(data);
  }
  
  const rtkOptions = Object.getOwnPropertyNames(rtkConfigs);
  const rtkDefaultOptions = Object.getOwnPropertyNames(rtkDefault);


  const anyOption = (option) => (arr = rtkOptions, fn = option) => (arr.some(fn));
  const rtkMatches = rtkDefaultOptions.filter(anyOption).length;

  if (data && rtkMatches === rtkDefaultOptions.length) {
    if (fs.existsSync(pathToFile)) {
      fs.writeFile(pathToFile, data, (err) => {
        if (err) {
          logger.error(`${fileName} edited by ${ip}`);
          res.status(500).json({ message: 'Error editing the file' });
        } else {
          logger.info(`sucessfully edited by ${ip}`);
          res.status(200).json({ message: 'Succesfully edited' });
        }
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } else {
    res.status(400).json({ message: 'Wrong values sent' });
  }
}

export default editConfig;
