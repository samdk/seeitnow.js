var BASE_PATH, cssmod, everyone, http, nowjs, server;
http = require('http');
nowjs = require('now');
cssmod = require('./cssmod');
server = http.createServer();
everyone = nowjs.initialize(server);
server.listen(8395);
console.log('now.js server started on port 8395');
BASE_PATH = "" + __dirname + "/../examples/";
everyone.now.changeCSS = function(filename, selector, property, newVal) {
  var css;
  css = new cssmod.CSSFile(filename, BASE_PATH);
  return css.change(selector, property, newVal);
};