// Generated by CoffeeScript 1.6.3
var DB, generateID, slug, splitTags, synappseApp,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

__indexOf.call([1, 2, 3], 2) >= 0;

synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseControllers', 'synappseServices', 'synappseHelpers']);

synappseApp.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
    }).when('/home', {
      redirectTo: '/'
    }).when('/projects/:params', {
      templateUrl: 'views/tasks.html',
      controller: 'ProjectCtrl'
    }).when('/projects/:params/users', {
      templateUrl: 'views/users.html',
      controller: 'ProjectCtrl'
    }).otherwise({
      redirectTo: '/'
    });
    return void 0;
  }
]);

console.log('App loaded');

/* --------------------------------------------
     Begin dropbox.coffee
--------------------------------------------
*/


DB = {
  key: '8437zcdkz4nvggb',
  folder: 'Synappse/',
  file: '_project.json',
  user: {},
  projects: [],
  client: {},
  auth: function(callback) {
    var $this;
    $this = this;
    this.client = new Dropbox.Client({
      key: this.key
    });
    return this.client.authenticate(function(error, client) {
      if (error) {
        console.log(error);
      }
      return $this.client.getAccountInfo(function(error, info) {
        $this.user = {
          name: info.name,
          email: info.email,
          uid: info.uid
        };
        return callback();
      });
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
    console.log(folder);
    $this = this;
    return this.client.readFile(folder + this.file, function(error, data, stat) {
      var name, project;
      if (error && error.status === 404) {
        name = (folder.substring($this.folder.length + 1)).replace(/\/$/, '');
        project = {
          name: name,
          id: generateID(2, localIDs, $this.user.uid + '_'),
          folder: folder,
          slug: slug(name),
          users: [$this.user],
          tasks: [],
          deletedTasks: []
        };
        return $this.saveProject(project, function() {
          return callback(project);
        });
      } else {
        project = angular.fromJson(data);
        project.folder = folder;
        return callback(project);
      }
    });
  },
  saveProject: function(project, callback) {
    if (callback == null) {
      callback = false;
    }
    return this.client.writeFile(project.folder + this.file, angular.toJson(project), function(error, stat) {
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
          p.id = generateID(2, localIDs, this.user.uid + '_');
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
    if (!this.client) {
      return;
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
            $this.solveConflicts(localProject, data);
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
            })(), (function() {
              console.log("sync complete");
              return callback();
            }));
          }
        }));
      }
      return _results;
    });
  },
  solveConflicts: function(local, distant) {
    var distantIDs, localIDs, task, u, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
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
    distantIDs = (function() {
      var _j, _len1, _ref2, _results;
      _ref2 = distant.tasks;
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        task = _ref2[_j];
        _results.push(task.id);
      }
      return _results;
    })();
    localIDs = (function() {
      var _j, _len1, _ref2, _results;
      _ref2 = local.tasks;
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        task = _ref2[_j];
        _results.push(task.id);
      }
      return _results;
    })();
    local.tasks = (function() {
      var _j, _len1, _ref2, _ref3, _results;
      _ref2 = local.tasks;
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        task = _ref2[_j];
        if (task.id.length === 2 || (_ref3 = task.id, __indexOf.call(distantIDs, _ref3) >= 0)) {
          _results.push(task);
        }
      }
      return _results;
    })();
    _ref2 = local.tasks;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      task = _ref2[_j];
      if (task.id.length === 2) {
        task.id = generateID(3, distantIDs);
      }
    }
    _ref3 = distant.tasks;
    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
      task = _ref3[_k];
      if ((_ref4 = task.id, __indexOf.call(localIDs, _ref4) < 0) && (_ref5 = task.id, __indexOf.call(local.deletedTasks, _ref5) < 0)) {
        local.tasks.push(task);
      }
    }
    local.deletedTasks = [];
    return this.saveProject(local);
  }
};

console.log('Dropbox module loaded');

