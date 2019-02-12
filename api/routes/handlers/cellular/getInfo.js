// import SerialPort from 'serialport';
const SerialPort = require('serialport');

const getValue = (data, valueIndex) => (data.split(',')[valueIndex]);

/**
 * GET METHOD
 * It returns the operator name, intensity and connection type
 */
const getInfo = async (req, res) => {
  const Readline = SerialPort.parsers.Readline;
  const parser = new Readline();
  const serialport = new SerialPort('/dev/ttyACM2');
  let info = {};
  let countTimer = 500;
  const commands = ['AT+UDOPN=7\r', 'AT+CSQ\r', 'AT+UCELLINFO?\r'];
  
  // Pipe the parser to trigger events
  serialport.pipe(parser);
  
  commands.forEach((command) => {
    setTimeout(() => (serialport.write(command)), countTimer);
    countTimer += 500;
  });
  
  parser.on('data', (data) => {
    const dictionary = ['+UDOPN:', '+CSQ:', '+UCELLINFO:'];
    console.log(data)
    switch (data.split(' ')[0]) {
      case dictionary[0]:
        info.provider = getValue(data, 1);
        console.log(info)
        break;
      case dictionary[1]:
        info.intensity = parseInt(getValue(data, 1));
        console.log(info)
        break;
      // 2G: 0,1 | 3G: 2-4 | 4G: 5-6
      case dictionary[2]:
        info.type = parseInt(getValue(data, 1));

        if (serialport.isOpen) {
          serialport.close(error => {
            if (error) console.log(error);
          });
        }
        return res.status(200).json(info);
    }
  });
}

export default getInfo;
