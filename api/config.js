// Loading envars
require('dotenv').config();

const PORT = process.env.PORT || 3005;

const FRONT_PORT = process.env.FRONT_PORT || 80;

// * Note : This configuration points to RTKrcv
const confNet = {
  port: process.env.TCP_PORT || 50,
  host: process.env.HOST || '192.168.1.112'
}


module.exports = {PORT, FRONT_PORT, confNet};