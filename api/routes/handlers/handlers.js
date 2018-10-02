// Main
const getWelcome = require('./getWelcome');

// Configs
const addConfig = require('./configs/addConfig');
const getAllConfigs = require('./configs/getAllConfigs');
const getActualConfig = require('./configs/getActualConfig');
const editConfig = require('./configs/editConfig');
const delConfig = require('./configs/delConfig');

// Status
const getStatus = require('./status/getStatus');
const changeStatus = require('./status/changeStatus');

module.exports = {
  getWelcome,
  addConfig,
  editConfig,
  delConfig,
  getAllConfigs,
  getActualConfig,
  getStatus,
  changeStatus,
};
