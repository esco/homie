#!/usr/bin/env node

var config = require('../config');
var HueApi = require("node-hue-api").HueApi;
var hostName = config.get('hub:host');
var userName = config.get('hub:user');
var api = new HueApi(hostName, userName);

function displayResult(result) {
    console.log(JSON.stringify(result, null, 2));
}

api.getFullState().then(displayResult).done();