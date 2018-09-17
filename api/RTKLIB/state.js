const logger = require('../logger');
const chalk = require('chalk');

const rtklib = {
  isOpen: false,
  isRunning: false,
  pid: 0,
  countEmpties: 0,
  sumCount: () => {
    if (typeof(this.countEmpties) === 'number') {
      this.countEmpties += 1;
    } else {
      this.countEmpties = 0;
    }
  },
  resetCount: () => {
    this.countEmpties = 0;
  },
  checkCount: () => {
    const count = this.countEmpties;
    return count;
  },
  updateState: (type, state, io) => {
    if (this[type] !== state) {
      this[type] = state;
      logger.info(`${type} changes to ${state}`);
      // Only sends to clients if it's running
      if (type === 'isRunning') {
        logger.info(`${type} emitted to clients`);
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
