const ip = require('ip');
const { FRONT_PORT } = require('../config');
const chalk = require('chalk');
const debug = require('debug')('Header');

// Defining allowOrigin
const allowOrigin = `http://${ip.address()}:${FRONT_PORT}`;
debug(chalk.blue(`Access-Control-Allow-Origin ${allowOrigin}`));

const headers = (req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  // To give access to local website
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:${FRONT_PORT}`);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
}

module.exports = headers;