getSelectors = ->
	selectors = []
	for stylesheet in document.styleSheets
		for rule in stylesheet.cssRules
			selectors.push(rule.selectorText)
	return selectors

getMatchingSelectors = (element) ->
	selectors = getSelectors()
	selector for selector in selectors when element.is(selector) and $(selector).length == element.length and $(selector)[0] == element[0]

getSelectorLines = (selectors,cssURL,callback=(x) -> console.log(x)) ->
	mapping = {}
	mapping[s] = [] for s in selectors
	countLines = (string) ->
		count = 0
		for character in string
			if character is "\n" then count += 1
		count
	parse = (data) ->
		# assuming selectors only use spaces for separation...
		for selector in selectors
			partitions = data.split(selector)
			count = 0
			for partition,i in partitions[1..]
				# i is actually the index for the previous one...
				count += countLines(partitions[i])
				[start,stop] = [partition.indexOf('{'),partition.indexOf('}')]
				[before,block] = [partition[..start],partition[start+1...stop]]
				beforeCount = countLines(before)
				props = {}
				property = ''
				isProp = true
				for char in block
					if char is '\n'
						beforeCount += 1
					else if char is ":" and isProp
						props[property.trim()] = count+1+beforeCount
						isProp = false
					else if char is ';'
						property = ''
						isProp = true
					else if isProp
						property += char
				mapping[selector].push([count+1,props])
		callback(mapping)
	$.get(cssURL, parse)

changeLineOfValue = (element,property,value) ->
	console.log('changing...')
	selectors = getMatchingSelectors(element)
	getSelectorLines selectors, 'style.css', (mapping) ->
		for selector,list of mapping
			for x in list
				[line,sublist] = x
				# for now, just go with the first one that works...
				for prop,lineNo of sublist
					if property is prop
						socket.emit('replaceValue',{filename:'style.css',lineNo:lineNo,property:property,value})

