'use strict';

require('dotenv').config();

const telnet = require('telnet-client');
const bodyParser = require('body-parser');
const express = require('express');

const { PORT, confNet } = require('./config');
const { initTCPclient, initSocketServer } = require('./events');
const { openRTK, connectTelnet, initTelnetInstance } = require('./RTKLIB/controller');
const logger = require('./logger');

// Middlewares and routes
const configureHeaders = require('./middlewares/headers');
const routes = require('./routes/routes');

// Declare an express instance
const app = express();
const http = require('http').Server(app);

const { settingsToJson } = require('./logic')
// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middlewares before start routes
app.use(configureHeaders);

// Create the instances
const io = require('socket.io')(http);
const server = new telnet();


// Start all services and rtkrcv 
(async () => {
  try {
    await settingsToJson();
  } catch (err) {
    logger.error(err);
  } 

  initTelnetInstance(server, io, initTelnetInstance);
  initSocketServer(io);
  
  await openRTK(io);
  await setTimeout(() => (connectTelnet(server)), 2000);
  
  // Initialize RTK Socket Client to receive data from rtkrcv
  await initTCPclient(confNet, initTCPclient, io);
})();

// Injections
app.use((req, res, next) => { req.body.server = server; next(); });
app.use((req, res, next) => { req.body.io = io; next(); });

app.use(routes);

http.listen(PORT);

logger.info(`API started on port ${PORT}`);

module.exports = app;
