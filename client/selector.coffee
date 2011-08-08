class OutlineBounds
    constructor: ->
        positions = ['top','bottom','left','right']
        elems = for pos in positions
            "<div id=\"-sin-bound-#{pos}\" class=\"-sin-bound -sin\"></div>"
        html = elems.join("\n")
        css =
            border: '2px dotted red'
            position: 'absolute',
            height: '0'
            width: '0'
            'z-index': '999998'
        $('body').append(html)
        this[pos] = $("#-sin-bound-#{pos}") for pos in positions
        this.all = $(".-sin-bound")
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

