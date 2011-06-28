var fs;
fs = require('fs');
exports.readLines = function(filename, cb) {
  return fs.readFile(filename, 'utf8', function(err, data) {
    var lines;
    lines = data.split('\n');
    return cb(lines);
  });
};
exports.replaceValue = function(property, value, lineNo, filename) {
  lineNo = lineNo - 1;
  return exports.readLines(filename, function(lines) {
    var after, before, end, line, relevant, start, _ref, _ref2;
    line = lines[lineNo];
    start = line.indexOf(property);
    if (start >= 0) {
      _ref = [line.substring(0, start), line.substring(start)], before = _ref[0], relevant = _ref[1];
      start = relevant.indexOf(':') + 1;
      end = relevant.indexOf(';');
      _ref2 = [before + relevant.substring(0, start), relevant.substring(end)], before = _ref2[0], after = _ref2[1];
      lines[lineNo] = "" + before + " " + value + after;
      return fs.writeFile(filename, lines.join('\n'));
    } else {
      return console.log('property is not on specified line');
    }
  });
};