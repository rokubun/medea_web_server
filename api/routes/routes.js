const express = require('express');
const router = express.Router();

// ================== Handlers ==================
const {
  getWelcome,
  getStatus,
  changeStatus,
  addConfig,
  getActualConfig,
  delConfig,
  editConfig,
  getAllConfigs,
} = require('./handlers');


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


// Get the actual config in use
router.get('/config', getActualConfig);

// Upload a new config file
router.post('/config', addConfig);

// Delete a config file
router.delete('/config/name=:name', delConfig);

// Edit a config file
router.put('/config/name=:name', editConfig);

// Get all rtklib settings in conf folder
router.get('/configs', getAllConfigs);


module.exports = router;
