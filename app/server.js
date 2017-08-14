var express = require('express');
var app = express();
var path = require('path');


//pages
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});
app.get('/message', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'msg.html'));
});
app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'profile.html'));
});
app.get('/hire', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'hire.html'));
});
app.get('/pass_reset', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'passreset.html'));
});
app.get('/password_resetter', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'passwordresetter.html'));
});
app.get('/verify', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'verify.html'));
});


//scripts
app.get('/homejs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'home.js'));
});
app.get('/msgjs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'msg.js'));
});
app.get('/profilejs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'profile.js'));
});
app.get('/hirejs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'hire.js'));
});
app.get('/pass_resetjs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'passreset.js'));
});
app.get('/password_resetterjs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'passwordresetter.js'));
});
app.get('/verifyjs', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'verify.js'));
});


//stylesheet
app.get('/stylesheet', function (req, res) {
  res.sendFile(path.join(__dirname, 'stylesheet.css'));
});


//assets


//app listening port
app.listen(8080, function () {
  console.log(`Recruiter app is listening on port 8080!`);
});