/* --------------------------------------------
     Begin controllers.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseControllers', []);

synappseApp.controller('MainCtrl', function($scope, Projects) {
  $scope.projects = Projects.getProjects();
  $scope.auth = false;
  $scope.login = function() {
    $scope.auth = true;
    return $scope.$apply();
  };
  DB.auth($scope.login);
  $scope.sync = function() {
    return DB.sync($scope.projects, function() {
      Projects.cache();
      return $scope.$apply();
    });
  };
  return $scope.createProject = function() {
    Projects.createProject($scope.projectName);
    $scope.projectName = "";
    return $scope.projectFolder = "";
  };
});

synappseApp.controller('ProjectCtrl', function($scope, $routeParams, Projects) {
  $scope.project = Projects.readProject($routeParams.params);
  $scope.edit_mode = false;
  $scope.toggleEditMode = function() {
    return $scope.edit_mode = !$scope.edit_mode;
  };
  return $scope.createTask = function() {
    Projects.createTask($scope.project.id, {
      name: $scope.task.name,
      status: $scope.task.status,
      priority: $scope.task.priority,
      start: $scope.task.start,
      end: $scope.task.end,
      tags: splitTags($scope.task.tags)
    });
    return $scope.task = "";
  };
});

synappseApp.controller('TaskCtrl', function($scope, $routeParams, Projects) {
  $scope.taskEdit = angular.copy($scope.task);
  $scope.taskEdit.tags = $scope.taskEdit.tags.join(', ');
  $scope.editTask = function() {
    $scope.toggleEditMode();
    $scope.taskEdit.tags = splitTags($scope.taskEdit.tags);
    return Projects.editTask($scope.project.id, $scope.task.id, $scope.taskEdit);
  };
  return $scope.deleteTask = function() {
    return Projects.deleteTask($scope.project.id, $scope.task.id, $scope.task);
  };
});

console.log('Controllers loaded');

/* --------------------------------------------
     Begin services.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseServices', ['ngResource']);

synappseApp.factory('Projects', function() {
  var Projects, factory;
  Projects = localStorage['projects'] ? angular.fromJson(localStorage['projects']) : [];
  factory = {};
  factory.cache = function() {
    return localStorage['projects'] = angular.toJson(Projects);
  };
  factory.getProjects = function() {
    return Projects;
  };
  factory.createProject = function(name) {
    var id, project;
    id = generateID(2, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = Projects.length; _i < _len; _i++) {
        project = Projects[_i];
        _results.push(project.id);
      }
      return _results;
    })());
    Projects.push({
      name: name,
      id: id,
      folder: DB.folder + (slug(name)) + '/',
      users: [],
      tasks: [],
      deletedTasks: []
    });
    return factory.cache();
  };
  factory.readProject = function(id) {
    var project;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = Projects.length; _i < _len; _i++) {
        project = Projects[_i];
        if (project.id === id) {
          _results.push(project);
        }
      }
      return _results;
    })())[0];
  };
  factory.createTask = function(projectID, task) {
    var project, t, _i, _len;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (!(project.id === projectID)) {
        continue;
      }
      task.id = generateID(2, (function() {
        var _j, _len1, _ref, _results;
        _ref = project.tasks;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          t = _ref[_j];
          _results.push(t.id);
        }
        return _results;
      })());
      task.date = (new Date).getTime();
      task.edit = (new Date).getTime();
      project.tasks.push(task);
    }
    return factory.cache();
  };
  factory.editTask = function(projectID, taskID, values) {
    var k, project, task, v, _i, _j, _len, _len1, _ref;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (project.id === projectID) {
        _ref = project.tasks;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          task = _ref[_j];
          if (!(task.id === taskID)) {
            continue;
          }
          values.edit = (new Date).getTime();
          for (k in values) {
            v = values[k];
            if (k !== 'id' && k !== 'date') {
              task[k] = v;
            }
          }
        }
      }
    }
    return factory.cache();
  };
  factory.deleteTask = function(projectID, taskID) {
    var project, task, _i, _len;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (!(project.id === projectID)) {
        continue;
      }
      project.deletedTasks.push(((function() {
        var _j, _len1, _ref, _results;
        _ref = project.tasks;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          task = _ref[_j];
          if (task.id === taskID) {
            _results.push(task.id);
          }
        }
        return _results;
      })())[0]);
      project.tasks = (function() {
        var _j, _len1, _ref, _results;
        _ref = project.tasks;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          task = _ref[_j];
          if (task.id !== taskID) {
            _results.push(task);
          }
        }
        return _results;
      })();
    }
    return factory.cache();
  };
  return factory;
});

console.log('Services loaded');

/* --------------------------------------------
     Begin helpers.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseHelpers', []);

generateID = function(n, list) {
  var k;
  return ((function() {
    var _results;
    _results = [];
    while ((k == null) || (__indexOf.call(list, k) >= 0)) {
      _results.push(k = Math.random().toString(36).substr(2, n));
    }
    return _results;
  })()).toString();
};

slug = function(str) {
  var from, i, to, _i, _len, _ref, _ref1;
  _ref = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()], from = _ref[0], to = _ref[1], str = _ref[2];
  _ref1 = from.length;
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    i = _ref1[_i];
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  return str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-");
};

splitTags = function(str) {
  if (!str.length) {

  } else {
    return str.toString().split(',').map(function(a) {
      if (a.trim) {
        return a.trim();
      }
    });
  }
};

console.log('Helpers module loaded');
