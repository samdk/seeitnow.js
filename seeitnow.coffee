prefix = '_sin'

class OutlineBounds
	constructor: ->
		positions = ['top','bottom','left','right']
		elems = for pos in positions
			"<div id=\"#{prefix}-bound-#{pos}\" class=\"#{prefix}-bound #{prefix}\"></div>"
		html = elems.join("\n")
		css =
			border: '2px dotted red'
			position: 'absolute',
			height: '0'
			width: '0'
			'z-index': '999998'
		$('body').append(html)
		this[pos] = $("##{prefix}-bound-#{pos}") for pos in positions
		this.all = $(".#{prefix}-bound")
		this.all.css(css)
		@hide()
	remove: -> @all.remove()
	bound: (element) ->
		position = element.offset()
		[h,w] = [element.outerHeight(), element.outerWidth()]
		[t,b,l,r] = [position.top-2, position.top+h-2,position.left-2,position.left+w-2]
		@top   .css({top: t, left: l, width: w})
		@bottom.css({top: b, left: l, width: w})
		@left  .css({top: t, left: l, height: h})
		@right .css({top: t, left: r, height: h})
		@show()
	show: -> @all.show()
	hide: -> @all.hide()

class Selector
	constructor: (@widgetClass) ->
		@selected = null
		@ignores = ['html', 'body', ".#{prefix}", ".#{prefix} *"]
		@bounds = new OutlineBounds(prefix)
		$(document).bind 'keydown', 'ctrl+m', (e) =>
			@detachWidget()
			$(document).mousemove(@select)
			$(document).click =>
				if @selected?
					@stopListening()
					@attachWidget()
		$(document).bind 'keydown', 'esc', (e) =>
			@stopListening()
			@bounds.hide()
			@detachWidget()
	attachWidget: -> @widget = new @widgetClass(@selected)
	detachWidget: -> @widget.remove() if @widget
	stopListening: (e) =>
		$(document).unbind('mousemove')
		$(document).unbind('click')
	select: (e) =>
		@selected = $(e.target)
		if @selected? and (1 for s in @ignores when @selected.is(s)).length == 0
			@bounds.bound(@selected)
		else
			@selected = null
			@bounds.hide()

ColorUtil =
	hsv: (args...) ->
		if args.length == 3 then [hue,sat,val] = args else [hue,sat,val] = args[0]
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

class GradientCanvas
	constructor: (@selector,@callback) ->
		@cvs = $(@selector)
		@ctx = @cvs[0].getContext('2d')
		[@width,@height] = [@cvs.width(),@cvs.height()]
		@cvs.mousedown(@mousedown)
		[@x,@y] = [@width-1,@height-1]
	drawGradient: (x1,y1,x2,y2,stops) ->
		g = @ctx.createLinearGradient(x1,y1,x2,y2)
		g.addColorStop(i/(stops.length-1),stops[i]) for i in [0...stops.length]
		@ctx.fillStyle = g
		@ctx.fillRect(0,0,@width,@height)
	getPixel: (x,y) ->
		i = (y*@width + x)*4
		# alpha will always be 100%, so we can ignore it
		[r,g,b] = [@imageData[i],@imageData[i+1],@imageData[i+2]]
		return [r,g,b]
	drawHueGradient: ->
		stops = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]]
		@drawGradient(0,@height,0,0,ColorUtil.rgbs(s) for s in stops)
	drawSatValGradient: (hue) ->
		@drawGradient(0,0,0,@height,[ColorUtil.hsvs(hue,100,100),'white'])
		@drawGradient(0,0,@width,9,['black','transparent'])
		@imageData = @ctx.getImageData(0,0,@width,@height).data
	mousedown: (e) =>
		@getPosition(e)
		@cvs.mousemove(@getPosition)
		@cvs.mouseup => @cvs.unbind('mousemove')
	getPosition: (e) =>
		offset = @cvs.offset()
		[@x,@y] = [e.pageX - offset.left, e.pageY - offset.top]
		start = (@x*@width + @x)*4
		@callback(@x,@y)

class ColorPicker
	constructor: (@selected,@width=150,@height=150,@hueWidth=20) ->
		html =	"""
				<div id="#{prefix}-colorpicker" class="#{prefix}">
					<canvas id="#{prefix}-sv" width="#{@width}" height="#{@height}" />
					<canvas id="#{prefix}-hue" width="#{@hueWidth}" height="#{@height}" />
				</div>
				"""
		$('body').append(html)
		keyMap = {a: "#"+prefix+"-colorpicker", b: "##{prefix}-colorpicker canvas"}
		css =
			a:
				width: "#{@width+@hueWidth+10}px"
				height: "#{@height}px"
				padding: '10px 10px 10px 5px'
				background: '#ddd'
				overflow: 'auto'
				position: 'fixed'
				right: '5px'
				bottom: '5px'
				'z-index':'999999'
			b:
				'margin-left': '5px'
				backgroudn: 'white'
				display: 'block'
				float: 'left'				
		$(keyMap[key]).css(rules) for key,rules of css
		@hue = new GradientCanvas("##{prefix}-hue",@pickHue)
		@sv = new GradientCanvas("##{prefix}-sv",@pickColor)
		@hue.drawHueGradient()
		@sv.drawSatValGradient(0)
	remove: -> $("##{prefix}-colorpicker").remove()
	pickHue: (x,y) =>
		hue = (@height - y) * 360 / @height
		@sv.drawSatValGradient(hue) if 0 <= hue <= 360
		@pickColor(@sv.x,@sv.y)
	pickColor: (x,y) =>
		[r,g,b] = @sv.getPixel(x,y)
		@colorChange(r,g,b)
	colorChange: (r,g,b) -> console.log(ColorUtil.rgbs(r,g,b))

class BackgroundColorPicker extends ColorPicker
	colorChange: (r,g,b) ->
		@selected.css('background',ColorUtil.rgbs(r,g,b))

$(->
	s = new Selector(BackgroundColorPicker)
)

