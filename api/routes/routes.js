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
router.get('/storage', getActualConfig);
router.put('/storage/name=:name', editCurrentConfig);


// Upload a new config file
router.post('/config', addConfig);

// Delete a config file
router.delete('/config/name=:name', delConfig);

// Edit a config file
router.put('/config/name=:name', editConfig);

// Get all rtklib settings in conf folder
router.get('/configs', getAllConfigs);


export default router;
