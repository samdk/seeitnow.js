class Panel
    constructor: ->
        @body = $('body')
        @body.append @panelHTML()
        @height = 31
        $(selector).css(css) for selector,css of @panelCSS()

        @panel = $('#-sin-panel-wrapper')
        @selectorBox = $('#-sin-selector-input')
        @selectorBox.keypress (evt) =>
            # when the enter key is pressed...
            if evt.keyCode is 13
                evt.preventDefault()
                selector = @selectorBox.val()
                selected = $(selector)
                if selected.length > 0
                    @selector.bounds.hide()
                    @select selected,selector
        @valueBox = $('#-sin-value-input')
        @valueBox.keypress (evt) =>
            if evt.keyCode is 13 # enter
                evt.preventDefault()
                @changeValue @valueBox.val()
        saveButton = $('#-sin-save-button')
        saveButton.click @saveChanges

        @widgetCount = 0
        @widget = null
        @selected = null
        @cssSelector = null

        @selector = new Selector this

        propertySelect = $('#-sin-property-selector')
        @property = propertySelect.val()
        propertySelect.change (e) =>
            @property = propertySelect.val()
            @setWidget()

        $('#-sin-select-button').click =>
            if not @selector.started
                @selector.start()
            else if @selector.started and @selected?
                @selector.start()
            else if @selector.started and not @selected?
                @selector.stop()

        @changes = {}

        @show()
        @setWidget()
    saveChanges: =>
        for selector,changes of @changes
            for property,val of changes
                now.changeCSS('style.css',selector,property,val)
        @changes = {}
    select: (elem,selector=null) ->
        @selected = elem
        @cssSelector = selector or "##{@selected.attr('id')}"
        @selectorBox.val(@cssSelector)
        @valueBox.val(@selected.css(@property))
        @showWidget()
    deselect: ->
        @selected = null
        @cssSelector = null
        @selectorBox.val('')
        @valueBox.val('')
        @hideWidget()
    setWidget: ->
        widgetMapping =
            'background':ColorPicker
            'background-color':ColorPicker
            'color':ColorPicker
            #'font-family':FontPicker
        @widgetClass = widgetMapping[@property]
        if @selected?
            @hideWidget()
            @showWidget()
    showWidget: -> @widget = new @widgetClass @changeValue
    hideWidget: -> @widget.remove() if @widget?
    changeValue: (val) =>
        @valueBox.val(val)
        @selected.css(@property,val)
        if @cssSelector not of @changes
            @changes[@cssSelector] = {}
        @changes[@cssSelector][@property] = val
    # todo: make this work if the body already has a bottom border
    show: ->
        # we're setting a bottom border in addition to bottom margin because
        # the border 'resets' the margin measurement.
        bodyCSS =
            'border-bottom': '1px solid red'
            'margin-bottom': @height + 'px'
        # todo: fix this so it rechecks when resizing the window
        if @body.innerHeight() + @height >= $(document).height()
            @body.css bodyCSS
        @panel.show()
    hide: ->
        @panel.hide()
        @body.css {'border-bottom-width': 0, 'margin-bottom': 0}
    panelHTML: ->
        """
        <div id="-sin-panel-wrapper" class="-sin">
            <div id="-sin-panel">
                <a href='#' id="-sin-select-button"></a>
                <form>
                    <input type="checkbox" id="-sin-enable-borders" checked />
                    <div id="-sin-enable-borders-display"></div>
                    <input type="text" id="-sin-selector-input" />
                    <select id="-sin-property-selector">
                        <option>background</option>
                        <option>color</option>
                        <option>background-color</option>
                    </select>
                    <input type="text" id="-sin-value-input" />
                </form>
                <a href='#' id="-sin-save-button">save</a>
            </div>
        </div>
        """
    panelCSS: ->
        css =
            '#-sin-panel-wrapper':
                height: @height + 'px'
                'border-top': '1px solid #ccc'
                background: '#eee'
                position: 'fixed'
                left: 0
                right: 0
                bottom: 0
            '#-sin-panel > *':
                position: 'absolute'
                display: 'block'
                top: 0
                bottom: 0
                margin: 0
                padding: 0
                height: '31px'
            '#-sin-select-button':
                width: '31px'
                height: '31px'
                background: '#ccc'
                left: 0
            '#-sin-panel form':
                left: '31px'
            '#-sin-enable-borders':
                margin: '0 0 0 6px'
                position: 'relative'
                'z-index': 10
            '#-sin-enable-borders-display':
                display: 'inline-block'
                position: 'absolute'
                'z-index': 9
                width: '15px'
                height: '15px'
                border: '3px dotted #aaa'
                left: '2px'
                top: '3px'
            '#-sin-enable-borders:checked + #-sin-enable-borders-display':
                'border-color': 'red'
            '#-sin-panel select':
                padding: '3px'
                margin: '3px 0 3px 3px'
            '#-sin-panel input[type="text"]':
                margin: '3px 0 3px 3px'
                padding: '4px'
                border: '1px solid #ccc'
            '#-sin-widget-toolbar':
                right: 0
            '#-sin-save-button':
                display: 'block'
                position: 'absolute'
                right: '10px'
                top: '6px'
    widgetButtonCSS: ->
        css =
            '#-sin-widget-toolbar a':
                display: 'inline-block'
                width: '31px'
                height: '31px'
                'text-decoration': 'none'
            '#-sin-widget-toolbar img':
                display: 'block'
                width: '31px'
                height: '31px'
p = null
$ -> p = new Panel()

