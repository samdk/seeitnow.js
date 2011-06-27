var changeLineOfValue, getMatchingSelectors, getSelectorLines, getSelectors;
getSelectors = function() {
  var rule, selectors, stylesheet, _i, _j, _len, _len2, _ref, _ref2;
  selectors = [];
  _ref = document.styleSheets;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    stylesheet = _ref[_i];
    _ref2 = stylesheet.cssRules;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      rule = _ref2[_j];
      selectors.push(rule.selectorText);
    }
  }
  return selectors;
};
getMatchingSelectors = function(element) {
  var selector, selectors, _i, _len, _results;
  selectors = getSelectors();
  _results = [];
  for (_i = 0, _len = selectors.length; _i < _len; _i++) {
    selector = selectors[_i];
    if (element.is(selector) && $(selector).length === element.length && $(selector)[0] === element[0]) {
      _results.push(selector);
    }
  }
  return _results;
};
getSelectorLines = function(selectors, cssURL, callback) {
  var countLines, mapping, parse, s, _i, _len;
  if (callback == null) {
    callback = function(x) {
      return console.log(x);
    };
  }
  mapping = {};
  for (_i = 0, _len = selectors.length; _i < _len; _i++) {
    s = selectors[_i];
    mapping[s] = [];
  }
  countLines = function(string) {
    var character, count, _j, _len2;
    count = 0;
    for (_j = 0, _len2 = string.length; _j < _len2; _j++) {
      character = string[_j];
      if (character === "\n") {
        count += 1;
      }
    }
    return count;
  };
  parse = function(data) {
    var before, beforeCount, block, char, count, i, isProp, partition, partitions, property, props, selector, start, stop, _j, _k, _len2, _len3, _len4, _ref, _ref2, _ref3;
    for (_j = 0, _len2 = selectors.length; _j < _len2; _j++) {
      selector = selectors[_j];
      partitions = data.split(selector);
      count = 0;
      _ref = partitions.slice(1);
      for (i = 0, _len3 = _ref.length; i < _len3; i++) {
        partition = _ref[i];
        count += countLines(partitions[i]);
        _ref2 = [partition.indexOf('{'), partition.indexOf('}')], start = _ref2[0], stop = _ref2[1];
        _ref3 = [partition.slice(0, (start + 1) || 9e9), partition.slice(start + 1, stop)], before = _ref3[0], block = _ref3[1];
        beforeCount = countLines(before);
        props = {};
        property = '';
        isProp = true;
        for (_k = 0, _len4 = block.length; _k < _len4; _k++) {
          char = block[_k];
          if (char === '\n') {
            beforeCount += 1;
          } else if (char === ":" && isProp) {
            props[property.trim()] = count + 1 + beforeCount;
            isProp = false;
          } else if (char === ';') {
            property = '';
            isProp = true;
          } else if (isProp) {
            property += char;
          }
        }
        mapping[selector].push([count + 1, props]);
      }
    }
    return callback(mapping);
  };
  return $.get(cssURL, parse);
};
changeLineOfValue = function(element, property, value) {
  var selectors;
  console.log('changing...');
  selectors = getMatchingSelectors(element);
  return getSelectorLines(selectors, 'style.css', function(mapping) {
    var line, lineNo, list, prop, selector, sublist, x, _results;
    _results = [];
    for (selector in mapping) {
      list = mapping[selector];
      _results.push((function() {
        var _i, _len, _results2;
        _results2 = [];
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          x = list[_i];
          line = x[0], sublist = x[1];
          _results2.push((function() {
            var _results3;
            _results3 = [];
            for (prop in sublist) {
              lineNo = sublist[prop];
              _results3.push(property === prop ? socket.emit('replaceValue', {
                filename: 'style.css',
                lineNo: lineNo,
                property: property,
                value: value
              }) : void 0);
            }
            return _results3;
          })());
        }
        return _results2;
      })());
    }
    return _results;
  });
};