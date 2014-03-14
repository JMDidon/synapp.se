var DB, load,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

load = function(url, callback) {
  var css, item, _ref;
  if (callback == null) {
    callback = false;
  }
  if (url instanceof Array) {
    return load(url.shift(), (url.length ? (function() {
      return load(url, callback);
    }) : callback));
  } else if (typeof url === 'string') {
    css = url.match(/\.css(\?.*)?$/);
    url += '?t=' + (new Date).getTime();
    item = document.createElement(css ? 'link' : 'script');
    if (css) {
      _ref = ['text/css', 'stylesheet', url], item.type = _ref[0], item.rel = _ref[1], item.href = _ref[2];
    } else {
      item.src = url;
    }
    item.addEventListener('load', function(e) {
      if (callback) {
        return callback(null, e);
      }
    });
    return (css ? document.body : document.head).appendChild(item);
  }
};

DB = {
  folder: 'Synappse/',
  file: '_project.json',
  user: localStorage['user'] ? JSON.parse(localStorage['user']) : {},
  client: typeof Dropbox !== "undefined" && Dropbox !== null ? new Dropbox.Client({
    key: 'd1y1wxe9ow97xx0'
  }) : {},
  auth: function(interactive) {
    var $this;
    if (interactive == null) {
      interactive = false;
    }
    $this = this;
    if (localStorage['user'] && !interactive) {
      return $this.init();
    } else {
      return this.client.authenticate({
        interactive: interactive
      }, function(error, client) {
        if (client.isAuthenticated()) {
          return $this.init();
        }
      });
    }
  },
  updateUser: function() {
    var $this;
    $this = this;
    return this.client.getAccountInfo(function(error, info) {
      $this.user = {
        name: info.name,
        email: info.email,
        uid: info.uid
      };
      return localStorage['user'] = JSON.stringify($this.user);
    });
  },
  init: function() {
    var $this;
    $this = this;
    return load(['//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.js', '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min.js', '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-touch.min.js', 'public/lib/angular-translate.min.js', 'public/app.js'], function() {
      angular.bootstrap(document, ['synappseApp']);
      if ($this.client.isAuthenticated()) {
        return $this.updateUser();
      } else {
        return $this.client.authenticate({
          interactive: false
        }, function(error, client) {
          return $this.updateUser();
        });
      }
    });
  },
  readFolder: function(folder, callback) {
    var $this;
    $this = this;
    return this.client.readdir(folder, function(error, children, stat, childrenStat) {
      if (error) {
        return $this.client.mkdir(folder, function(error, stat) {
          if (error) {
            console.log(error);
          }
          return callback([]);
        });
      } else {
        return callback(childrenStat);
      }
    });
  },
  checkProject: function(folder, localIDs, callback) {
    var $this;
    $this = this;
    return this.client.readFile(folder + this.file, function(error, data, stat) {
      var name, project;
      if (error && error.status === 404) {
        name = (folder.substring($this.folder.length + 1)).replace(/\/$/, '');
        project = {
          name: name,
          id: generateID(3, localIDs, $this.user.uid + '_'),
          folder: folder,
          slug: slug(name),
          users: [$this.user],
          alerts: [],
          tasks: [],
          deletedTasks: [],
          comments: [],
          deletedComments: []
        };
        return $this.saveProject(project, function() {
          return callback(project);
        });
      } else {
        project = angular.fromJson(decodeURIComponent(escape(data)));
        project.folder = folder;
        return callback(project);
      }
    });
  },
  saveProject: function(project, callback) {
    if (callback == null) {
      callback = false;
    }
    return this.client.writeFile(project.folder + this.file, unescape(encodeURIComponent(angular.toJson(project))), function(error, stat) {
      if (error) {
        console.log(error);
      }
      if (callback) {
        return callback();
      }
    });
  },
  checkLocalProjects: function(local, folders, callback) {
    var index, localIDs, p, t, task, _i, _j, _len, _len1, _ref, _ref1;
    localIDs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = local.length; _i < _len; _i++) {
        p = local[_i];
        _results.push(p.id);
      }
      return _results;
    })();
    for (_i = 0, _len = local.length; _i < _len; _i++) {
      p = local[_i];
      if (_ref = p.folder, __indexOf.call(folders, _ref) < 0) {
        if (p.id.length === 2) {
          p.id = generateID(3, localIDs, this.user.uid + '_');
          p.users.push(this.user);
          _ref1 = p.tasks;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            task = _ref1[_j];
            task.id = generateID(3, (function() {
              var _k, _len2, _ref2, _results;
              _ref2 = p.tasks;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                t = _ref2[_k];
                _results.push(t.id);
              }
              return _results;
            })());
          }
          this.saveProject(p);
        } else {
          index = localIDs.indexOf(p.id);
          if (~index) {
            local.splice(index, 1);
          }
        }
      }
    }
    return callback();
  },
  sync: function(local, callback) {
    var $this;
    if (callback == null) {
      callback = false;
    }
    if (!this.client.isAuthenticated()) {
      return (callback ? callback() : void 0);
    }
    $this = this;
    return this.readFolder(this.folder, function(children) {
      var child, localIDs, p, project, projects, waiting, _i, _len, _results;
      projects = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          if (child.isFolder) {
            _results.push(child);
          }
        }
        return _results;
      })();
      waiting = projects.length;
      if (!waiting) {
        return $this.checkLocalProjects(local, [], callback);
      }
      localIDs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = local.length; _i < _len; _i++) {
          p = local[_i];
          _results.push(p.id);
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        _results.push($this.checkProject(project.path + '/', localIDs, function(data) {
          var c, localProject, _ref;
          waiting--;
          if (_ref = data.id, __indexOf.call(localIDs, _ref) < 0) {
            local.push(data);
          } else {
            localProject = ((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = local.length; _j < _len1; _j++) {
                p = local[_j];
                if (p.id === data.id) {
                  _results1.push(p);
                }
              }
              return _results1;
            })())[0];
            $this.updateProject(localProject, data);
          }
          if (!waiting) {
            return $this.checkLocalProjects(local, (function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = projects.length; _j < _len1; _j++) {
                c = projects[_j];
                _results1.push(c.path + '/');
              }
              return _results1;
            })(), function() {
              if (callback) {
                return callback();
              }
            });
          }
        }));
      }
      return _results;
    });
  },
  updateProject: function(local, distant) {
    var task, u, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    local.folder = distant.folder;
    local.users = (function() {
      var _i, _len, _ref, _results;
      _ref = distant.users;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        u = _ref[_i];
        _results.push(u);
      }
      return _results;
    })();
    if (_ref = this.user.uid, __indexOf.call((function() {
      var _i, _len, _ref1, _results;
      _ref1 = local.users;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        u = _ref1[_i];
        _results.push(u.uid);
      }
      return _results;
    })(), _ref) >= 0) {
      _ref1 = local.users;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        u = _ref1[_i];
        if (u.uid === this.user.uid) {
          u = this.user;
        }
      }
    } else {
      local.users.push(this.user);
    }
    local.tasks = this.solveConflicts(local.tasks, distant.tasks, local.deletedTasks);
    local.deletedTasks = [];
    _ref2 = local.tasks;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      task = _ref2[_j];
      delete task.oldID;
    }
    return this.saveProject(local);
  },
  solveConflicts: function(localItems, distantItems, deletedItems) {
    var distantIDs, distantItem, i, item, k, localIDs, localItem, v, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
    distantIDs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = distantItems.length; _i < _len; _i++) {
        item = distantItems[_i];
        _results.push(item.id);
      }
      return _results;
    })();
    localItems = angular.copy((function() {
      var _i, _len, _ref, _results;
      _results = [];
      for (i = _i = 0, _len = localItems.length; _i < _len; i = ++_i) {
        item = localItems[i];
        if (item.id.length === 2 || (_ref = item.id, __indexOf.call(distantIDs, _ref) >= 0)) {
          _results.push(item);
        }
      }
      return _results;
    })());
    for (_i = 0, _len = localItems.length; _i < _len; _i++) {
      item = localItems[_i];
      if (!(item.id.length === 2)) {
        continue;
      }
      item.oldID = item.id;
      item.author = DB.user.uid;
      item.id = generateID(3, distantIDs);
    }
    for (_j = 0, _len1 = localItems.length; _j < _len1; _j++) {
      localItem = localItems[_j];
      if (localItem.id.length === 3 && (_ref = localItem.id, __indexOf.call(distantIDs, _ref) >= 0)) {
        for (_k = 0, _len2 = distantItems.length; _k < _len2; _k++) {
          distantItem = distantItems[_k];
          if (localItem.id === distantItem.id) {
            if (localItem.edit <= distantItem.edit) {
              for (k in distantItem) {
                v = distantItem[k];
                localItem[k] = v;
              }
            }
          }
        }
      }
    }
    localIDs = (function() {
      var _l, _len3, _results;
      _results = [];
      for (_l = 0, _len3 = localItems.length; _l < _len3; _l++) {
        item = localItems[_l];
        _results.push(item.id);
      }
      return _results;
    })();
    for (_l = 0, _len3 = distantItems.length; _l < _len3; _l++) {
      item = distantItems[_l];
      if ((_ref1 = item.id, __indexOf.call(localIDs, _ref1) < 0) && (_ref2 = item.id, __indexOf.call(deletedItems, _ref2) < 0)) {
        localItems.push(item);
      }
    }
    return localItems;
  },
  getShareUrl: function(folder, callback) {
    if (callback == null) {
      callback = false;
    }
    return this.client.makeUrl(folder, function(error, stat) {
      if (callback) {
        return callback(stat.url);
      }
    });
  }
};

(function() {
  DB.auth();
  return (document.getElementById('auth')).addEventListener('click', function() {
    return DB.auth(true);
  });
})();
