var synappseApp,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

__indexOf.call([1, 2, 3], 2) >= 0;

synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseControllers', 'synappseServices', 'synappseHelpers', 'synappseConflictManager']);

synappseApp.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
    }).when('/home', {
      redirectTo: '/'
    }).when('/projects/:params', {
      templateUrl: 'views/tasks.html',
      controller: 'ProjectCtrl'
    }).when('/tasks', {
      templateUrl: 'views/tasks.html',
      controller: 'TaskCtrl'
    }).when('/tasks/new-task', {
      templateUrl: 'views/new-task.html',
      controller: 'TaskCtrl'
    }).otherwise({
      redirectTo: '/'
    });
    return void 0;
  }
]);

console.log('App loaded');

DB = {
  key: '8437zcdkz4nvggb',
  folder: 'Synappse/',
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
      return $this.checkFolder($this.folder, callback);
    });
  },
  checkFolder: function(folder, callback) {
    var $this;
    $this = this;
    return this.client.stat(folder, function(error, stats) {
      if (error) {
        return $this.client.mkdir(folder, function(error, stats) {
          if (error) {
            console.log(error);
          }
          return callback();
        });
      } else {
        return callback();
      }
    });
  },
  syncProjects: function(local, callback) {
    var $this;
    $this = this;
    return this.checkFolder(this.folder, function() {
      return $this.client.readdir($this.folder, function(error, children) {
        var child, projects, waiting, _i, _len, _results;
        waiting = children.length;
        projects = [];
        _results = [];
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          _results.push($this.client.readFile($this.folder + child + '/' + '_app.json', function(error, data, stat) {
            var folder, index, localIDs, p, project, removed, _j, _len1, _ref, _ref1;
            waiting--;
            localIDs = (function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = local.length; _j < _len1; _j++) {
                p = local[_j];
                _results1.push(p.id);
              }
              return _results1;
            })();
            project = data ? JSON.parse(data) : void 0;
            if (error && error.status === 404) {
              folder = (decodeURI(error.url)).replace(/^.+\/([^\/]+)\/_app\.json(?:\?.+)?$/, '$1');
              console.log($this.folder + folder + '/');
              project = {
                name: folder,
                id: generateID(2, localIDs),
                folder: $this.folder + folder + '/',
                users: [],
                tasks: [],
                deletedTasks: []
              };
            } else {
              project = JSON.parse(data);
              project.folder = stat.path.replace(stat.name, '');
            }
            if (_ref = project.id, __indexOf.call(localIDs, _ref) < 0) {
              local.push(project);
            }
            projects.push(project.id);
            if (!waiting) {
              _ref1 = (function() {
                var _k, _len1, _ref1, _results1;
                _results1 = [];
                for (_k = 0, _len1 = local.length; _k < _len1; _k++) {
                  p = local[_k];
                  if (_ref1 = p.id, __indexOf.call(projects, _ref1) < 0) {
                    _results1.push(p.id);
                  }
                }
                return _results1;
              })();
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                removed = _ref1[_j];
                index = ((function() {
                  var _k, _len2, _results1;
                  _results1 = [];
                  for (_k = 0, _len2 = local.length; _k < _len2; _k++) {
                    p = local[_k];
                    _results1.push(p.id);
                  }
                  return _results1;
                })()).indexOf(removed);
                if (index > -1) {
                  local.splice(index, 1);
                }
              }
              return callback();
            }
          }));
        }
        return _results;
      });
    });
  },
  syncProject: function(local, callback) {
    var $this;
    $this = this;
    return this.client.stat(local.folder, function(error, stats) {
      return $this.checkFolder(local.folder, function() {
        return $this.client.readFile(local.folder + '_app.json', function(error, data, stat) {
          var distantIDs, localIDs, task, tasks, _i, _j, _len, _len1, _ref, _ref1, _ref2;
          if (error) {
            console.log(error);
          }
          tasks = data ? (JSON.parse(data)).tasks : [];
          distantIDs = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tasks.length; _i < _len; _i++) {
              task = tasks[_i];
              _results.push(task.id);
            }
            return _results;
          })();
          localIDs = (function() {
            var _i, _len, _ref, _results;
            _ref = local.tasks;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              task = _ref[_i];
              _results.push(task.id);
            }
            return _results;
          })();
          local.tasks = (function() {
            var _i, _len, _ref, _ref1, _results;
            _ref = local.tasks;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              task = _ref[_i];
              if (task.id.length === 2 || (_ref1 = task.id, __indexOf.call(distantIDs, _ref1) >= 0)) {
                _results.push(task);
              }
            }
            return _results;
          })();
          _ref = local.tasks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            if (task.id.length === 2) {
              task.id = generateID(3, distantIDs);
            }
          }
          for (_j = 0, _len1 = tasks.length; _j < _len1; _j++) {
            task = tasks[_j];
            if ((_ref1 = task.id, __indexOf.call(localIDs, _ref1) < 0) && (_ref2 = task.id, __indexOf.call(local.deletedTasks, _ref2) < 0)) {
              local.tasks.push(task);
            }
          }
          local.deletedTasks = [];
          return $this.client.writeFile(local.folder + '_app.json', angular.toJson(local), function(error, stat) {
            if (error) {
              console.log(error);
            }
            return callback();
          });
        });
      });
    });
  }
};
console.log('Dropbox module loaded');
synappseApp = angular.module('synappseControllers', []);
synappseApp.controller('MainCtrl', function($scope, Projects) {
  $scope.projects = Projects.getProjects();
  $scope.auth = false;
  $scope.login = function() {
    $scope.auth = true;
    return $scope.$apply();
  };
  DB.auth($scope.login);
  $scope.syncProjects = function() {
    return DB.syncProjects($scope.projects, function() {
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
  $scope.syncProject = function() {
    return DB.syncProject($scope.project, function() {
      Projects.cache();
      return $scope.$apply();
    });
  };
  return $scope.createTask = function() {
    Projects.createTask($scope.project.id, {
      name: $scope.task.name,
      description: $scope.task.description
    });
    return $scope.task.name = "";
  };
});
synappseApp.controller('TaskCtrl', function($scope, $routeParams, Projects) {
  return $scope.deleteTask = function() {
    return Projects.deleteTask($scope.project.id, $scope.task.id);
  };
});
console.log('Controllers loaded');
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
      project.tasks.push(task);
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
console.log('Helpers module loaded');
synappseApp = angular.module('synappseConflictManager', []);
console.log('Conflict manager loaded');