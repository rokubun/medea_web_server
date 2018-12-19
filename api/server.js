'use strict';

import dotenv from 'dotenv';
dotenv.config();

import telnet from 'telnet-client';
import bodyParser from 'body-parser';
import express from 'express';
import { Server } from 'http';

import { PORT, confNet, paths } from './config';
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

import { settingsToJson } from './utils/files';
import database from './database/connection';

// Parsing body requests
app.use(bodyParser.json({ limit: "5MB", type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Middlewares before start routes
app.use(configureHeaders);

// Create the instances
import socketIo from 'socket.io';
const io = socketIo(http);

const server = new telnet();


import User from './database/models/user';

/*=============================================
=            Section Start Services           =
=============================================*/

(async () => {
  await database().connection;

  // Find if the admin user exists and create it if not
  User.find((err, users) => {
    if (err) return logger.error(err);
      if (users.length === 0) {
        const user = new User({
          name: 'admin',
          password: '1234',
          currentConf: 'default.conf',
        });

        user.save((err, user) => {
          if (err) return logger.error(err);
          // Create the admin user
          logger.info('Creating the admin user');
        });
      }
  });

  try {
    await settingsToJson(paths.rtklib);
  } catch (err) {
    logger.error(err);
  }
  initTelnetInstance(server, io, initTelnetInstance);
  initSocketServer(io);
  
  try {
    await openRTK(io);
  } catch (err) {
    logger.error(err);
  }
  await setTimeout(() => (connectTelnet(server)), 2000);
  
  // Initialize RTK Socket Client to receive data from rtkrcv
  await initTCPclient(confNet, initTCPclient, io);
})();

/*=====  End of Start Services  ======*/


// Injections
app.use((req, res, next) => { req.body.server = server; next(); });
app.use((req, res, next) => { req.body.io = io; next(); });

app.use(routes);

http.listen(PORT);

logger.info(`API started on port ${PORT}`);

export default app;
