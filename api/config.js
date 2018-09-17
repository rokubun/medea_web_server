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


module.exports = { PORT, FRONT_PORT, confNet, configsPath };