var express = require('express');
var app = express();
var path = require('path');

//pages
app.get('/', function (req, res) {
  console.log("GET home.html");
  res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});
app.get('/message', function (req, res) {
  console.log("GET msg.html");
  res.sendFile(path.join(__dirname, 'pages', 'msg.html'));
});
app.get('/profile', function (req, res) {
  console.log("GET profile.html");
  res.sendFile(path.join(__dirname, 'pages', 'profile.html'));
});
app.get('/hire', function (req, res) {
  console.log("GET hire.html");
  res.sendFile(path.join(__dirname, 'pages', 'hire.html'));
});
app.get('/pass_reset', function (req, res) {
  console.log("GET passreset.html");
  res.sendFile(path.join(__dirname, 'pages', 'passreset.html'));
});
app.get('/password_resetter', function (req, res) {
  console.log("GET passwordresetter.html");
  res.sendFile(path.join(__dirname, 'pages', 'passwordresetter.html'));
});
app.get('/verify', function (req, res) {
  console.log("GET verify.html");
  res.sendFile(path.join(__dirname, 'pages', 'verify.html'));
});

//stylesheet
app.get('/stylesheet', function (req, res) {
  console.log("GET stylesheet.css");
  res.sendFile(path.join(__dirname, 'stylesheet.css'));
});
//app listening port
app.listen(8080, function () {
  console.log(`Recruiter app is listening on port 8080!`);
});

