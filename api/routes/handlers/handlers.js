// Main
import getWelcome from './getWelcome';

// Configs
import addConfig from './configs/addConfig';
import getAllConfigs from './configs/getAllConfigs';
import getActualConfig from './configs/getActualConfig';
import editCurrentConfig from './configs/editCurrentConfig';
import editConfig from './configs/editConfig';
import delConfig from './configs/delConfig';
import loadConfig from './configs/ublox/loadConfig';

// Status
import getStatus from './status/getStatus';
import changeStatus from './status/changeStatus';

// Wireless
// import getAllNetworks from './wireless/getAllNetworks';

// Tethering
import getTetherStatus from './tethering/getStatus';
import useTethering from './tethering/useTethering';

export {
  getWelcome,
  addConfig,
  editConfig,
  delConfig,
  getAllConfigs,
  getActualConfig,
  editCurrentConfig,
  getStatus,
  changeStatus,
  loadConfig,
  // getAllNetworks,
  getTetherStatus,
  useTethering,
};
