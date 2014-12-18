#!/usr/bin/env node

var config = require('../config');
var hue = new (require('node-hue-api').HueApi)();
var hostName = config.get('hub:host');
var userName = 'server';
var userDescription = 'Node.js server';

function displayResult(result){
  console.log('User account: ', result);
}

function displayError(err) {
  console.error(err);
}

hue.registerUser(hostName, userName, userDescription)
  .then(displayResult)
  .fail(displayError);