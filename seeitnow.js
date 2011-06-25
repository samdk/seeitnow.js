var ColorPicker, ColorUtil, OutlineBounds, Selector;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
OutlineBounds = (function() {
  function OutlineBounds(prefix) {
    var css, elems, html, pos, positions, _i, _len;
    if (prefix == null) {
      prefix = '';
    }
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
  function Selector(widgetClass, prefix) {
    this.widgetClass = widgetClass;
    if (prefix == null) {
      prefix = '_sin';
    }
    this.select = __bind(this.select, this);;
    this.stopListening = __bind(this.stopListening, this);;
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
    var selectable, selector, _i, _len, _ref;
    this.selected = $(e.target);
    selectable = true;
    if (this.selected != null) {
      _ref = this.ignores;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        if (this.selected.is(selector)) {
          selectable = false;
        }
      }
    }
    if ((this.selected != null) && selectable) {
      return this.bounds.bound(this.selected);
    } else {
      this.selected = null;
      return this.bounds.hide();
    }
  };
  return Selector;
})();
ColorUtil = {
  hsv: function(hue, sat, val) {
    var b, c, g, m, r, segment, vat, x, _i, _len, _ref, _ref2, _ref3, _ref4, _results;
    _ref = [sat / 100, val / 100], sat = _ref[0], vat = _ref[1];
    segment = hue / 60;
    c = sat * val;
    _ref2 = [c * (1 - Math.abs((segment % 2) - 1)), val - c], x = _ref2[0], m = _ref2[1];
    _ref3 = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(segment % 6)], r = _ref3[0], g = _ref3[1], b = _ref3[2];
    _ref4 = [r, g, b];
    _results = [];
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      x = _ref4[_i];
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
  }
};
ColorPicker = (function() {
  function ColorPicker(target) {
    var hue, innerCSS, outerCSS, sv, _ref;
    this.target = target;
    this.pickColor = __bind(this.pickColor, this);;
    this.pickHue = __bind(this.pickHue, this);;
    $('body').append("<div id=\"colorpicker\" class=\"_sin\">\n    <canvas id=\"picker-sv\"  width=\"150\" height=\"150\" />\n    <canvas id=\"picker-hue\" width=\"20\" height=\"150\" />\n</div>");
    outerCSS = {
      width: '180px',
      height: '150px',
      padding: '10px 10px 10px 5px',
      background: '#ddd',
      overflow: 'auto',
      position: 'fixed',
      right: '5px',
      bottom: '5px',
      'z-index': '999999'
    };
    innerCSS = {
      'margin-left': '5px',
      background: 'white',
      display: 'block',
      float: 'left'
    };
    $('#colorpicker').css(outerCSS);
    $('#colorpicker canvas').css(innerCSS);
    _ref = [$('#picker-sv'), $('#picker-hue')], sv = _ref[0], hue = _ref[1];
    this.picker = {
      satval: {
        cvs: sv,
        ctx: sv[0].getContext('2d'),
        width: 150,
        height: 150
      },
      hue: {
        cvs: hue,
        ctx: hue[0].getContext('2d'),
        width: 20,
        height: 150
      }
    };
    this.drawHuePicker();
    this.drawSatValPicker(0);
    this.picker.hue.cvs.mousedown(this.pickHue);
    this.picker.satval.cvs.mousedown(this.pickColor);
  }
  ColorPicker.prototype.remove = function() {
    return $('#colorpicker').remove();
  };
  ColorPicker.prototype.drawGradient = function(picker, x1, y1, x2, y2, stops) {
    var g, i, oldFill, _ref;
    oldFill = picker.ctx.fillStyle;
    g = picker.ctx.createLinearGradient(x1, y1, x2, y2);
    for (i = 0, _ref = stops.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      g.addColorStop(i / (stops.length - 1), stops[i]);
    }
    picker.ctx.fillStyle = g;
    picker.ctx.fillRect(0, 0, picker.width, picker.height);
    return picker.ctx.fillStyle = oldFill;
  };
  ColorPicker.prototype.drawHuePicker = function() {
    var p, s, stops;
    p = this.picker.hue;
    stops = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];
    return this.drawGradient(p, 0, p.height, 0, 0, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = stops.length; _i < _len; _i++) {
        s = stops[_i];
        _results.push(ColorUtil.rgbs(s));
      }
      return _results;
    })());
  };
  ColorPicker.prototype.drawSatValPicker = function(hue) {
    var id, p;
    p = this.picker.satval;
    this.drawGradient(p, 0, 0, 0, p.height, [ColorUtil.hsvs(hue, 100, 100), 'white']);
    this.drawGradient(p, 0, 0, p.width, 9, ['black', 'transparent']);
    this.picker.satval.id = id = p.ctx.getImageData(0, 0, p.width, p.height);
    return this.picker.satval.pixels = id.data;
  };
  ColorPicker.prototype.pickHue = function(e) {
    var adjust, p;
    p = this.picker.hue;
    adjust = __bind(function(e) {
      var hue, yPos;
      yPos = e.pageY - p.cvs.offset().top;
      hue = (p.height - yPos) * 360 / p.height;
      if ((0 <= hue && hue <= 360)) {
        return this.drawSatValPicker(hue);
      }
    }, this);
    adjust(e);
    p.cvs.mousemove(adjust);
    return p.cvs.mouseup(function() {
      return p.cvs.unbind('mousemove');
    });
  };
  ColorPicker.prototype.pickColor = function(e) {
    var assign, p;
    p = this.picker.satval;
    assign = __bind(function(e) {
      var b, g, offset, r, start, xPos, yPos, _ref, _ref2;
      offset = p.cvs.offset();
      _ref = [e.pageX - offset.left, e.pageY - offset.top], xPos = _ref[0], yPos = _ref[1];
      start = (yPos * p.width + xPos) * 4;
      _ref2 = [p.pixels[start], p.pixels[start + 1], p.pixels[start + 2]], r = _ref2[0], g = _ref2[1], b = _ref2[2];
      return this.target.css('background', ColorUtil.rgbs(r, g, b));
    }, this);
    assign(e);
    p.cvs.mousemove(assign);
    return p.cvs.mouseup(function() {
      return p.cvs.unbind('mousemove');
    });
  };
  return ColorPicker;
})();
$(function() {
  var s;
  return s = new Selector(ColorPicker);
});