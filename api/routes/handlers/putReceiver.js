const chalk = require('chalk');
const debug = require('debug')('RtkReceiver');

const putReceiver = (req, res) => {
  // req.io.emit('status-changed', { status: 'ON' });
  const { state } = req.body.data;
  debug(chalk.yellow(`Trying to turn receiver`,
  state ? `${chalk.green('ON')}` : `${chalk.red('OFF')}`));
  // TODO : Call some script to check if it's running or use nodejs instead
  // res.status(202).json({ message: 'Status successfully changed' });
  res.status(409).json({ message: 'Error changing rtkrcv' });
}

module.exports = putReceiver;
