const fs = require('fs');

const chalk = require('chalk');
const debug = require('debug')('UploadFile');

const { getClientIp } = require('../../logic');

// takes the settings in base 64 and saves them to a file
const postSettings = (req, res) => {
  const ip = getClientIp(req);
  const fileName = req.body.file.name;
  const fileData = new Buffer.from(req.body.file.data, 'base64');
  const fileString = fileData.toString();
  // TODO : Check if the filename exists if exits... rename it with "name + the date"
  fs.writeFile(`RTKLIB/configs/${fileName}`, fileString, (err) => {
    if (err) {
      debug(chalk.blue(`Error saving the rtkconfig... uploaded by ${ip}`));
      res.status(406).json({ message: 'Error saving the file' });
    } else {
      debug(chalk.blue(`Rtkconfig has been saved! uploaded by ${ip}`));
      res.status(202).json({ message: 'File successfully updated' });
    }
  });
}

module.exports = postSettings;
