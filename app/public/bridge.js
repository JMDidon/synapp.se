// Generated by CoffeeScript 1.6.3
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function() {
  var Data, Module, client, manageConflicts;
  manageConflicts = function(local, remote) {
    return local;
  };
  client = new Dropbox.Client({
    key: '1n83me2ms50l6az'
  });
  client.authenticate(function(error, client) {
    if (error) {
      return console.log(error);
    }
  });
  Module = (function() {
    function Module(name) {
      if (name == null) {
        name = 'error';
      }
      this.file = name + '.json';
      if (localStorage[name] == null) {
        localStorage[name] = JSON.stringify([]);
      }
      this._ = JSON.parse(localStorage.getItem(name));
      this.save = function() {
        return localStorage[name] = JSON.stringify(this._);
      };
    }

    Module.prototype.sync = function() {
      var $this, sync;
      $this = this;
      sync = function() {
        client.readFile($this.file, function(error, data) {
          $this._ = manageConflicts($this._, JSON.parse(data));
          console.log($this._);
          $this.save();
          return client.writeFile($this.file, JSON.stringify($this._));
        });
        return setTimeout(sync, 5 * 1000);
      };
      return sync();
    };

    Module.prototype.get = function() {
      return this._;
    };

    Module.prototype.add = function(data) {
      var id, item, k, n, output, v;
      id = ((function() {
        var _results;
        _results = [];
        while ((!n) || __indexOf.call((function() {
            var _i, _len, _ref, _results1;
            _ref = this._;
            _results1 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results1.push(item.id);
            }
            return _results1;
          }).call(this), n) >= 0) {
          _results.push(n = Math.random().toString(36).substr(2, 2));
        }
        return _results;
      }).call(this)).toString();
      output = {
        id: id,
        edited: (new Date).getTime()
      };
      for (k in data) {
        v = data[k];
        if (k !== 'id' && k !== 'edited') {
          output[k] = v;
        }
      }
      this._.push(output);
      this.save();
      return id;
    };

    Module.prototype.edit = function(id, data) {
      var i, item, k, v, _i, _len, _ref;
      _ref = this._;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        if (!(item.id === id)) {
          continue;
        }
        item.edited = (new Date).getTime();
        for (k in data) {
          v = data[k];
          if (k !== 'id' && k !== 'edited') {
            item[k] = v;
          }
        }
      }
      return this.save();
    };

    Module.prototype["delete"] = function(id) {
      var item;
      this._ = (function() {
        var _i, _len, _ref, _results;
        _ref = this._;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.id !== id) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
      return this.save();
    };

    return Module;

  })();
  return window.Data = Data = {
    tasks: new Module('tasks')
  };
})();

console.log(localStorage.tasks);

Data.tasks.sync();
