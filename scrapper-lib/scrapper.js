//const chalk = require('chalk');
const getCurrentFiatRate = require('./handlers/getCurrentFiatRate');
const getCurrentP2pRate = require('./handlers/getCurrentP2pRate');
const output = require('./common/output');

module.exports.getCurrentFiatRate = getCurrentFiatRate;
module.exports.getCurrentP2pRate = getCurrentP2pRate;
module.exports.output = output;
