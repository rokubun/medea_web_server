'use strict';

require('dotenv').config();

// Terminal Colors
const chalk = require('chalk');
const telnet = require('telnet-client');
const bodyParser = require('body-parser');

// Load express framework
const express = require('express');
const debug = require('debug')('Medea');


// Declare an express instance
const app = express();

const http = require('http').Server(app);

// Load configuration
const { PORT, confNet } = require('./config');

// ======================= Middlewares =======================
const configureHeaders = require('./middlewares/headers');


const { initTCPclient, initSocketServer } = require('./events');
const router = require('./routes/routes');
const { openRTK, connectTelnet, initTelnetInstance, initWatcher } = require('./RTKLIB/controller');

// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middlewares before start routes
app.use(configureHeaders);

// Create the instances
const io = require('socket.io')(http);
const server = new telnet();


const startAllServices = async () => {
  // Initialize the telnet instance
  await initTelnetInstance(server, io, initTelnetInstance);
  
  // Initialize our Socket Server that will be used by front
  await initSocketServer(io);
  
  await openRTK(null, io);
  await setTimeout(() => (connectTelnet(server)), 2000);
  // Initialize RTK Socket Client to receive data from rtkrcv
  await initTCPclient(confNet, initTCPclient, io);
}

startAllServices();

app.use((req, res, next) => { req.body.server = server; next(); });

// Inject SocketIo to req
app.use((req, res, next) => { req.body.io = io; next(); });

app.use(router);


http.listen(PORT);
debug('API Listening ' + chalk.red.bgGreen.bold(PORT));
