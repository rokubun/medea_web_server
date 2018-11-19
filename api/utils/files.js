import moment from 'moment';
import path from 'path';
import fs from 'fs';
import prettyBytes from 'pretty-bytes';

import logger from '../logger';

/**
 * Is used to get the previous loaded configs stored in a json
 * @return {object}
 */
export const readRtkConfigs = () => {
  const jsonPath = path.join(__dirname, '..', 'RTKLIB', 'config.json');
  let jsonData = {};

  try {
    jsonData = fs.readFileSync(jsonPath);
    jsonData = JSON.parse(jsonData);
    logger.info(`loaded configs from stored json`);
  } catch (err) {
    logger.error(`unable to read config from json using defaults`);
    jsonData.error = true;
  }

  return jsonData;
}

/**
 * @param {string} 'configsPath'
 * @param {string} 'configName'
 * @return {object} 'newData'
 */
export const readConfigFile = (configsPath, configName) => {
  let newData = {};
  let stats, data;

  if (configsPath && configName && typeof (configsPath) === 'string' &&
    typeof (configName) === 'string') {

    try {
      data = fs.readFileSync(configsPath + '/' + configName)
    } catch (error) {
      logger.error(`trying to read a configFile, ${configsPath}/${configName}`);
    }

    try {
      stats = fs.statSync(configsPath + '/' + configName);
    } catch (error) {
      logger.error(`checking stats, ${configsPath}/${configName}`);
    }

    if (data && stats) {
      newData = {
        name: configName,
        str: data.toString(),
        mtime: moment(stats.mtime).format('lll'),
        size: prettyBytes(stats.size),
      };
    }

  }
  return newData;
}

/**
 * This function checks if config.json exits and creates it when it doesn't exist
 * @param {string} configsPath
 */
export const settingsToJson = (configsPath) => {
  const jsonPath = path.join(__dirname, '..', 'RTKLIB', 'config.json');

  let jsonData = {
    name: "default.conf",
    str: "",
    mtime: "",
    size: "",
  };

  // Read config JSON
  fs.readFile(jsonPath, 'utf8', async (err, data) => {
    if (err) {
      // unable to access to the file... create it
      try {
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData));
      } catch (error) {
        logger.error(`writing rtk json config ${jsonPath}`);
      }
    } else {
      // Use the data received
      jsonData = JSON.parse(data);
    }

    if (!fs.existsSync(`${configsPath}/${jsonData.name}`)) {
      logger.error(`reading rtklib config ${configsPath}/${jsonData.name}`);
    } else {
      // read configFile and returns an object
      jsonData = await readConfigFile(configsPath, jsonData.name);
      // Save new json config from configs folder to json folder
      if (data !== jsonData.str) {
        fs.writeFile(jsonPath, JSON.stringify(jsonData), (error) => {
          if (error) {
            logger.error('saving new config');
          }
        });
      }
    }
  });
}

