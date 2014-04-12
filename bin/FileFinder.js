// Generated by CoffeeScript 1.7.1
(function() {
  var FileFinder, FileScanner, Include, fs, path;

  fs = require("fs");

  path = require("path");

  FileScanner = require("./FileScanner").FileScanner;

  Include = require("./Include").Include;

  FileFinder = (function() {
    function FileFinder(path, watch) {
      this.path = path;
      this.watch = watch;
      this.includeStack = [];
      this.exec();
    }

    FileFinder.prototype.exec = function() {
      var e, stats;
      try {
        stats = fs.statSync(this.getAbsolutePath());
        if (stats.isDirectory()) {
          return this.directory();
        } else if (stats.isFile()) {
          return this.file();
        } else {
          throw new Error("No Idea how to Handle file not found");
        }
      } catch (_error) {
        e = _error;
        e = new Error("Files doesn't exist");
        e.required = this.getAbsolutePath();
        throw e;
      }
    };

    FileFinder.prototype.file = function() {
      var f, _i, _len, _ref;
      if (this.includeStack == null) {
        this.includeStack = [];
      }
      this.fileScanner = new FileScanner(this.getAbsolutePath(), this.watch);
      _ref = this.fileScanner.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        this.includeStack.push(new Include(path.resolve(this.getDirectory(this.getAbsolutePath()), f), this.getAbsolutePath()));
      }
      if (this.fileScanner.files.length === 0) {
        return this.includeStack.push(new Include("", this.getAbsolutePath()));
      }
    };

    FileFinder.prototype.getDirectory = function(f) {
      return path.dirname(f);
    };

    FileFinder.prototype.getAbsolutePath = function() {
      return path.resolve(this.path);
    };

    FileFinder.prototype.getRelativePath = function() {
      var normal;
      normal = path.normalize(this.path);
      return path.resolve(normal);
    };

    FileFinder.prototype.isAbsolute = function() {
      var absolute, normal;
      normal = path.normalize(this.path);
      absolute = path.resolve(this.path);
      return normal === absolute;
    };

    return FileFinder;

  })();

  if ((typeof module !== "undefined" && module !== null) && module.exports) {
    module.exports.FileFinder = FileFinder;
  }

}).call(this);