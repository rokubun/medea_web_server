'use strict';

const fixLastChar = require('../utils');

const handleData = data => {
  const {gps} = require('../index.js');
  data = data.toString().split('\r\n');
  data.forEach(function (line) {
    if (line.indexOf('GGA') !== -1) {
      gps.update(line);
    }
    else if (line.indexOf('RMC') !== -1) {
      gps.update(line);
    }
    else if (line.indexOf('GSV') !== -1) {
      //! WORKAROUND to fix GSV
      let nmea = line.split(/[\*,]/);
      if (nmea.length < 9 || nmea.length % 4 !== 1) {
        line = fixLastChar(line, nmea);
        // console.log(chalk.red.bgYellow(line));
        gps.update(line);
      }
    }
    else if (line.indexOf('GSA') !== -1) {
      //! WORKAROUND to fix GSA
      let nmea = line.split(/[\*,]/);
      if (nmea.length !== 19) {
        line = fixLastChar(line, nmea)
      }
      gps.update(line);
    }
  })
}

module.exports = {handleData};