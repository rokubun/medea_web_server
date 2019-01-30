import GPS from 'gps';
import isRunning from 'is-running';

import logger from '../logger';
import { rtklib } from '../RTKLIB/state';
import { parseData } from '../utils/nmea';

import { connectTcp } from '../RTKLIB/clients';


let gsv = {
  GPS: { satellites: [] },
  GLONASS: { satellites: [] },
  GALILEO: { satellites: [] },
}

/**
 * 
 * @param {*} confNet 
 * @param {*} cb 
 * @param {*} io 
 */
const listenTcpEvents = (client, io) => {
  const updateGSV = (sentenceParsed, sentence, type) => {
    const aSentence = sentence.split(',');
    gsv[type].satellites = [...gsv[type].satellites, ...sentenceParsed.satellites];
    // The end of new sentences
    if (aSentence[1] === aSentence[2]) {
      io.sockets.emit('GSV_' + type, gsv[type]);
      gsv[type].satellites = [];
    }
  }

  // Empties nmea sentences sent by rtkrcv
  const emptiesSentences = ['$GPGSA,A,1,,,,,,,,,,,,,,,*1E', '$GPGSV,1,1,0,,,,,,,,,,,,*49']

  // Listening RTKlib
  client.on('data', (data) => {
    const nmeaSentences = parseData(data);
    nmeaSentences.forEach((sentence, i) => {
      const sentenceParsed = GPS.Parse(sentence);
      if (sentence === emptiesSentences[0] || sentence === emptiesSentences[1]) {
        const count = rtklib.checkCount();
        if (count >= 55) {
          io.sockets.emit('empty_gnss_data', true);
          // Every 50 times it logs
          if ((count / 50) % 1 === 0) {
            logger.warn(`receiving empty gnss data (${count} times)`);
          }
        }
        rtklib.sumCount();
      } else {
        rtklib.resetCount();
        // Reset warnings on frontend
        io.sockets.emit('empty_gnss_data', false);
      }

      if (sentence.indexOf('GGA') !== -1) {
        io.sockets.emit('GGA', sentenceParsed);
      } else if (sentence.indexOf('GLGSA') !== -1) {
        io.sockets.emit('GLGSA', sentenceParsed);
      } else if (sentence.indexOf('GPGSA') !== -1) {
        io.sockets.emit('GPGSA', sentenceParsed);
      } else if (sentence.indexOf('GLGSV') !== -1) {
        updateGSV(sentenceParsed, sentence, 'GLONASS');
      } else if (sentence.indexOf('GPGSV') !== -1) {
        updateGSV(sentenceParsed, sentence, 'GPS');
      } else if (sentence.indexOf('GAGSV') !== -1) {
        updateGSV(sentenceParsed, sentence, 'GALILEO');
      } else if (sentence.indexOf('RMC') !== -1) {
        io.sockets.emit('RMC', GPS.Parse(sentence));
      }
    });
  });

  // If connections ends... reconnects
  client.on('end', () => {
    const data = { message: 'Disconnected from receiver...' };
    logger.info('Disconnected from server');
    io.emit('disconnected_rtkrcv', data);
    setTimeout(() => (connectTcp(client, io)), 2000);
  });

  // If an error occurs... reconnects
  client.on('error', err => {
    if (err) {
      // It's open and tcp can't connect... send to tcps
      const pid = rtklib.checkState('pid');
      if (isRunning(pid)) {
        io.emit('tcp_error', true);
        logger.info('TCP client timeout trying to connect...');
      }
      setTimeout(() => (connectTcp(client, io)), 10000);
    }
  });
}

export default listenTcpEvents;
