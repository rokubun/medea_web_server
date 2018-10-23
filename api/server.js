'use strict';

import dotenv from 'dotenv';
dotenv.config();

import telnet from 'telnet-client';
import bodyParser from 'body-parser';
import express from 'express';
import { Server } from 'http';

import { PORT, confNet, configsPath } from './config';
import { initTCPclient, initSocketServer } from './events';

import {
  openRTK,
  connectTelnet,
  initTelnetInstance
} from './RTKLIB/controller';

import logger from './logger';

// Middlewares and routes
import configureHeaders from './middlewares/headers'
import routes from './routes';

// Declare an express instance
const app = express();
const http = Server(app);

import { settingsToJson } from './logic'; 

// Parsing body requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middlewares before start routes
app.use(configureHeaders);

// Create the instances
import socketIo from 'socket.io';
const io = socketIo(http);

const server = new telnet();


// Start all services and rtkrcv 
(async () => {
  try {
    await settingsToJson(configsPath.rtklib);
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

export default app;
