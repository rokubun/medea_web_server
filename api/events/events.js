const net = require('net');
const GPS = require('gps');

const { handleData } = require('../logic');

const whitelist = require('validator/lib/whitelist');

const chalk = require('chalk');
const debug = require('debug')('Sockets');

const gps = new GPS;

function initRTKclient(confNet, cb, io) {

  const client = net.createConnection(confNet, () => {
    debug(`Connected to RTKrcv, using ${confNet.host}:${confNet.port}`);
    // Listening RTKlib
    client.on('data', handleData);

    // If connections ends... reconnects
    client.on('end', () => {
      const data = { message: 'Disconnected from receiver...' };
      debug('Disconnected from server');
      io.emit('disconnected_rtkrcv', data);
      setTimeout(cb, 2000, confNet, cb, io);
    });
  });

  // If an error occurs... reconnects
  client.on('error', err => {
    if (err) {
      const data = { message: 'No receiving data from receiver...' };
      io.emit('connection_error_rtkrcv', data);
      
      debug(chalk.red(`An error ocurred trying to connect...`));
      setTimeout(cb, 10000, confNet, cb, io);
    }
  });
  
  debug(`Establishing connection to ${confNet.host}:${confNet.port}`);
}


function initSocketServer(io) {
  // To front-end
  const returnIo = io.on('connection', function (client) {
    const ip = whitelist(client.handshake.address, '\\[0-9\.\\]');

    debug(chalk.yellow.bgBlue.bold(ip), chalk.green.bgBlue.bold('Connected via sockets'));
    
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
