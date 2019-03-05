'use strict';

import dotenv from 'dotenv';
dotenv.config();

import telnetClient from 'telnet-client';
import net from 'net';
import bodyParser from 'body-parser';
import express from 'express';
import socketIo from 'socket.io';
import { Server } from 'http';

import { PORT } from './config';

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
import { injectConfigPath } from './middlewares/injections';
import routes from './routes';

import databaseConnection from './database/connection';
import db from './database/helpers';

/*=============================================
=                Instances                    =
=============================================*/

// REST API
const app = express();
const http = Server(app);

// App Communication
const io = socketIo(http);
const tcp = new net.Socket();
const telnet = new telnetClient();

/*=====        End of Instances        ======*/
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
/*=============================================
=                Express Routes               =
=============================================*/
// Parsing body requests
app.use(bodyParser.json({ limit: "5MB", type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Middlewares before start routes
app.use(configureHeaders);
app.use(injectConfigPath);
app.use((req, res, next) => { req.custom.telnet = telnet; next(); });
app.use((req, res, next) => { req.custom.tcp = tcp; next(); });
app.use((req, res, next) => { req.custom.io = io; next(); });

app.use(routes);

app.use((err, req, res, next) => {
  const { message } = err;
  if (err.type === 'warning') {
    logger.warn(message);
  } else {
    logger.error(message);
  }
  res.status(500).json({ error: message });
});

/*=====  End of Express Routes  ======*/

http.listen(PORT);
logger.info(`API started on port ${PORT}`);

export default app;
