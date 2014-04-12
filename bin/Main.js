// Generated by CoffeeScript 1.7.1
(function() {
  var FileFinder, List, added, bundle, chokidar, e, f, file, fileFinder, fs, list, output, path, program, recursive, unadded, watchMaster, watcher, _i, _len,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  chokidar = require('chokidar');

  program = require("commander");

  List = require("./List").List;

  FileFinder = require("./FileFinder").FileFinder;

  fs = require("fs");

  path = require("path");

  program.version("0.0.1").option("-v, --verbose", "Show messages").option("-w, --watch", "Watch Files").option("-o, --output [value]", "The file to output all files in. eg application.js").parse(process.argv);

  file = [];

  if (program.args) {
    file = program.args;
  }

  if (program.output) {
    program.output = path.resolve(program.output);
  }

  list = new List();

  fileFinder = [];

  added = [];

  unadded = [];

  recursive = function(file) {
    var e, f, _i, _len, _ref, _results;
    if (program.verbose) {
      console.log("parsing " + file);
    }
    try {
      fileFinder.push(new FileFinder(file, program.watch));
    } catch (_error) {
      e = _error;
      console.log("file '" + file + "' doesn't exist");
    }
    _ref = fileFinder[fileFinder.length - 1].includeStack;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      if (f.required !== "") {
        _results.push(arguments.callee(f.required));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  bundle = function() {
    var stack, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = fileFinder.length; _i < _len; _i++) {
      bundle = fileFinder[_i];
      _results.push((function() {
        var _j, _len1, _ref, _ref1, _ref2, _results1;
        _ref = bundle.includeStack;
        _results1 = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          stack = _ref[_j];
          list.append(stack);
          if (program.watch) {
            if (_ref1 = stack.required, __indexOf.call(added, _ref1) < 0) {
              unadded.push(stack.required);
            }
            if (_ref2 = stack.caller, __indexOf.call(added, _ref2) < 0) {
              _results1.push(unadded.push(stack.caller));
            } else {
              _results1.push(void 0);
            }
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  output = function() {
    var data, i, item, _i, _ref;
    if (!list.graph) {
      console.log("Nothing to output?");
      process.exit(0);
    }
    if (program.verbose) {
      console.log("Outputing...");
    }
    if (program.output) {
      fs.writeFileSync(program.output, "");
    }
    for (i = _i = _ref = list.graph.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = list.graph[i];
      data = fs.readFileSync(item, {
        "encoding": "utf-8"
      });
      data = data.replace(/# ?include .+/g, "");
      data += "\n";
      if (program.output) {
        if (program.verbose) {
          console.log("writing file " + item);
        }
        fs.appendFileSync(program.output, data);
      } else {
        console.log(data);
      }
    }
    if (program.output) {
      return console.log("wrote to " + program.output + " complete");
    } else {
      return console.log("write completed");
    }
  };

  if (file.length === 0) {
    console.log("No Input");
  }

  watchMaster = null;

  watcher = function() {
    var _i, _len;
    if (program.watch) {
      if (program.verbose) {
        console.log("watch has been added");
      }
      for (_i = 0, _len = unadded.length; _i < _len; _i++) {
        file = unadded[_i];
        if (typeof watcthMaster === "undefined" || watcthMaster === null) {
          watchMaster = chokidar.watch(file, {
            persistent: true
          });
          watchMaster.on("change", (function(_this) {
            return function(newfile) {
              recursive(newfile);
              bundle();
              return output();
            };
          })(this));
        }
        watchMaster.add(file);
        added.push(file);
      }
      unadded = [];
      return watchMaster.close();
    }
  };

  try {
    for (_i = 0, _len = file.length; _i < _len; _i++) {
      f = file[_i];
      recursive(path.resolve(f));
    }
    bundle();
    output();
    watcher();
  } catch (_error) {
    e = _error;
  }

}).call(this);
