import logger from '../logger';

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
      switch (type) {
        case 'isOpen':
          (state) ? logger.info('rtkrcv is not open') : logger.info('rtkrcv is open');
          break;
        case 'isRunning':
          (state) ? logger.info('rtkrcv is not running') : logger.info('rtkrcv is running');
          break;
        default:
          logger.info(`${type} changes to ${state}`);;
          break;
      }
      // Only sends to clients if it's running
      if (type === 'isRunning') {
        logger.info(`${type} state emitted to clients`);
        io.emit('rtkrcv_status', { state });
      }
    }
  },
  checkState: (type) => {
    const state = this[type];
    return state;
  },
};

export { rtklib };
