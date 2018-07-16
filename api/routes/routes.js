const express = require('express');
const router = express.Router();

// ======================= Middlewares =======================
const getWelcome = require('./handlers/getWelcome');
const postSettings = require('./handlers/postSettings');
const getStatus = require('./handlers/getStatus');
const changeStatus = require('./handlers/changeStatus');


// Root
router.get('/', getWelcome);

// Upload a file
router.post('/settings', postSettings);

// Check medea status
router.get('/status', getStatus);

// Change medea Status
router.put('/status', changeStatus);



module.exports = router;