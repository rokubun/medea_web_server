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
const { openRTK, connectTelnet, initWatcher } = require('./RTKLIB/controller');


// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middlewares before start routes
app.use(configureHeaders);

// Create a socket instance
const io = require('socket.io')(http);

// Create telnet client
const server = new telnet();

server.connect({
  host: 'localhost',
  port: confNet.telnetPort,
});

// Initialize RTK Socket Client to receive data from rtkrcv
initTCPclient(confNet, initTCPclient, io);

// Initialize our Socket Server that will be used by front
initSocketServer(io);

// Open rtklib process
openRTK(null, io);
connectTelnet(server, io);
initWatcher(server, initWatcher);


app.use((req, res, next) => { req.body.server = server; next(); });

// Inject SocketIo to req
app.use((req, res, next) => { req.body.io = io; next(); });

app.use(router);


http.listen(PORT);
debug('API Listening ' + chalk.red.bgGreen.bold(PORT));
