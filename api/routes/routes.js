import express from 'express';
const router = express.Router();

// ================== Handlers ==================
import {
  getWelcome,
  getStatus,
  changeStatus,
  addConfig,
  getCurrentConfig,
  updateCurrentConfig,
  delConfig,
  editConfig,
  getAllConfigs,
  loadConfig,
  scanNetworks,
  getCurrentNetwork,
  connectToNetwork,
  getTetherStatus,
  // useTethering,
  getCellularConfig,
  getCellularStatus,
  updateCellularStatus,
  updateCellularConfig,
  getCellularInfo,
} from './handlers';


// Main
router.get('/', getWelcome);

/** 
 * Status
 * These api routes are made to mutate or check the state of rtkrcv
 */

// Check medea status
router.get('/status', getStatus);

// Change medea Status
router.put('/status', changeStatus);


/** 
 * Configuration Files
 * These api routes are made to interact with rtklib config files
 */

// Current configs in use
router.get('/storage', getCurrentConfig);
router.put('/storage/name/:name', updateCurrentConfig);

// Rtklib routes
router.post('/rtklib/config', addConfig);
router.delete('/rtklib/config/name/:name', delConfig);
router.put('/rtklib/config/name/:name', editConfig);
router.get('/rtklib/configs', getAllConfigs);

// Ublox routes
router.get('/ublox/configs', getAllConfigs);
router.delete('/ublox/config/name/:name', delConfig);
router.post('/ublox/config', addConfig);
router.put('/ublox/bin/name/:name', loadConfig);


// Wireless & Tethering
router.get('/wireless/networks', scanNetworks);
router.get('/wireless/network', getCurrentNetwork);
router.post('/wireless/network', connectToNetwork);


router.get('/tethering/status', getTetherStatus);
// router.put('/tethering/status', useTethering);

// Cellular
router.get('/cellular/config', getCellularConfig);
router.put('/cellular/config', updateCellularConfig);
router.get('/cellular/status', getCellularStatus);
router.put('/cellular/status', updateCellularStatus);
router.get('/cellular/info', getCellularInfo);


export default router;
