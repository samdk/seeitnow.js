path = require('path')
fs = require('fs')

class ResourceFile
    constructor: (filename,basePath) ->
        # first task: attempt to find the file on the path
        # assumption: basePath is 'safe', since it comes
        # directly from the server.
        # filename is (potentially) supplied by the client,
        # and so is not at all safe.
        try
            @path = @findFile filename,basePath
        catch e
            throw "ERROR: #{e.description}"
        if @path
            @loadFile()
            @watchForChanges()
            @onLoad = []
    findFile: (filename,basePath) ->
        if path.basename(filename) != filename
            throw new Exception('Illegal filename: basename $filename != $filename')
        else
            # for now, just look at basePath/filename
            # eventually we want to do a recursive search
            # at basePath to find filename
            sep = if basePath[basePath.length-1] is '/' then '' else '/'
            filePath = "#{basePath}#{sep}#{filename}"
    watchForChanges: ->
        # TODO: figure out why reloading is broken
        fs.watchFile @path, => null#@loadFile()
    loadFile: ->
        fs.readFile @path, 'utf8', (err,data) =>
            if err then console.log(err)
            @lines = data.split('\n')
            if @onLoad.length > 0
                cb(@lines) for cb in @onLoad
            @onLoad = []
    # asynchronous since the file may not be loaded yet
    getLines: (cb) -> if @lines then cb(@lines) else @onLoad.push(cb)
    writeFile: (lines) ->
        fs.writeFile @path,lines.join('\n'), => @lines = lines

class CSSFile extends ResourceFile
    # given a selector, find the line(s) it appears on
    # has many restrictions, including but not limited to:
    #   -selectors must be at the beginning of the line
    #   -selectors must not span multiple lines
    #   -opening braces must be on the same lines as selectors
    #   -multiple selectors per block ARE supported, but every
    #    selector for a block must be on the same line
    getLine: (selector,property,cb) ->
        selectorRE = new RegExp "[\\s{;,]?#{selector}\\s*[,{]"
        propRE = new RegExp "[\\s{;]#{property}[\\s:]"
        @getLines (lines) =>
            found = []
            inSelector = false
            for line,i in lines
                if selectorRE.test(line)
                    inSelector = true
                if inSelector
                    if propRE.test(line)
                        found.push(i+1) # then we've found a match
                    endIdx = line.indexOf '}'
                    if endIdx >= 0 then inSelector = false
            # not found...
            if found.length > 0
                cb(found)
            else
                cb("NOT FOUND")
    change: (selector,prop,newVal) ->
        @getLine selector,prop,(lineNums) =>
            # lines are 1-indexed, arrays are not
            lineNum = lineNums[lineNums.length - 1] - 1
            @getLines (lines) =>
                lines[lineNum] = @changeLine lines[lineNum],lineNum,prop,newVal
                @writeFile lines
    # changes the value of the first instance of 'prop'
    # on 'line' to 'newVal'
    changeLine: (line,lineNum,prop,newVal) ->
        propStart = line.indexOf prop
        if propStart < 0
            err = "Property #{prop} not found on line #{lineNum} of #{@path}"
            throw err
        [start,fromProp] = [line[...propStart],line[propStart...]]
        propEnd = 1 + fromProp.indexOf ':'
        valEnd = fromProp.indexOf ';'
        if valEnd < 0 then valEnd = fromProp.indexOf '}'
        if valEnd < 0 then valEnd = fromProp.length - 1
        prop = fromProp[...propEnd]
        end  = fromProp[valEnd...]
        "#{start}#{prop} #{newVal}#{end}"

exports.ResourceFile = ResourceFile
exports.CSSFile = CSSFile
