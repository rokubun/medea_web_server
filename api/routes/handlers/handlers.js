// Main
import getWelcome from './getWelcome';

// Configs
import addConfig from './configs/addConfig';
import getAllConfigs from './configs/getAllConfigs';
import getCurrentConfig from './configs/getCurrentConfig';
import updateCurrentConfig from './configs/updateCurrentConfig';
import editConfig from './configs/editConfig';
import delConfig from './configs/delConfig';
import loadConfig from './configs/ublox/loadConfig';

// Status
import getStatus from './status/getStatus';
import changeStatus from './status/changeStatus';

// Wireless
//import scanNetworks from './wireless/scanNetworks';

// Tethering
import getTetherStatus from './tethering/getStatus';
import useTethering from './tethering/useTethering';

export {
  getWelcome,
  addConfig,
  editConfig,
  delConfig,
  getAllConfigs,
  getCurrentConfig,
  updateCurrentConfig,
  getStatus,
  changeStatus,
  loadConfig,
  //scanNetworks,
  getTetherStatus,
  // useTethering,
};
