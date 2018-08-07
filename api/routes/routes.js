const express = require('express');
const router = express.Router();

// ======================= Middlewares =======================
const getWelcome = require('./handlers/getWelcome');
const postSettings = require('./handlers/postSettings');
const getReceiver = require('./handlers/getReceiver');
const putReceiver = require('./handlers/putReceiver');


// Root
router.get('/', getWelcome);

// Upload a file
router.post('/settings', postSettings);

// Check medea status
router.get('/status', getReceiver);

// Change medea Status
router.put('/status', putReceiver);



module.exports = router;
