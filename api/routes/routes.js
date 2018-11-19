import express from 'express';
const router = express.Router();

// ================== Handlers ==================
import {
  getWelcome,
  getStatus,
  changeStatus,
  addConfig,
  getActualConfig,
  delConfig,
  editConfig,
  getAllConfigs,
  editCurrentConfig,
  loadConfig,
  // getAllNetworks,
  getTetherStatus,
} from './handlers';

import { injectConfigPath } from '../middlewares/injections';

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

// !Setting rtk as default if the route has an incorrect param or empty
router.use(injectConfigPath);

// Current configs in use
router.get('/storage', getActualConfig);
router.put('/storage/name/:name', editCurrentConfig);

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
// router.get('/wireless/networks', getAllNetworks);

router.get('/tethering/status', getTetherStatus);
// router.put('/tethering/status', useTethering);
export default router;
