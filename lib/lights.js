var Q = require('q');
var hue = require("node-hue-api");
var Color = require('color');
var config = require('../config');
var hostName = config.get('hub:host');
var userName = config.get('hub:user');
var sexyLightIds = config.get('sexyLightIds');
var welcomeLightIds = config.get('welcomeLightIds');
var lightState = hue.lightState;
var api = new hue.HueApi(hostName, userName);
var lights = {};
var lightsArray = null;

module.exports = lights;
lights.getLights = getLights;
lights.allOn = allOn;
lights.allOff = allOff;
lights.on = on;
lights.off = off;
lights.getNameById = getNameById;
lights.sexyTime = sexyTime;
lights.welcome = welcome;

function getLights() {
  var deferred = Q.defer();

  function resolveLights(lightData) {
    lightsArray = lightData.lights;
    deferred.resolve(lightsArray);
  }

  lightsArray
    ? deferred.resolve(lightsArray)
    : api
      .lights()
      .then(resolveLights)
      .done();

  return deferred.promise;
}

function allOn(options) {
  var exclusionMap;
  options = options || {};
  exclusionMap = createExclusionMap(options.exclude);

  return getLights()
    .then(function turnLightsOn(lightsArray) {
      var deferred = Q.defer();

      lightsArray.forEach(function(light){
        if (isExcluded(light, exclusionMap)) {
          return;
        }
        on(light.id, options).done();
      });
      deferred.resolve();
      return deferred.promise;
  });
}

function allOff(options) {
  var exclusionMap;
  options = options || {};
  exclusionMap = createExclusionMap(options.exclude);

  return getLights()
    .then(function turnLightsOff(lightsArray) {
      var deferred = Q.defer();

      lightsArray.forEach(function(light){
        if (isExcluded(light, exclusionMap)) {
          return;
        }
        off(light.id).done();
      });
      deferred.resolve();
      return deferred.promise;
  });
}

function on(lightId, options) {
  var state;
  var color;
  var effect;

  options = options || {};
  color = options.color ? Color(options.color) : null;
  effect = options.loop ? 'colorloop' : 'none';
  state = lightState.create().on();

  color
    ? state.rgb.apply(state, color.rgbArray())
    : state.white(400)

  state
    .brightness(100)
    .effect(effect);

  return api.setLightState(lightId, state);
}

function off(lightId) {
  var state = lightState.create().off();
  return api.setLightState(lightId, state);
}

function welcome() {
  var deferred = Q.defer();
  var total = welcomeLightIds.length;
  var resolved = 0;

  welcomeLightIds.forEach(function(lightId){
    on(lightId).then(function sucess(){
      if(++resolved == total) deferred.resolve();
    })
    .catch(function error(){
      deferred.reject(new Error('error turning on welcome lights'));
    });
  });

  return deferred.promise;
}

function sexyTime() {
  var state = lightState
    .create()
    .on()
    .rgb(255,0,0)
    .brightness(100);

  return allOff({ exclude: sexyLightIds }).then(function setRed() {
    var deferred = Q.defer();

    api.setLightState(2, state).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  });
}

function getLightByProp(prop, value) {
  return getLights().then(function(lightsArray){
    var light;
    var deferred = Q.defer();
    for (var i = 0; i < lightsArray.length; i++) {
      light = lightsArray[i];
      if (light.hasOwnProperty(prop) && light[prop] === value) {
        deferred.resolve(light);
        break;
      }
    }
    deferred.reject(new Error('No light found'));
    return deferred.promise;
  });
}

function getNameById(lightId) {
  return getLightByProp('id', lightId).then(function(light){
    var deferred = Q.defer();
    if (light) {
      deferred.resolve(light.name);
    } else {
      deferred.reject(new Error('light not found'));
    }
    return deferred.promise;
  });
}

function getIdByName(lightName) {
  return getLightByProp('name', lightName).then(function(light){
    var deferred = Q.defer();
    if (light) {
      deferred.resolve(light.name);
    } else {
      deferred.reject(new Error('light not found'));
    }
    return deferred.promise;
  });
}

function createExclusionMap(exclusionList) {
  var exclusionMap = {};

  exclusionList = exclusionList || [];

  if (!Array.isArray(exclusionList)) {
    exclusionList = [exclusionList];
  }

  exclusionList.forEach(function(lightId){
    exclusionMap[lightId] = true;
  });
  return exclusionMap;
}

function isExcluded(light, exclusionMap) {
  return exclusionMap.hasOwnProperty(light.id);
}