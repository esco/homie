#!/usr/bin/env node

var hue = require('node-hue-api');
var config = require('../config');
var hostName = config.get('hub:host');

hue.locateBridges()
  .then(displayBridges)
  .done();

function displayBridges(bridges) {
  console.log('Bridges', bridges);
}
