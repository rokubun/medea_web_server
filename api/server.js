'use strict';

let RTK = {
  status: 'OFF'
};

require('dotenv').config();

// Terminal Colors
const chalk = require('chalk');

const bodyParser = require('body-parser')

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


const { initRTKclient, initSocketServer } = require('./events');
const router = require('./routes/routes');
//const watchRTKserver = require('./RTKLIB/watcher');

// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middlewares before start routes
app.use(configureHeaders);

// Create a socket instance
const io = require('socket.io')(http);

// Initialize RTK Socket Client to receive data from rtkrcv
initRTKclient(confNet, initRTKclient, io);


// Initialize our Socket Server that will be used by front
initSocketServer(io);

// Watch if the rtkrcv is running and changes the state
//watchRTKserver(io);

// Inject SocketIo to req
app.use((req, res, next) => { req = { io }; next(); });

app.use(router);


http.listen(PORT);
debug('API Listening ' + chalk.red.bgGreen.bold(PORT));
