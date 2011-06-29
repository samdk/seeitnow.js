var Widget;
Widget = (function() {
  function Widget() {
    this.valueCallbacks = [];
  }
  Widget.prototype.register = function(cb) {
    return this.valueCallbacks.push(cb);
  };
  Widget.prototype.registerInput = function(input) {
    return this.register(function(val) {
      return input.val(val);
    });
  };
  Widget.prototype.unregisterAll = function() {
    return this.valueCallbacks = [];
  };
  Widget.prototype.update = function(val) {
    var v, _i, _len, _ref, _results;
    _ref = this.valueCallbacks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      _results.push(v(val));
    }
    return _results;
  };
  Widget.prototype.displayIn = function(elem) {
    var css, selector, _ref, _results;
    elem.html(this.html);
    _ref = this.css;
    _results = [];
    for (selector in _ref) {
      css = _ref[selector];
      _results.push($(selector).css(css));
    }
    return _results;
  };
  Widget.prototype.html = function() {
    return 'subclasses should override this\
	     method to display their own HTML';
  };
  Widget.prototype.css = function() {
    return {};
  };
  return Widget;
})();