fs = require('fs')

exports.readLines = (filename,cb) ->
	fs.readFile filename, 'utf8', (err,data) ->
		lines = data.split('\n')
		cb(lines)

exports.replaceValue = (property,value,lineNo,filename) ->
	lineNo = lineNo-1 # lines are 1-indexed, arrays are not
	exports.readLines filename, (lines) ->
		line = lines[lineNo]
		start = line.indexOf(property)
		if start >= 0
			[before,relevant] = [line.substring(0,start),line.substring(start)]
			start = relevant.indexOf(':')+1
			end = relevant.indexOf(';')
			[before,after] = [before+relevant.substring(0,start),relevant.substring(end)]
			lines[lineNo] = "#{before} #{value}#{after}"
			fs.writeFile(filename,lines.join('\n'))
		else console.log 'property is not on specified line'

