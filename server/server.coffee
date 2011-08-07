http = require 'http'
nowjs = require 'now'
cssmod = require './cssmod'

server = http.createServer()
everyone = nowjs.initialize(server)
server.listen(8395)


console.log('now.js server started on port 8395')

BASE_PATH = "#{__dirname}/../examples/"

everyone.now.changeCSS = (filename,line,prop,newVal) ->
    css = new cssmod.CSSFile filename, BASE_PATH
    css.change(line,prop,newVal)
    #everyone.now.changed(filename,line,prop,newVal)
