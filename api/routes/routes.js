const express = require('express');
const router = express.Router();

// ================== Handlers ==================
const {
  getWelcome,
  postSettings,
  getReceiver,
  putReceiver,
  getAllSettings,
} = require('./handlers');


// Root
router.get('/', getWelcome);

// Check medea status
router.get('/status', getReceiver);

// Change medea Status
router.put('/status', putReceiver);


/** Configuration Files
* These api routes are made to interact with rtklib config files
*/

// Get all rtklib settings in conf folder
router.get('/setting', getAllSettings);

// Upload a new file
router.post('/setting', postSettings);


module.exports = router;
