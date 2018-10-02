const fs = require('fs');

const logger = require('../../../logger');

const { configsPath, rtkDefault } = require('../../../config');
const { parseRtkConfigs, isRtkConfig } = require('../../../logic');

/**
 * PUT METHOD
 * @param {params} name
 * @param {body} data
 */
const editConfig = (req, res) => {
  const fileName = req.params.name;
  const { data } = req.body;
  let rtkConfigs = '';
  const pathToFile = `${configsPath}/${fileName}`;

  if (data.length !== 0) {
    rtkConfigs = parseRtkConfigs(data);
  }
  
  const rtkOptions = Object.getOwnPropertyNames(rtkConfigs);
  const rtkDefaultOptions = Object.getOwnPropertyNames(rtkDefault);


  const anyOption = (option) => (arr = rtkOptions, fn = option) => (arr.some(fn));
  const rtkMatches = rtkDefaultOptions.filter(anyOption).length;

  if (rtkMatches === rtkDefaultOptions.length && data.length !== 0) {
    if (fs.existsSync(pathToFile)) {
      fs.writeFile(pathToFile, data, (err) => {
        if (err) {
          logger.error('Error editing the config');
          res.status(500).json({ message: 'Error editing the file' });
        } else {
          logger.info('Sucessfully edited');
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

module.exports = editConfig;
