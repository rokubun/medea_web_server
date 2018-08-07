const PORT = require('../../config');

function getReceiver(req, res) {
  res.send(`<h4>Medea API currently running on PORT => ${PORT} </h4>`);
}

module.exports = getReceiver;
