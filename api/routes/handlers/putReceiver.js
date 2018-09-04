const chalk = require('chalk');
const debug = require('debug')('RtkReceiver');

const process = require('process');

const { openRTK, connectTelnet, sendCommand, checkRTKstatus } = require('../../RTKLIB/controller');
const { rtklib } = require('../../RTKLIB/state');
const { checkState } = rtklib;

const putReceiver = async (req, res) => {
  const { state } = req.body.data;
  const { server, io } = req.body;
  
  if (state && !checkState('isOpen')) {
    await openRTK(null, io);
    connectTelnet(server, io, connectTelnet);
    debug(chalk.yellow(`Trying to turn receiver`,
    state ? `${chalk.green('ON')}` : `${chalk.red('OFF')}`));
  } else {
    if (checkState('isOpen')) {
      //sendCommand('shutdown', server);
      process.kill(rtklib.checkState('pid'));
      debug(chalk.yellow(`Trying to turn receiver`,
      state ? `${chalk.green('ON')}` : `${chalk.red('OFF')}`));
      // TODO : Kill process and change isOpen to false
    }
  }
  res.status(202).json({ message: 'State request successfully' , state: checkState('isRunning')});
}

module.exports = putReceiver;
