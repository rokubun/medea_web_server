import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

import { SERIAL_PORT, binPath } from '../../../../config';

import logger from '../../../../logger';

// Loads the binary with the config file selected
const loadConfig = (req, res) => {
  const fileName = req.params.name;
  const { configsPath } = req.custom;
  const pathToFile = `${configsPath}/${fileName}`;

  if (fs.existsSync(pathToFile)) {
    let output = '';
    const ubloxBin = spawn(binPath, ['-p', SERIAL_PORT, '-f', pathToFile]);
  
    ubloxBin.stdout.on('data', (data) => {
      output = output.concat('\n', data.toString());
    });

    ubloxBin.on('close', (code) => {
      if (code !== 0) {
        logger.error(`u-cfg exited with code ${code}`);
        res.status(406).json({ message: 'Error loading the config', output});
      } else {
        res.status(200).json({ message: 'Config succesfully loaded', output });
      }
    });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
}

export default loadConfig;
