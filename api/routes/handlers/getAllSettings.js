// this function will be used to get all the rtkconfings inside the folder
const fs = require('fs');

const logger = require('../../logger');
const { readConfigFile } = require('../../logic');
const { configsPath } = require('../../config');

const getAllSettings = (req, res) => {
  fs.readdir(configsPath, (error, files) => {
    if (error) {
      logger.error(`Issues reading the rtklib configs folder ${configsPath}`);
      res.status(406).json({ message: 'Error trying to access to rtklib configs folder' });
    } else {
      const configs = files.map((fileName) => (readConfigFile(configsPath, fileName)));
      logger.info(`${configs.length} configs read and sent`);
      res.status(202).json({ message: 'Successfully read', configs });
    }
  });
}

module.exports = getAllSettings;
