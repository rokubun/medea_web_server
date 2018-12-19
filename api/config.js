// Loading envars
import dotenv from 'dotenv';

dotenv.config();

import path from 'path';

const PORT = process.env.PORT || 3005;
const FRONT_PORT = process.env.FRONT_PORT || 80;
const SERIAL_PORT = process.env.SERIAL_PORT || 4;
const DB_USER = process.env.DB_USER || 'medea';
const DB_PASS = process.env.DB_PASS || '123467890';

// * Note : This configuration points to RTKrcv
const confNet = {
  port: process.env.TCP_PORT || 50,
  telnetPort: process.env.TELNET_PORT || 49,
  host: process.env.HOST || '127.0.0.1'
};

// Where configs are stored
const paths = {
  rtklib: path.join(__dirname, '..', 'rtklib', 'confs'),
  ublox: path.join(__dirname, '..', 'ublox', 'confs'),
  root: __dirname,
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
  DB_USER,
  DB_PASS,
  confNet,
  paths,
  binPath,
  rtkDefault,
};
