const chalk = require('chalk');
const logger = require('../../logger');

const process = require('process');

const { openRTK, connectTelnet, sendCommand, checkRTKstatus } = require('../../RTKLIB/controller');
const { rtklib } = require('../../RTKLIB/state');
const { checkState } = rtklib;

const putReceiver = async (req, res) => {
  const { state } = req.body.data;
  const { server, io } = req.body;
  
  logger.info('Turn rtkrcv', state ? 'ON' : 'OFF');

  if (state && !checkState('isOpen')) {
    await openRTK(io);
    setTimeout(() => (connectTelnet(server)), 2000);
  } else if (checkState('isOpen')) {
      process.kill(rtklib.checkState('pid'));
  }
  res.status(202).json({ message: 'State request successfully' , state: checkState('isRunning')});
}

module.exports = putReceiver;
