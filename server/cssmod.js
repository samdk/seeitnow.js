var CSSFile, ResourceFile, fs, path;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
path = require('path');
fs = require('fs');
ResourceFile = (function() {
  function ResourceFile(filename, basePath) {
    try {
      this.path = this.findFile(filename, basePath);
    } catch (e) {
      throw "ERROR: " + e.description;
    }
    if (this.path) {
      this.loadFile();
      this.watchForChanges();
      this.onLoad = [];
    }
  }
  ResourceFile.prototype.findFile = function(filename, basePath) {
    var filePath, sep;
    if (path.basename(filename) !== filename) {
      throw new Exception('Illegal filename: basename $filename != $filename');
    } else {
      sep = basePath[basePath.length - 1] === '/' ? '' : '/';
      return filePath = "" + basePath + sep + filename;
    }
  };
  ResourceFile.prototype.watchForChanges = function() {
    return fs.watchFile(this.path, __bind(function() {
      return null;
    }, this));
  };
  ResourceFile.prototype.loadFile = function() {
    return fs.readFile(this.path, 'utf8', __bind(function(err, data) {
      var cb, _i, _len, _ref;
      if (err) {
        console.log(err);
      }
      this.lines = data.split('\n');
      if (this.onLoad.length > 0) {
        _ref = this.onLoad;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          cb(this.lines);
        }
      }
      return this.onLoad = [];
    }, this));
  };
  ResourceFile.prototype.getLines = function(cb) {
    if (this.lines) {
      return cb(this.lines);
    } else {
      return this.onLoad.push(cb);
    }
  };
  ResourceFile.prototype.writeFile = function(lines) {
    return fs.writeFile(this.path, lines.join('\n'), __bind(function() {
      return this.lines = lines;
    }, this));
  };
  return ResourceFile;
})();
CSSFile = (function() {
  __extends(CSSFile, ResourceFile);
  function CSSFile() {
    CSSFile.__super__.constructor.apply(this, arguments);
  }
  CSSFile.prototype.getLine = function(selector, property, cb) {
    var propRE, selectorRE;
    selectorRE = new RegExp("[\\s{;,]?" + selector + "\\s*[,{]");
    propRE = new RegExp("[\\s{;]" + property + "[\\s:]");
    return this.getLines(__bind(function(lines) {
      var endIdx, found, i, inSelector, line, _len;
      found = [];
      inSelector = false;
      for (i = 0, _len = lines.length; i < _len; i++) {
        line = lines[i];
        if (selectorRE.test(line)) {
          inSelector = true;
        }
        if (inSelector) {
          if (propRE.test(line)) {
            found.push(i + 1);
          }
          endIdx = line.indexOf('}');
          if (endIdx >= 0) {
            inSelector = false;
          }
        }
      }
      if (found.length > 0) {
        return cb(found);
      } else {
        return cb("NOT FOUND");
      }
    }, this));
  };
  CSSFile.prototype.change = function(selector, prop, newVal) {
    return this.getLine(selector, prop, __bind(function(lineNums) {
      var lineNum;
      lineNum = lineNums[lineNums.length - 1] - 1;
      return this.getLines(__bind(function(lines) {
        lines[lineNum] = this.changeLine(lines[lineNum], lineNum, prop, newVal);
        return this.writeFile(lines);
      }, this));
    }, this));
  };
  CSSFile.prototype.changeLine = function(line, lineNum, prop, newVal) {
    var end, err, fromProp, propEnd, propStart, start, valEnd, _ref;
    propStart = line.indexOf(prop);
    if (propStart < 0) {
      err = "Property " + prop + " not found on line " + lineNum + " of " + this.path;
      throw err;
    }
    _ref = [line.slice(0, propStart), line.slice(propStart)], start = _ref[0], fromProp = _ref[1];
    propEnd = 1 + fromProp.indexOf(':');
    valEnd = fromProp.indexOf(';');
    if (valEnd < 0) {
      valEnd = fromProp.indexOf('}');
    }
    if (valEnd < 0) {
      valEnd = fromProp.length - 1;
    }
    prop = fromProp.slice(0, propEnd);
    end = fromProp.slice(valEnd);
    return "" + start + prop + " " + newVal + end;
  };
  return CSSFile;
})();
exports.ResourceFile = ResourceFile;
exports.CSSFile = CSSFile;