var OutlineBounds, Selector;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
OutlineBounds = (function() {
  function OutlineBounds() {
    var css, elems, html, pos, positions, _i, _len;
    positions = ['top', 'bottom', 'left', 'right'];
    elems = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = positions.length; _i < _len; _i++) {
        pos = positions[_i];
        _results.push("<div id=\"-sin-bound-" + pos + "\" class=\"-sin-bound -sin\"></div>");
      }
      return _results;
    })();
    html = elems.join("\n");
    css = {
      border: '2px dotted red',
      position: 'absolute',
      height: '0',
      width: '0',
      'z-index': '999998'
    };
    $('body').append(html);
    for (_i = 0, _len = positions.length; _i < _len; _i++) {
      pos = positions[_i];
      this[pos] = $("#-sin-bound-" + pos);
    }
    this.all = $(".-sin-bound");
    this.all.css(css);
    this.hide();
  }
  OutlineBounds.prototype.remove = function() {
    return this.all.remove();
  };
  OutlineBounds.prototype.bound = function(element) {
    var b, h, l, position, r, t, w, _ref, _ref2;
    position = element.offset();
    _ref = [element.outerHeight(), element.outerWidth()], h = _ref[0], w = _ref[1];
    _ref2 = [position.top - 2, position.top + h - 2, position.left - 2, position.left + w - 2], t = _ref2[0], b = _ref2[1], l = _ref2[2], r = _ref2[3];
    this.top.css({
      top: t,
      left: l,
      width: w
    });
    this.bottom.css({
      top: b,
      left: l,
      width: w
    });
    this.left.css({
      top: t,
      left: l,
      height: h
    });
    this.right.css({
      top: t,
      left: r,
      height: h
    });
    return this.show();
  };
  OutlineBounds.prototype.show = function() {
    return this.all.show();
  };
  OutlineBounds.prototype.hide = function() {
    return this.all.hide();
  };
  return OutlineBounds;
})();
Selector = (function() {
  function Selector(widgetClass) {
    this.widgetClass = widgetClass;
    this.select = __bind(this.select, this);
    this.stopListening = __bind(this.stopListening, this);
    this.selected = null;
    this.ignores = ['html', 'body', "." + prefix, "." + prefix + " *"];
    this.bounds = new OutlineBounds(prefix);
    $(document).bind('keydown', 'ctrl+m', __bind(function(e) {
      this.detachWidget();
      $(document).mousemove(this.select);
      return $(document).click(__bind(function() {
        if (this.selected != null) {
          this.stopListening();
          return this.attachWidget();
        }
      }, this));
    }, this));
    $(document).bind('keydown', 'esc', __bind(function(e) {
      this.stopListening();
      this.bounds.hide();
      return this.detachWidget();
    }, this));
  }
  Selector.prototype.attachWidget = function() {
    return this.widget = new this.widgetClass(this.selected);
  };
  Selector.prototype.detachWidget = function() {
    if (this.widget) {
      return this.widget.remove();
    }
  };
  Selector.prototype.stopListening = function(e) {
    $(document).unbind('mousemove');
    return $(document).unbind('click');
  };
  Selector.prototype.select = function(e) {
    var s;
    this.selected = $(e.target);
    if ((this.selected != null) && ((function() {
      var _i, _len, _ref, _results;
      _ref = this.ignores;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if (this.selected.is(s)) {
          _results.push(1);
        }
      }
      return _results;
    }).call(this)).length === 0) {
      return this.bounds.bound(this.selected);
    } else {
      this.selected = null;
      return this.bounds.hide();
    }
  };
  return Selector;
})();