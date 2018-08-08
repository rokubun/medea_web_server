const whitelist = require('validator/lib/whitelist');

const getClientIp = (req) => {
  let ipAddress;
  // The request may be forwarded from local web server.
  const forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    const forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  const ipAddressSanitized = whitelist(ipAddress, '\\[0-9\.\\]'); //^[0-9\.\-\/]+$)
  return ipAddressSanitized;
};


const handleData = data => {
  const {gps} = require('../events');
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
        line = fixLastChar(line, nmea);
      }
      gps.update(line);
    }
  })
}

// * METHODS TO USE FOR RTKLIB

/* @param line string */
// * This function deletes the last value that is not necessary...
//! WORKAROUND to fix GSV
const fixLastChar = (line, nmea) => {
  // console.log(nmea, 'without parse')
  let checksum = generateCheckSum(line, nmea[nmea.length -1]);
  // deletes the checksum
  nmea.pop();
  // Setting the new checksum
  nmea[nmea.length - 1] =  '*' + checksum;
  // Separating by chars
  nmea = nmea.join(',').split('');
  // Deleting the last comma before asterisk
  nmea.forEach((char, i) => {
    if(char === '*')
      delete nmea[i - 1]
  })
  return nmea.join('');
}

const generateCheckSum = (str, crc) => {
  var checksum = 0;
  for (var i = 1; i < str.length; i++) {
    var c = str.charCodeAt(i);
    
    if (c === 42) // Asterisk: *
    break;
    
    checksum ^= c;
  }
  return parseInt(crc, 16);
}
module.exports = { getClientIp, handleData, fixLastChar };
