var Panel, p;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Panel = (function() {
  function Panel() {
    this.changeValue = __bind(this.changeValue, this);
    this.saveChanges = __bind(this.saveChanges, this);    var css, propertySelect, saveButton, selector, _ref;
    this.body = $('body');
    this.body.append(this.panelHTML());
    this.height = 31;
    _ref = this.panelCSS();
    for (selector in _ref) {
      css = _ref[selector];
      $(selector).css(css);
    }
    this.panel = $('#-sin-panel-wrapper');
    this.selectorBox = $('#-sin-selector-input');
    this.selectorBox.keypress(__bind(function(evt) {
      var selected;
      if (evt.keyCode === 13) {
        evt.preventDefault();
        selector = this.selectorBox.val();
        selected = $(selector);
        if (selected.length > 0) {
          this.selector.bounds.hide();
          return this.select(selected, selector);
        }
      }
    }, this));
    this.valueBox = $('#-sin-value-input');
    this.valueBox.keypress(__bind(function(evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault();
        return this.changeValue(this.valueBox.val());
      }
    }, this));
    saveButton = $('#-sin-save-button');
    saveButton.click(this.saveChanges);
    this.widgetCount = 0;
    this.widget = null;
    this.selected = null;
    this.cssSelector = null;
    this.selector = new Selector(this);
    propertySelect = $('#-sin-property-selector');
    this.property = propertySelect.val();
    propertySelect.change(__bind(function(e) {
      this.property = propertySelect.val();
      return this.setWidget();
    }, this));
    $('#-sin-select-button').click(__bind(function() {
      if (!this.selector.started) {
        return this.selector.start();
      } else if (this.selector.started && (this.selected != null)) {
        return this.selector.start();
      } else if (this.selector.started && !(this.selected != null)) {
        return this.selector.stop();
      }
    }, this));
    this.changes = {};
    this.show();
    this.setWidget();
  }
  Panel.prototype.saveChanges = function() {
    var changes, property, selector, val, _ref;
    _ref = this.changes;
    for (selector in _ref) {
      changes = _ref[selector];
      for (property in changes) {
        val = changes[property];
        now.changeCSS('style.css', selector, property, val);
      }
    }
    return this.changes = {};
  };
  Panel.prototype.select = function(elem, selector) {
    if (selector == null) {
      selector = null;
    }
    this.selected = elem;
    this.cssSelector = selector || ("#" + (this.selected.attr('id')));
    this.selectorBox.val(this.cssSelector);
    this.valueBox.val(this.selected.css(this.property));
    return this.showWidget();
  };
  Panel.prototype.deselect = function() {
    this.selected = null;
    this.cssSelector = null;
    this.selectorBox.val('');
    this.valueBox.val('');
    return this.hideWidget();
  };
  Panel.prototype.setWidget = function() {
    var widgetMapping;
    widgetMapping = {
      'background': ColorPicker,
      'background-color': ColorPicker,
      'color': ColorPicker
    };
    this.widgetClass = widgetMapping[this.property];
    if (this.selected != null) {
      this.hideWidget();
      return this.showWidget();
    }
  };
  Panel.prototype.showWidget = function() {
    return this.widget = new this.widgetClass(this.changeValue);
  };
  Panel.prototype.hideWidget = function() {
    if (this.widget != null) {
      return this.widget.remove();
    }
  };
  Panel.prototype.changeValue = function(val) {
    this.valueBox.val(val);
    this.selected.css(this.property, val);
    if (!(this.cssSelector in this.changes)) {
      this.changes[this.cssSelector] = {};
    }
    return this.changes[this.cssSelector][this.property] = val;
  };
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
  Panel.prototype.panelHTML = function() {
    return "<div id=\"-sin-panel-wrapper\" class=\"-sin\">\n    <div id=\"-sin-panel\">\n        <a href='#' id=\"-sin-select-button\"></a>\n        <form>\n            <input type=\"checkbox\" id=\"-sin-enable-borders\" checked />\n            <div id=\"-sin-enable-borders-display\"></div>\n            <input type=\"text\" id=\"-sin-selector-input\" />\n            <select id=\"-sin-property-selector\">\n                <option>background</option>\n                <option>color</option>\n                <option>background-color</option>\n            </select>\n            <input type=\"text\" id=\"-sin-value-input\" />\n        </form>\n        <a href='#' id=\"-sin-save-button\">save</a>\n    </div>\n</div>";
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
      },
      '#-sin-save-button': {
        display: 'block',
        position: 'absolute',
        right: '10px',
        top: '6px'
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