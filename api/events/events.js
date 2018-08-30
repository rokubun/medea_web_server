const net = require('net');
const GPS = require('gps');

const { parseData } = require('../logic');

const whitelist = require('validator/lib/whitelist');

const chalk = require('chalk');
const debug = require('debug')('Sockets');

const { rtklib } = require('../RTKLIB/state');

const gps = new GPS;

let gsv = {
  GPS: {satellites: []},
  GLONASS: {satellites: []},
}

const initTCPclient = (confNet, cb, io) => {
  const updateGSV = (sentence, type) => {
    const aSentence = sentence.split(',');
    const updated = GPS.Parse(sentence)
    gsv[type].satellites = [...gsv[type].satellites, ...updated.satellites];
    if (aSentence[1] === aSentence[2]) {
      io.sockets.emit('GSV_' + type, gsv[type]);
      gsv[type].satellites = [];
    }
  }
  
  const client = net.createConnection(confNet, () => {
    debug(`Connected to RTKrcv, using ${confNet.host}:${confNet.port}`);
    // Listening RTKlib
    client.on('data', (data) => {
      const medeaSentences = parseData(data);
      medeaSentences.forEach((sentence, i) => {
        try {
          gps.update(sentence);
        } catch (err) {
          debug(chalk.yellow('GPS.js'), chalk.red(err));
        }
        if (sentence.indexOf('GGA') !== -1) {
          io.sockets.emit('GGA', GPS.Parse(sentence));
        } else if (sentence.indexOf('GLGSA') !== -1) {
          io.sockets.emit('GLGSA', GPS.Parse(sentence));
        } else if (sentence.indexOf('GPGSA') !== -1) {
          io.sockets.emit('GPGSA', GPS.Parse(sentence));
        }else if (sentence.indexOf('GLGSV') !== -1) {
          updateGSV(sentence, 'GLONASS');
        } else if (sentence.indexOf('GPGSV') !== -1) {
          updateGSV(sentence, 'GPS');
        } else if (sentence.indexOf('RMC') !== -1) {
          io.sockets.emit('RMC', GPS.Parse(sentence));
        }
      });
    });

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


  return returnIo;
}

module.exports = { initTCPclient, initSocketServer, gps }
