// Loading envars
import dotenv from 'dotenv';

dotenv.config();

import path from 'path';

const PORT = process.env.PORT || 3005;

const FRONT_PORT = process.env.FRONT_PORT || 80;

const SERIAL_PORT = process.env.SERIAL_PORT || 4;

// * Note : This configuration points to RTKrcv
const confNet = {
  port: process.env.TCP_PORT || 50,
  telnetPort: process.env.TELNET_PORT || 49,
  host: process.env.HOST || '127.0.0.1'
};

// Where configs are stored
const configsPath = {
  rtklib: path.join(__dirname, '..', 'rtklib', 'confs'),
  ublox: path.join(__dirname, '..', 'ublox', 'confs'),
};

const binPath = path.join(__dirname, '..', 'ublox') + '/u-cfg';

// Medea default settings
const rtkDefault = {
  'inpstr1-type': 'serial',
  'inpstr1-path': 'ttyAMA4:115200:8:n:1:off',
  'inpstr1-format': 'ubx',
  'outstr1-type': 'tcpsvr',
  'outstr1-path': '127.0.0.1:50',
  'outstr1-format': 'nmea',
};


export {
  PORT,
  FRONT_PORT,
  SERIAL_PORT,
  confNet,
  configsPath,
  binPath,
  rtkDefault,
};
