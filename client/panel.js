var Panel, p;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Panel = (function() {
  function Panel() {
    var css, propertySelect, selector, _ref;
    this.body = $('body');
    this.body.append(this.panelHTML());
    this.height = 31;
    _ref = this.panelCSS();
    for (selector in _ref) {
      css = _ref[selector];
      $(selector).css(css);
    }
    this.panel = $('#-sin-panel-wrapper');
    this.valueBox = $('#-sin-value-input');
    this.toolbar = $('#-sin-widget-toolbar');
    this.widgetBox = $('#-sin-widget-box');
    this.widgetCount = 0;
    this.widget = null;
    this.selected = null;
    propertySelect = $('#-sin-property-selector');
    this.property = propertySelect.val();
    propertySelect.change(__bind(function(e) {
      return this.property = propertySelect.val();
    }, this));
    this.show();
  }
  Panel.prototype.show = function() {
    var bodyCSS;
    bodyCSS = {
      'border-bottom': '1px solid red',
      'margin-bottom': this.height + 'px'
    };
    if (this.body.innerHeight() + this.height >= $(document).height()) {
      this.body.css(bodyCSS);
    }
    return this.panel.show();
  };
  Panel.prototype.hide = function() {
    this.panel.hide();
    return this.body.css({
      'border-bottom-width': 0,
      'margin-bottom': 0
    });
  };
  Panel.prototype.addWidget = function(widget) {
    var button, css, id, index, selector, _ref;
    index = this.widgetCount++;
    id = "-sin-widget-button-" + index;
    this.toolbar.append(this.widgetButton(widget, id));
    button = $(id);
    _ref = this.widgetButtonCSS();
    for (selector in _ref) {
      css = _ref[selector];
      $(selector).css(css);
    }
    return button.click(__bind(function(e) {
      e.preventDefault();
      if (button.hasClass('-sin-selected')) {
        button.removeClass('-sin-selected');
        widget.unregisterAll();
        this.widgetBox.hide();
        return this.widget = null;
      } else {
        this.toolbar.children('a').removeClass('-sin-selected');
        button.addClass('-sin-selected');
        widget.register(__bind(function(val) {
          if (this.selected) {
            return this.selected.css(this.property, val);
          }
        }, this));
        widget.registerInput(this.valueBox);
        widgetisplayIn(this.widgetBox);
        this.widgetBox.show();
        return this.widget = widget;
      }
    }, this));
  };
  Panel.prototype.widgetButton = function(widget, id) {
    return "<a href='#' id=\"" + id + "\">\n	<img src=\"" + ("../client/images/placeholder.png" || widget.iconURL) + "\" />\n</a>";
  };
  Panel.prototype.panelHTML = function() {
    return "<div id=\"-sin-panel-wrapper\" class=\"-sin\">\n	<div id=\"-sin-panel\">\n		<a href='#' id=\"-sin-select-button\"></a>\n		<form>\n			<input type=\"checkbox\" id=\"-sin-enable-borders\" checked />\n			<div id=\"-sin-enable-borders-display\"></div>\n			<input type=\"text\" id=\"-sin-select-input\" />\n			<select id=\"-sin-property-selector\">\n				<option>color</option>\n				<option>background-color</option>\n			</select>\n			<input type=\"text\" id=\"-sin-value-input\" />\n		</form>\n		<div id=\"-sin-widget-toolbar\">\n		</div>\n		<div id=\"-sin-widget-box\">\n		</div>\n	</div>\n</div>";
  };
  Panel.prototype.panelCSS = function() {
    var css;
    return css = {
      '#-sin-panel-wrapper': {
        height: this.height + 'px',
        'border-top': '1px solid #ccc',
        background: '#eee',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0
      },
      '#-sin-panel > *': {
        position: 'absolute',
        display: 'block',
        top: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        height: '31px'
      },
      '#-sin-select-button': {
        width: '31px',
        height: '31px',
        background: '#ccc',
        left: 0
      },
      '#-sin-panel form': {
        left: '31px'
      },
      '#-sin-enable-borders': {
        margin: '0 0 0 6px',
        position: 'relative',
        'z-index': 10
      },
      '#-sin-enable-borders-display': {
        display: 'inline-block',
        position: 'absolute',
        'z-index': 9,
        width: '15px',
        height: '15px',
        border: '3px dotted #aaa',
        left: '2px',
        top: '3px'
      },
      '#-sin-enable-borders:checked + #-sin-enable-borders-display': {
        'border-color': 'red'
      },
      '#-sin-panel select': {
        padding: '3px',
        margin: '3px 0 3px 3px'
      },
      '#-sin-panel input[type="text"]': {
        margin: '3px 0 3px 3px',
        padding: '4px',
        border: '1px solid #ccc'
      },
      '#-sin-widget-toolbar': {
        right: 0
      }
    };
  };
  Panel.prototype.widgetButtonCSS = function() {
    var css;
    return css = {
      '#-sin-widget-toolbar a': {
        display: 'inline-block',
        width: '31px',
        height: '31px',
        'text-decoration': 'none'
      },
      '#-sin-widget-toolbar img': {
        display: 'block',
        width: '31px',
        height: '31px'
      }
    };
  };
  return Panel;
})();
p = null;
$(function() {
  return p = new Panel();
});