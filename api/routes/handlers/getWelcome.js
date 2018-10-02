const PORT = require('../../config');

/**
 * GET METHOD
 */
const getWelcome = (req, res) => {
  res.send(`<h4>Medea API currently running on PORT => ${PORT} </h4>`);
}

module.exports = getWelcome;