var BackgroundColorPicker, ColorPicker, ColorUtil, GradientCanvas, OutlineBounds, Selector, prefix, socket;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
prefix = '_sin';
OutlineBounds = (function() {
  function OutlineBounds() {
    var css, elems, html, pos, positions, _i, _len;
    positions = ['top', 'bottom', 'left', 'right'];
    elems = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = positions.length; _i < _len; _i++) {
        pos = positions[_i];
        _results.push("<div id=\"" + prefix + "-bound-" + pos + "\" class=\"" + prefix + "-bound " + prefix + "\"></div>");
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
      this[pos] = $("#" + prefix + "-bound-" + pos);
    }
    this.all = $("." + prefix + "-bound");
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
ColorUtil = {
  hsv: function() {
    var args, b, c, g, hue, m, r, sat, segment, val, vat, x, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5, _results;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 3) {
      hue = args[0], sat = args[1], val = args[2];
    } else {
      _ref = args[0], hue = _ref[0], sat = _ref[1], val = _ref[2];
    }
    _ref2 = [sat / 100, val / 100], sat = _ref2[0], vat = _ref2[1];
    segment = hue / 60;
    c = sat * val;
    _ref3 = [c * (1 - Math.abs((segment % 2) - 1)), val - c], x = _ref3[0], m = _ref3[1];
    _ref4 = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(segment % 6)], r = _ref4[0], g = _ref4[1], b = _ref4[2];
    _ref5 = [r, g, b];
    _results = [];
    for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
      x = _ref5[_i];
      _results.push(Math.floor((x + m) / 100 * 256));
    }
    return _results;
  },
  rgbs: function() {
    var args, b, g, r, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 3) {
      r = args[0], g = args[1], b = args[2];
    } else {
      _ref = args[0], r = _ref[0], g = _ref[1], b = _ref[2];
    }
    return "rgb(" + r + "," + g + "," + b + ")";
  },
  hsvs: function(hue, sat, val) {
    return this.rgbs(this.hsv(hue, sat, val));
  },
  hexs: function() {
    var args, b, g, r, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 3) {
      r = args[0], g = args[1], b = args[2];
    } else {
      _ref = args[0], r = _ref[0], g = _ref[1], b = _ref[2];
    }
    return "#" + (r.toString(16)) + (g.toString(16)) + (b.toString(16));
  }
};
GradientCanvas = (function() {
  function GradientCanvas(selector, callback) {
    var _ref, _ref2;
    this.selector = selector;
    this.callback = callback;
    this.getPosition = __bind(this.getPosition, this);
    this.mousedown = __bind(this.mousedown, this);
    this.cvs = $(this.selector);
    this.ctx = this.cvs[0].getContext('2d');
    _ref = [this.cvs.width(), this.cvs.height()], this.width = _ref[0], this.height = _ref[1];
    this.cvs.mousedown(this.mousedown);
    _ref2 = [this.width - 1, 0], this.x = _ref2[0], this.y = _ref2[1];
  }
  GradientCanvas.prototype.drawGradient = function(x1, y1, x2, y2, stops) {
    var g, i, _ref;
    g = this.ctx.createLinearGradient(x1, y1, x2, y2);
    for (i = 0, _ref = stops.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      g.addColorStop(i / (stops.length - 1), stops[i]);
    }
    this.ctx.fillStyle = g;
    return this.ctx.fillRect(0, 0, this.width, this.height);
  };
  GradientCanvas.prototype.getPixel = function(x, y) {
    var b, g, i, r, _ref;
    i = (y * this.width + x) * 4;
    _ref = [this.imageData[i], this.imageData[i + 1], this.imageData[i + 2]], r = _ref[0], g = _ref[1], b = _ref[2];
    return [r, g, b];
  };
  GradientCanvas.prototype.drawHueGradient = function() {
    var s, stops;
    stops = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];
    return this.drawGradient(0, this.height, 0, 0, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = stops.length; _i < _len; _i++) {
        s = stops[_i];
        _results.push(ColorUtil.rgbs(s));
      }
      return _results;
    })());
  };
  GradientCanvas.prototype.drawSatValGradient = function(hue) {
    this.drawGradient(0, 0, 0, this.height, [ColorUtil.hsvs(hue, 100, 100), 'white']);
    this.drawGradient(0, 0, this.width, 9, ['black', 'transparent']);
    return this.imageData = this.ctx.getImageData(0, 0, this.width, this.height).data;
  };
  GradientCanvas.prototype.mousedown = function(e) {
    this.getPosition(e);
    this.cvs.mousemove(this.getPosition);
    return this.cvs.mouseup(__bind(function() {
      return this.cvs.unbind('mousemove');
    }, this));
  };
  GradientCanvas.prototype.getPosition = function(e) {
    var offset, start, _ref;
    offset = this.cvs.offset();
    _ref = [e.pageX - offset.left, e.pageY - offset.top], this.x = _ref[0], this.y = _ref[1];
    start = (this.x * this.width + this.x) * 4;
    return this.callback(this.x, this.y);
  };
  return GradientCanvas;
})();
ColorPicker = (function() {
  function ColorPicker(selected, width, height, hueWidth) {
    var css, html, key, keyMap, rules;
    this.selected = selected;
    this.width = width != null ? width : 150;
    this.height = height != null ? height : 150;
    this.hueWidth = hueWidth != null ? hueWidth : 20;
    this.pickColor = __bind(this.pickColor, this);
    this.pickHue = __bind(this.pickHue, this);
    html = "<div id=\"" + prefix + "-colorpicker\" class=\"" + prefix + "\">\n	<canvas id=\"" + prefix + "-sv\" width=\"" + this.width + "\" height=\"" + this.height + "\" />\n	<canvas id=\"" + prefix + "-hue\" width=\"" + this.hueWidth + "\" height=\"" + this.height + "\" />\n	<a href='#' id=\"save\">save</a>\n</div>";
    $('body').append(html);
    keyMap = {
      a: "#" + prefix + "-colorpicker",
      b: "#" + prefix + "-colorpicker canvas"
    };
    css = {
      a: {
        width: "" + (this.width + this.hueWidth + 10) + "px",
        height: "" + (this.height + 20) + "px",
        padding: '10px 5px 10px 10px',
        background: '#ddd',
        overflow: 'auto',
        position: 'fixed',
        right: '5px',
        bottom: '5px',
        'z-index': '999999'
      },
      b: {
        'margin-right': '5px',
        background: 'white',
        display: 'block',
        float: 'left'
      }
    };
    for (key in css) {
      rules = css[key];
      $(keyMap[key]).css(rules);
    }
    this.hue = new GradientCanvas("#" + prefix + "-hue", this.pickHue);
    this.sv = new GradientCanvas("#" + prefix + "-sv", this.pickColor);
    this.hue.drawHueGradient();
    this.sv.drawSatValGradient(0);
    this.rgb = null;
    $('#save').click(__bind(function(e) {
      e.preventDefault();
      if (this.rgb != null) {
        return changeLineOfValue(this.selected, 'background', ColorUtil.hexs(this.rgb));
      }
    }, this));
  }
  ColorPicker.prototype.remove = function() {
    return $("#" + prefix + "-colorpicker").remove();
  };
  ColorPicker.prototype.pickHue = function(x, y) {
    var hue;
    hue = (this.height - y) * 360 / this.height;
    if ((0 <= hue && hue <= 360)) {
      this.sv.drawSatValGradient(hue);
    }
    return this.pickColor(this.sv.x, this.sv.y);
  };
  ColorPicker.prototype.pickColor = function(x, y) {
    var b, g, r, _ref;
    _ref = this.sv.getPixel(x, y), r = _ref[0], g = _ref[1], b = _ref[2];
    this.rgb = [r, g, b];
    return this.colorChange(r, g, b);
  };
  ColorPicker.prototype.colorChange = function(r, g, b) {
    return console.log(ColorUtil.rgbs(r, g, b));
  };
  return ColorPicker;
})();
BackgroundColorPicker = (function() {
  __extends(BackgroundColorPicker, ColorPicker);
  function BackgroundColorPicker() {
    BackgroundColorPicker.__super__.constructor.apply(this, arguments);
  }
  BackgroundColorPicker.prototype.colorChange = function(r, g, b) {
    return this.selected.css('background', ColorUtil.rgbs(r, g, b));
  };
  return BackgroundColorPicker;
})();
socket = null;
$(function() {
  var s;
  socket = io.connect('http://localhost:8002');
  return s = new Selector(BackgroundColorPicker);
});