'use strict';

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
module.exports = fixLastChar;
