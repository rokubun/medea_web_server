// Loading envars
require('dotenv').config();

const path = require('path');

const PORT = process.env.PORT || 3005;

const FRONT_PORT = process.env.FRONT_PORT || 80;

// * Note : This configuration points to RTKrcv
const confNet = {
  port: process.env.TCP_PORT || 50,
  telnetPort: process.env.TELNET_PORT || 49,
  host: process.env.HOST || '127.0.0.1'
}

// Where configs are stored
const configsPath = path.join(__dirname, '..', 'rtklib', 'confs');

// Medea default settings
const rtkDefault = {
  'inpstr1-type': 'serial',
  'inpstr1-path': 'ttyAMA4:115200:8:n:1:off',
  'inpstr1-format': 'ubx',
  'outstr1-type': 'tcpsvr',
  'outstr1-path': '127.0.0.1:50',
  'outstr1-format': 'nmea',
};

module.exports = { PORT, FRONT_PORT, confNet, configsPath, rtkDefault };