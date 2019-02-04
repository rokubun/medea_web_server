import logger from '../logger';

const rtklib = {
  isRunning: false,
  pid: null,
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
  updateState: (type, newState, io) => {
    const prevState = rtklib.checkState('isRunning');
    if (prevState !== newState) {
      // update the state
      rtklib[type] = newState;
      switch (type) {
        case 'isRunning':
            if (newState)  {
              logger.info('rtkrcv is running');
            } else {
              logger.info('rtkrcv is not running')
            }
            io.emit('rtkrcv_status', { state: newState });
            break;
        default:
          logger.info(`${type} changes to ${newState}`);;
          break;
      }
    }
  },
  checkState: (type) => {
    const state = rtklib[type];
    return state;
  },
};

export { rtklib };
