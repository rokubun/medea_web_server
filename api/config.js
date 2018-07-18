// Loading envars
require('dotenv').config();

const PORT = process.env.PORT || 3005;

const FRONT_PORT = process.env.FRONT_PORT || 80;

// * Note : This configuration points to RTKrcv
const confNet = {
  port: process.env.TCP_PORT || 50,
  host: process.env.HOST || '127.0.0.1:3000'
}


module.exports = {PORT, FRONT_PORT, confNet};