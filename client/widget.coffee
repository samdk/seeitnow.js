class Widget
	constructor: ->
		@valueCallbacks = []
	# registers a callback to be called whenever the value changes
	register: (cb) -> @valueCallbacks.push cb 
	# convenience function to register a callback that pushes the
	# value into an input element
	registerInput: (input) -> @register (val) -> input.val val
	unregisterAll: -> @valueCallbacks = []
	# should be called by implementations whenever value updates
	update: (val) -> v(val) for v in @valueCallbacks
	displayIn: (elem) ->
		elem.html @html
		$(selector).css(css) for selector,css of @css
	html: ->
		'subclasses should override this
	     method to display their own HTML' 
	css: -> {}

