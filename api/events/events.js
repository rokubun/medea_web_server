const net = require('net');
const GPS = require('gps');

const { handleData } = require('../logic');

const whitelist = require('validator/lib/whitelist');

const chalk = require('chalk');
const debug = require('debug')('Sockets');

const { rtklib } = require('../RTKLIB/state');

const gps = new GPS;

const initTCPclient = (confNet, cb, io) => {
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
      
      debug(chalk.red(`Timeout trying to connect...`));
      setTimeout(cb, 10000, confNet, cb, io);
    }
  });
  
  debug(`Establishing connection to ${confNet.host}:${confNet.port}`);
}


const initSocketServer = (io) => {
  const returnIo = io.on('connection', function (client) {
    const ip = whitelist(client.handshake.address, '\\[0-9\.\\]');

    debug(chalk.yellow.bgBlue.bold(ip), chalk.green.bgBlue.bold('Connected via sockets'));
    io.sockets.emit('client-connected');
    
    debug(chalk.bgWhite.green.bold(
      `Sending rtkrcv state to client ${chalk.cyan(rtklib.checkState('isRunning'))}`),
      chalk.yellow.bgBlue.bold(ip)
    );
    io.sockets.emit('rtkrcv_status', { state: rtklib.checkState('isRunning') });
  
    client.on('disconnect', function () {
      console.log('client disconnected...', client.id);
    })
  
    client.on('error', function (err) {
      console.log('received error from client:', client.id);
      console.log(err);
    })
  })
    
  gps.on('GGA', (data) => {
    gps.state.quality = data.quality;
    gps.state.geoidal = data.geoidal;
    gps.state.alt = data.alt;
  });

  gps.on('data', (data) => {
    
  });
  // setInterval(() => {
  //   socket.emmit(gps.state)
  // }, 10000)

  return returnIo;
}

module.exports = { initTCPclient, initSocketServer, gps }
