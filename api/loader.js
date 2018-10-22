// Set options as a parameter, environment variable, or rc file.
// Loads ESM syntax to server.js
require = require("esm")(module/*, options*/);
module.exports = require("./server.js");