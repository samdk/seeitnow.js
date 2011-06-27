var express, http, io, server, socketIO, writer;
express = require('express');
writer = require('./writer');
http = require('http');
socketIO = require('socket.io');
server = express.createServer();
io = socketIO.listen(server);
server.listen(8002);
io.sockets.on('connection', function(socket) {
  console.log("a connection: " + socket);
  return socket.on('replaceValue', function(data) {
    console.log("replacing..." + data);
    return writer.replaceValue(data.property, data.value, data.lineNo, data.filename);
  });
});