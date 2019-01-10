'use strict';

import dotenv from 'dotenv';
dotenv.config();

import telnetClient from 'telnet-client';
import net from 'net';
import bodyParser from 'body-parser';
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { PORT, confNet, paths } from './config';

import {
  listenTelnetEvents,
  listenSocketsEvents,
  listenTcpEvents,
} from './events';

import {
  openRTK,
} from './RTKLIB/controller';

import logger from './logger';

// Middlewares and routes
import configureHeaders from './middlewares/headers'
import routes from './routes';

// Declare an express instance
const app = express();
const http = Server(app);

import { settingsToJson } from './utils/files';
import databaseConnection from './database/connection';
import db from './database/helpers';
import { connect } from 'tls';

// Parsing body requests
app.use(bodyParser.json({ limit: "5MB", type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Middlewares before start routes
app.use(configureHeaders);

// Create the instances
const io = socketIo(http);
const tcp = new net.Socket();
const telnet = new telnetClient();



/*=============================================
=            Database Connection              =
=============================================*/

(async () => {
  try {
    databaseConnection();
  } catch (err) {
    logger.error(err);
  }

  try {
    await db.createDefaultUser();
  } catch (err) {
    logger.error(`mongodb ${err}`);
  }

  try {
    await db.createDefaultConfig();
  } catch (err) {
    logger.error(err);
  }
})();

/*=====  End of Database Connection  ======*/
/*=============================================
=                Start Services               =
=============================================*/
(async () => {
  listenTelnetEvents(telnet, io);
  listenSocketsEvents(io);
  listenTcpEvents(tcp, io);

  try {
    await openRTK(io, telnet, tcp);
  } catch (err) {
    logger.error(err.message);
  }

})();

/*=====  End of Start Services  ======*/


// Injections
app.use((req, res, next) => { req.body.telnet = telnet; next(); });
app.use((req, res, next) => { req.body.tcp = tcp; next(); });
app.use((req, res, next) => { req.body.io = io; next(); });

app.use(routes);

http.listen(PORT);

logger.info(`API started on port ${PORT}`);

export default app;
