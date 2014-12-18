var nconf = require('nconf');
var config =
  nconf
    .argv()
    .env()
    .file({ file: './config.json' });
module.exports = config;