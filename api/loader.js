// Set options as a parameter, environment variable, or rc file.
// Loads ESM syntax to server.js
const path = require('path');
require = require("esm")(module/*, options*/);
const pathResolved = path.join(__dirname, 'server.js');
module.exports = require(pathResolved);
