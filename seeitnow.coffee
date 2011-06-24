class Selector
	constructor: (@actions = {create: (-> null), done: (-> null)}) ->
		@selected = null
		@ignores = ['html', 'body', '.bounder', '.picker']
		$('body').append '''
						 <div id="bounder-t" class="bounder"></div>
						 <div id="bounder-b" class="bounder"></div>
						 <div id="bounder-l" class="bounder"></div>
						 <div id="bounder-r" class="bounder"></div>
						 '''
		css =
			border: '2px dotted red'
			position: 'absolute'
			height: '0'
			width: '0'
			'z-index': '999999'
		$('.bounder').css(css)
		@hideBounds()
		$(document).bind 'keydown', 'ctrl+m', (e) =>
			$(document).mousemove(@select)
			$(document).click =>
				@stopListening()
				@actions.create(@selected)
		$(document).bind 'keydown', 'esc', (e) =>
			@stopListening()
			@hideBounds()
			@actions.done()
	stopListening: (e) =>
		$(document).unbind('mousemove')
		$(document).unbind('click')
	select: (e) =>
		@selected = $(e.target)
		if @selected? and _.all(@ignores,(s) => not @selected.is(s))
			@bound(@selected)
		else
			@hideBounds()
	bound: (element) ->
		position = element.offset()
		[h,w] = [element.outerHeight(), element.outerWidth()]
		[t,b,l,r] = [position.top-2, position.top+h-2,position.left-2,position.left+w-2]
		$('#bounder-t').css({top: t, left: l, width: w})
		$('#bounder-b').css({top: b, left: l, width: w})
		$('#bounder-l').css({top: t, left: l, height: h})
		$('#bounder-r').css({top: t, left: r, height: h})
		$('.bounder').show()
		element
	hideBounds: ->
		$('.bounder').hide()

ColorUtil =
	hsv: (hue,sat,val) ->
		# put saturation/value on a [0,1] scale
		[sat,vat] = [sat / 100, val / 100]
		# the HSV color scale is broken down into 6 segments for translating to RGB
		# see wikipedia article on HSV for outline of the algorithm
		segment = hue / 60
		c = sat * val # chroma
		[x,m] = [c * (1 - Math.abs((segment % 2) - 1)), val - c]
		[r,g,b] = [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(segment % 6)]
		# go from 100 scale to 255 scale
		Math.floor (x+m)/100*256 for x in [r,g,b]
	rgbs: (args...) ->
		if args.length == 3 then [r,g,b] = args else [r,g,b] = args[0]
		"rgb(#{r},#{g},#{b})"
	hsvs: (hue,sat,val) ->
		this.rgbs(this.hsv(hue,sat,val))

class Picker
	constructor: (@target) ->
		$('body').append """
						 <div id="colorpicker" class="picker">
						     <canvas id="picker-sv"  class="picker" width="150" height="150" />
						     <canvas id="picker-hue" class="picker" width="20" height="150" />
						 </div>
		                 """
		outerCSS =
			width: '180px'
			height: '150px'
			padding: '10px 10px 10px 5px'
			background: '#ddd'
			overflow: 'auto'
			position: 'fixed'
			right: '5px'
			bottom: '5px'
		innerCSS =
			'margin-left': '5px'
			background: 'white'
			display: 'block'
			float: 'left'
		$('#colorpicker').css(outerCSS)
		$('#colorpicker canvas').css(innerCSS)
		[sv,hue] = [$('#picker-sv'),$('#picker-hue')]
		@picker =
			satval:
				cvs: sv
				ctx: sv[0].getContext('2d')
				width: 150
				height: 150
			hue:
				cvs: hue
				ctx: hue[0].getContext('2d')
				width: 20
				height: 150
		@drawHuePicker()
		@drawSatValPicker(0)
		@picker.hue.cvs.mousedown(@pickHue)
		@picker.satval.cvs.mousedown(@pickColor)
	# for when we're done
	remove: -> $('#colorpicker').remove()
	# utility function for quickly drawing a gradient that fills a canvas
	drawGradient: (picker,x1,y1,x2,y2,stops) ->
		oldFill = picker.ctx.fillStyle
		g = picker.ctx.createLinearGradient(x1,y1,x2,y2)
		g.addColorStop(i/(stops.length-1),stops[i]) for i in [0...stops.length]
		picker.ctx.fillStyle = g
		picker.ctx.fillRect(0,0,picker.width,picker.height)
		picker.ctx.fillStyle = oldFill
	drawHuePicker: ->
		p = @picker.hue
		stops = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]]
		@drawGradient(p,0,p.height,0,0,ColorUtil.rgbs(s) for s in stops)
	drawSatValPicker: (hue) ->
		p = @picker.satval
		@drawGradient(p,0,0,0,p.height,[ColorUtil.hsvs(hue,100,100),'white'])
		@drawGradient(p,0,0,p.width,9,['black','transparent'])
		@picker.satval.id = id = p.ctx.getImageData(0,0,p.width,p.height)
		@picker.satval.pixels = id.data
	pickHue: (e) =>
		p = @picker.hue
		adjust = (e) =>
			yPos = e.pageY - p.cvs.offset().top
			hue = (p.height - yPos) * 360 / p.height
			@drawSatValPicker(hue) if 0 <= hue <= 360
		adjust(e)
		p.cvs.mousemove(adjust)
		p.cvs.mouseup -> p.cvs.unbind('mousemove')
	pickColor: (e) =>
		p = @picker.satval
		assign = (e) =>
			offset = p.cvs.offset()
			[xPos,yPos] = [e.pageX - offset.left, e.pageY - offset.top]
			start = (yPos*p.width + xPos)*4
			[r,g,b] = [p.pixels[start],p.pixels[start+1],p.pixels[start+2]]
			@target.css('background',ColorUtil.rgbs(r,g,b))
		assign(e)
		p.cvs.mousemove(assign)
		p.cvs.mouseup -> p.cvs.unbind('mousemove')

$(->
	actions =
		picker: null
		create: (elem) ->
			this.picker = new Picker(elem)
		done: -> this.picker.remove()
	s = new Selector(actions)
)

