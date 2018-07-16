'use strict';

require('dotenv').config();

// Terminal Colors
const chalk = require('chalk');

const bodyParser = require('body-parser')

// Loading express framework
const express = require('express');
const debug = require('debug')('Medea');


// Declaring an express instance
const app = express();

const http = require('http').Server(app);

// Loading configuration
const { PORT, confNet } = require('./config');

// ======================= Middlewares =======================
const headers = require('./middlewares/headers');


const { initRTKclient, initSocketServer } = require('./RTKLIB/index.js');
const router = require('./routes/routes');

// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configure headers
app.use(headers);

// Create a socket instance
const io = require('socket.io')(http);

// Initialize RTK Socket Client to receive data from rtkrcv
initRTKclient(confNet, initRTKclient, io);

// Initialize our Socket Server that will be used by front
initSocketServer(io);

// Inject SocketIo to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(router);


http.listen(PORT);
debug('API Listening ' + chalk.red.bgGreen.bold(PORT));