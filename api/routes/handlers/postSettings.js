const fs = require('fs');

const debug = require('debug')('postSettings');

// takes the settings in base 64 and saves them to a file
function postSettings (req, res) {
  const file = new Buffer.from(req.body.file, 'base64').toString();
  fs.writeFile('RTKLIB/rtklib.conf', file, (err) => {
    if (err) {
      res.status(406).json({ message: 'Error saving the file' });
      debug('Error saving the file!');
    }
    else {
      res.status(202).json({ message: 'File successfully updated' });
      debug('The file has been saved!');
    }
  });
}

module.exports = postSettings;