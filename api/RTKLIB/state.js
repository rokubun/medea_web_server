const debug = require('debug')('rtkStatus');
const chalk = require('chalk');

const rtklib = {
  isOpen: false,
  isRunning: false,
  pid: 0,
  updateState: (type, state, io) => {
    if (this[type] !== state) {
      this[type] = state;
      debug(`${type} changes to ${state}`);
      // Only sends to clients if it's running
      if (type === 'isRunning') {
        debug(chalk.blue(`${type} emitted to clients`));
        io.emit('rtkrcv_status', { state });
      }
    }
  },
  checkState: (type) => {
    const state = this[type];
    return state;
  },
};

module.exports = { rtklib };
