var express = require('express');
var config = require('./config');
var lights = require('./lib/lights');
var app = express();

console.log(config.get('welcomeLightIds'));

app.post('/lights/:id(\\d+)/on', function(req, res){

  lights.on(req.params.id)
    .then(function success(){
      console.log('light on');
      res.send(200);
    })
    .catch(function error() {
      res.send(400);
    })
    .done();
});

app.post('/lights/:id(\\d+)/off', function(req, res){

  lights.off(req.params.id)
    .then(function success(){
      console.log('light off');
      res.send(200);
    })
    .catch(function error() {
      res.send(400);
    })
    .done();
});

app.get('/lights/:id(\\d+)/name', function(req, res){

  lights.getNameById(req.params.id)
    .then(function success(name){
      console.log('light name ->', name);
      res.send(name);
    })
    .catch(function error(err) {
      console.error(err)
      res.send(400);
    })
    .done();
});

app.post('/lights/on', function(req, res){

  lights.allOn()
    .then(function success(){
      console.log('lights on');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    })
    .done();
});

app.post('/lights/off', function(req, res){

  lights.allOff()
    .then(function success(){
      console.log('lights off');
      res.send(200);
    })
    .catch(function error() {
      res.send(400);
    })
    .done();
});

app.post('/lights/color/:colorId', function(req, res){

  lights.allOn({color: req.params.colorId})
    .then(function success(){
      console.log('lights on');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    })
    .done();
});

app.post('/lights/:id(\\d+)/color/:colorId', function(req, res){

  lights.on(req.params.id, {color: req.params.colorId})
    .then(function success(){
      console.log('lights on');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    })
    .done();
});


app.post('/lights/:id(\\d+)/loop', function(req, res){

  lights.on(req.params.id, {loop: true})
    .then(function success(){
      console.log('lights on');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    })
    .done();
});

app.post('/lights/loop', function(req, res){

  lights.allOn({loop: true})
    .then(function success(){
      console.log('lights on');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    })
    .done();
});

app.get('/lights', function(req, res){

  lights.getLights()
    .then( function success(){
      console.log('lights off');
      res.send(200);
    })
    .catch( function error() {
      res.send(400);
    });
});

app.post('/lights/welcome', function(req, res){

  lights.welcome()
    .then(function success(){
      console.log('welcome back!');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    });
});

app.post('/lights/sexytime', function(req, res){

  lights.sexyTime()
    .then(function success(){
      console.log('sexy time!');
      res.send(200);
    })
    .catch(function error(err) {
      console.error(err);
      res.send(400);
    });
});

var port = config.get('port') || 3000;

app.listen(port, function(){
  console.log('homie listening on port ', port)
});