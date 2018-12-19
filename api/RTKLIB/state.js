import logger from '../logger';

const rtklib = {
  isOpen: false,
  isRunning: false,
  pid: 0,
  countEmpties: 0,
  sumCount: () => {
    if (typeof (rtklib.countEmpties) === 'number') {
      rtklib.countEmpties += 1;
    } else {
      rtklib.countEmpties = 0;
    }
  },
  resetCount: () => {
    rtklib.countEmpties = 0;
  },
  checkCount: () => {
    return rtklib.countEmpties;
  },
  updateState: (type, state, io) => {
    if (rtklib[type] !== state) {
      rtklib[type] = state;
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
    return rtklib[type];
  },
};

export { rtklib };
