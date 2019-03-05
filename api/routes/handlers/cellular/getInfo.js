import SerialPort from 'serialport';
import fs from 'fs';
import logger from '../../../logger';
const getValue = (data, valueIndex) => (data.split(/[,\s ]/g)[valueIndex]);

/**
 * GET METHOD
 * It returns the operator name, intensity and connection type
 */
const getInfo = async (req, res, next) => {
  const responses = [];
  let info = {};
  let countTimer = 500;
  const Readline = SerialPort.parsers.Readline;
  const parser = new Readline();
  const commands = ['AT+UDOPN=7\r', 'AT+CSQ\r', 'AT+UCELLINFO?\r'];

  // Check if serialport is available before use it
  try {
    fs.accessSync('/dev/ttyACM2');
  } catch (err) {
    return next(err);
  }

  const serialport = new SerialPort('/dev/ttyACM2', (err) => {
    if (err) {
      next(err);
    }
  });

  // Pipe the parser to trigger events
  serialport.pipe(parser);

  commands.forEach((command) => {
    setTimeout(() => (serialport.write(command)), countTimer);
    countTimer += 500;
  });
  
  parser.on('data', (data) => {
    const dictionary = ['+UDOPN:', '+CSQ:', '+UCELLINFO:'];
    switch (data.split(' ')[0].trim()) {
      case dictionary[0]:
        const str = getValue(data, 2).replace(/"/g, '');
        info.provider = str.charAt(0).toUpperCase() + str.slice(1);
        break;
      case dictionary[1]:
        const intensity = getValue(data, 1);
        // +19 - Excellent
        // 19/14 - Good
        // 12/4 - Fair
        // 2/10 - Poor
        if (intensity > 19) {
          info.intensity = 'Excellent';
        } else if (intensity <= 19 && intensity >= 14) {
          info.intensity = 'Good';
        } else if (intensity <= 12 && intensity > 4) {
          info.intensity = 'Fair';
        } else {
          info.intensity = 'Poor';
        }
        break;
      // 2G: 0,1 | 3G: 2-4 | 4G: 5-6
      case dictionary[2]:
        const type = parseInt(getValue(data, 2));
        if (type <= 1) {
          info.type = '2G';
        } else if (type >= 2 && type <= 4) {
          info.type = '3G';
        } else {
          info.type = '4G';
        }
        break;
      case 'ERROR':
        responses.push('ERROR');
        break;
      case 'OK':
        responses.push('OK');
        break;
    }

    if (responses.length === 3) {
      serialport.close(error => {
        if (error) logger.error(error.message);
      });
      if (responses.includes('ERROR')) {
        const error = new Error('Uncompleted AT commands output, check if pin is locked');
        error.type = 'warning';
        return next(error);
      } else {
        return res.status(200).json(info);
      }
    }
  });
}

export default getInfo;
