// Generated by CoffeeScript 1.7.1

/*
  This class is to compile the Stacked Parser Files
 */

(function() {
  var Stacker,
    __slice = [].slice;

  Stacker = (function() {

    /*
      @property includes [Array<Parser>,Parser] This is the parser files that need to be included
     */
    function Stacker() {
      var inc, includes, _i, _len;
      includes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (includes instanceof Array) {
        for (_i = 0, _len = includes.length; _i < _len; _i++) {
          inc = includes[_i];
          this.includes = includes;
        }
      }
    }

    Stacker.prototype.includes = [];

    Stacker.prototype.addIncludes = function(more) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = more.length; _i < _len; _i++) {
        file = more[_i];
        _results.push(this.includes.push(file));
      }
      return _results;
    };

    Stacker.prototype.stack = function() {
      var include, list, _i, _len, _ref, _results;
      list = new List();
      _ref = this.includes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        include = _ref[_i];
        _results.push(list.append(include));
      }
      return _results;
    };

    return Stacker;

  })();

  if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
    module.exports.Stacker = Stacker;
  }

}).call(this);
