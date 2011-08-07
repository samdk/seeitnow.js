class Panel
    constructor: ->
        @body = $('body')
        @body.append @panelHTML()
        @height = 31
        $(selector).css(css) for selector,css of @panelCSS()

        @panel = $('#-sin-panel-wrapper')
        @valueBox = $('#-sin-value-input')
        @toolbar = $('#-sin-widget-toolbar')
        @widgetBox = $('#-sin-widget-box')

        @widgetCount = 0
        @widget = null
        @selected = null

        propertySelect = $('#-sin-property-selector')
        @property = propertySelect.val()
        propertySelect.change (e) => @property = propertySelect.val()
        
        @show()
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
    addWidget: (widget) ->
        index = @widgetCount++
        id = "-sin-widget-button-#{index}"
        @toolbar.append @widgetButton(widget,id)
        button = $(id)
        $(selector).css(css) for selector,css of @widgetButtonCSS()
        button.click (e) =>
            e.preventDefault()
            if button.hasClass '-sin-selected'
                button.removeClass '-sin-selected'
                widget.unregisterAll()
                @widgetBox.hide()
                @widget = null
            else
                @toolbar.children('a').removeClass '-sin-selected'
                button.addClass '-sin-selected' 
                widget.register (val) =>
                    @selected.css(@property,val) if @selected
                widget.registerInput @valueBox
                widgetisplayIn @widgetBox
                @widgetBox.show()
                @widget = widget
    widgetButton: (widget,id) ->
        """
        <a href='#' id="#{id}">
            <img src="#{"../client/images/placeholder.png" or widget.iconURL}" />
        </a>
        """
    panelHTML: ->
        """
        <div id="-sin-panel-wrapper" class="-sin">
            <div id="-sin-panel">
                <a href='#' id="-sin-select-button"></a>
                <form>
                    <input type="checkbox" id="-sin-enable-borders" checked />
                    <div id="-sin-enable-borders-display"></div>
                    <input type="text" id="-sin-select-input" />
                    <select id="-sin-property-selector">
                        <option>color</option>
                        <option>background-color</option>
                    </select>
                    <input type="text" id="-sin-value-input" />
                </form>
                <div id="-sin-widget-toolbar">
                </div>
                <div id="-sin-widget-box">
                </div>
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

