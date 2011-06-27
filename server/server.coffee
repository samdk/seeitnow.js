express = require('express')
writer = require('./writer')
http = require('http')
socketIO = require('socket.io')
server = express.createServer()
io = socketIO.listen(server)
server.listen(8002)

io.sockets.on 'connection', (socket) ->
	console.log("a connection: #{socket}")
	socket.on 'replaceValue', (data) ->
		console.log("replacing...#{data}")
		writer.replaceValue(data.property,data.value,data.lineNo,data.filename)

