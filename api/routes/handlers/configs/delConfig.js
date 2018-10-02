const fs = require('fs');

const { configsPath } = require('../../../config');
const logger = require('../../../logger');

/**
 * DEL METHOD
 * @param {params} name
 */
const delConfig = (req, res) => {
  const fileName = req.params.name;

  const filePath = `${configsPath}/${fileName}`;
  fs.unlink(filePath, (error) => {
    if (error) {
      res.status(404).json({ message: 'File not found' });  
      logger.error(`${fileName} not found in ${configsPath}`);
    } else {
      res.status(200).json({ message: 'Succesfully deleted' });
      logger.info(`${fileName} successfully deleted`);
    }
  });
}

module.exports = delConfig;
