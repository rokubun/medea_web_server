const fs = require('fs');

const logger = require('../../../logger');

const { getClientIp } = require('../../../logic/logic');

const { configsPath } = require('../../../config');

/** 
 * POST METHOD
 * Takes the settings in base 64 and saves them to a file
 * @param {body} file
 */
const addConfig = (req, res) => {
  const ip = getClientIp(req);
  const fileName = req.body.file.name;
  const fileData = new Buffer.from(req.body.file.data, 'base64');
  const fileString = fileData.toString();
  // TODO : Check if the filename exists if exits... rename it with "name + the date"
  fs.writeFile(`${configsPath}/${fileName}`, fileString, (err) => {
    if (err) {
      logger.error(`Error saving the rtkconfig... uploaded by ${ip}`);
      res.status(406).json({ message: 'Error saving the file', error: err });
    } else {
      logger.info(`Rtkconfig has been saved! uploaded by ${ip}`);
      res.status(200).json({ message: 'File successfully updated' });
    }
  });
}

module.exports = addConfig;
