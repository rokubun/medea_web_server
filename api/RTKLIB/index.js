var net = require('net');
var GPS = require('gps');

// Socket Io Instance Server
// var io = require('../server.js');

const {handleData} = require('./handlers/handleData');

// Terminal Colors
const chalk = require('chalk');

const debug = require('debug')('Sockets');

const gps = new GPS;

function initRTKclient(confNet, cb, io) {

  const client = net.createConnection(confNet, () => {
    debug(`Connected to RTKrcv, using ${confNet.host}:${confNet.port}`);
    // Listening RTKlib
    client.on('data', handleData);

    client.on('end', () => {
      debug('Disconnected from server');
    });
  });

  // If an error occurs... reconnects
  client.on('error', err => {
    if (err) {
      let data = { message: 'No receiving data...' };
      io.emit('connection_error_rtkrcv', data);
      debug(chalk.red(`An error ocurred trying to connect...`));
      setTimeout(cb, 2000, confNet, cb, io);
    }
  });
  
  debug(`Establishing connection to ${confNet.host}:${confNet.port}`);
}


function initSocketServer(io) {
  // To front-end
  const returnIo = io.on('connection', function (client) {
  
    debug(chalk.green.bgRed.bold(' Front-End Client connected to our Socket Server'), client.id);
    io.sockets.emit('client-connected');
  
    // client.on('leave', handleLeave)
  
  
    client.on('disconnect', function () {
      console.log('client disconnect...', client.id);
      // handleDisconnect()
    })
  
    client.on('error', function (err) {
      console.log('received error from client:', client.id);
      console.log(err);
    })
  })

  gps.on('GSV', function (data) {
    debug(`GPGSV to client ${data.raw}`);
    if (data.prn !== null)
    io.emit('gsv_event', data);
  });
  
  gps.on('GGA', function (data) {
    debug(`Emitting to client ${data.raw}`);
    io.emit('position', data);
  });

  gps.on('RMC', function (data) {
    debug(`Emitting to client ${data.raw}`);
    io.emit('rmc_event', data);
  });

  gps.on('GSA', function (data) {
    debug(`Emitting to client ${data.raw}`);
    io.emit('gsa_event', data);
  });
  
  gps.on('data', function (data) {
    io.emit('gps_state', gps.state);
  });

  return returnIo;
}

module.exports = { initRTKclient, initSocketServer, gps }
