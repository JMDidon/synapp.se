var Project, synappseApp;

synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseDropbox', 'synappseControllers', 'synappseServices', 'synappseHelpers', 'synappseConflictManager']);

Project = {
  name: 'project',
  folder: 'project/'
};

synappseApp.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html'
    }).when('/home', {
      redirectTo: '/'
    }).when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UserCtrl'
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

synappseApp = angular.module('synappseDropbox', []);
client = new Dropbox.Client({
  key: '1n83me2ms50l6az'
});
client.authenticate(function(error, client) {
  if (error) {
    return console.log(error);
  }
});
console.log('Dropbox module loaded');
synappseApp = angular.module('synappseControllers', []);
synappseApp.controller('MainCtrl', [
  '$scope', 'Helpers', function($scope, Helpers) {
    var cache, project;
    cache = localStorage[Project.name] || Helpers.encodeProject(Project.name, [], []);
    project = Helpers.decodeProject(cache);
    $scope.users = project.users;
    client.getAccountInfo(function(error, user) {
      var u, _ref;
      if ((!$scope.users.length) || (_ref = user.name, __indexOf.call((function() {
        var _i, _len, _ref1, _results;
        _ref1 = $scope.users;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          u = _ref1[_i];
          _results.push(u.name);
        }
        return _results;
      })(), _ref) < 0)) {
        return $scope.users.push({
          name: user.name,
          email: user.email
        });
      }
    });
    $scope.tasks = project.tasks;
    $scope.deletedTasks = localStorage[Project.name + '_deletedTasks'] || [];
    return $scope.cache = function() {
      localStorage[Project.name] = Helpers.encodeProject(Project.name, $scope.users, $scope.tasks);
      return localStorage[Project.name + '_deletedTasks'] = $scope.deletedTasks;
    };
  }
]);
synappseApp.controller('TaskCtrl', [
  '$scope', 'TaskFactory', 'Helpers', function($scope, TaskFactory, Helpers) {
    $scope.addTask = function() {
      var task;
      $scope.tasks.push({
        id: Helpers.generateID(2, (function() {
          var _i, _len, _ref, _results;
          _ref = $scope.tasks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            _results.push(task.id);
          }
          return _results;
        })()),
        name: $scope.taskName
      });
      $scope.taskName = '';
      return $scope.cache();
    };
    $scope.deleteTask = function() {
      var index, task;
      $scope.deletedTasks.push($scope.task.id);
      index = ((function() {
        var _i, _len, _ref, _results;
        _ref = $scope.tasks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          _results.push(task.id);
        }
        return _results;
      })()).indexOf($scope.task.id);
      $scope.tasks.splice(index, 1);
      return $scope.cache();
    };
    $scope.sync = function() {
      client.metadata(Project.folder, function(error) {
        if (error && error.status === 404) {
          return client.mkdir(Project.folder);
        }
      });
      return client.readFile(Project.folder + '_app.json', function(error, data) {
        var distantIDs, localIDs, project, task, tasks, _i, _j, _len, _len1, _ref, _ref1, _ref2;
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
          _ref = $scope.tasks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            _results.push(task.id);
          }
          return _results;
        })();
        $scope.tasks = (function() {
          var _i, _len, _ref, _ref1, _results;
          _ref = $scope.tasks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            if (task.id.length === 2 || (_ref1 = task.id, __indexOf.call(distantIDs, _ref1) >= 0)) {
              _results.push(task);
            }
          }
          return _results;
        })();
        _ref = $scope.tasks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          if (task.id.length === 2) {
            task.id = Helpers.generateID(3, distantIDs);
          }
        }
        for (_j = 0, _len1 = tasks.length; _j < _len1; _j++) {
          task = tasks[_j];
          if ((_ref1 = task.id, __indexOf.call(localIDs, _ref1) < 0) && (_ref2 = task.id, __indexOf.call($scope.deletedTasks, _ref2) < 0)) {
            $scope.tasks.push(task);
          }
        }
        $scope.deletedTasks = [];
        $scope.$apply();
        $scope.cache();
        project = Helpers.encodeProject(Project.name, $scope.users, $scope.tasks);
        return client.writeFile(Project.folder + '_app.json', project, function(error, stat) {
          if (error) {
            return console.log(error);
          }
        });
      });
    };
    return $scope.cache = function() {
      localStorage[Project.name] = Helpers.encodeProject(Project.name, $scope.users, $scope.tasks);
      return localStorage[Project.name + '_deletedTasks'] = $scope.deletedTasks;
    };
  }
]);
synappseApp.controller('UserCtrl', [
  '$scope', 'UserFactory', 'Helpers', function($scope, UserFactory, Helpers) {
    return $scope.users = project.users;
  }
]);
console.log('Controllers loaded');
synappseApp = angular.module('synappseServices', ['ngResource']);
synappseApp.factory('TaskFactory', [
  '$http', function($http) {
    var ajaxURL, dataURL, factory, tasks;
    factory = {};
    tasks = [];
    dataURL = 'data/tasks.json';
    ajaxURL = 'src/tasks.php';
    factory.getTasks = function() {
      return $http.get(dataURL, {
        isArray: true
      });
    };
    factory.addTask = function(taskData) {
      return $http.post(ajaxURL, {
        data: {
          0: 'addTask',
          1: taskData
        }
      });
    };
    return factory;
  }
]);
synappseApp.factory('UserFactory', [
  '$http', function($http) {
    var ajaxURL, dataURL, factory, users;
    factory = {};
    users = [];
    dataURL = 'data/tasks.json';
    ajaxURL = 'src/tasks.php';
    factory.getUsers = function() {
      return $http.get(dataURL, {
        isArray: true
      });
    };
    factory.addUser = function(taskData) {
      return $http.post(ajaxURL, {
        data: {
          0: 'addTask',
          1: taskData
        }
      });
    };
    return factory;
  }
]);
synappseApp.factory('Helpers', [
  '$http', function($http) {
    var factory;
    factory = {};
    factory.generateID = function(n, list) {
      var k;
      return ((function() {
        var _results;
        _results = [];
        while ((!k) || __indexOf.call(list, k) >= 0) {
          _results.push(k = Math.random().toString(36).substr(2, n));
        }
        return _results;
      })()).toString();
    };
    factory.decodeProject = function(project) {
      return JSON.parse(project);
    };
    factory.encodeProject = function(name, users, tasks) {
      var project, task, user;
      project = {
        name: name,
        users: (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = users.length; _i < _len; _i++) {
            user = users[_i];
            _results.push(user);
          }
          return _results;
        })(),
        tasks: (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = tasks.length; _i < _len; _i++) {
            task = tasks[_i];
            _results.push({
              id: task.id,
              name: task.name
            });
          }
          return _results;
        })()
      };
      project = JSON.stringify(project);
      return project;
    };
    return factory;
  }
]);
console.log('Services loaded');
synappseApp = angular.module('synappseHelpers', []);
console.log('Helpers module loaded');
synappseApp = angular.module('synappseConflictManager', []);
console.log('Conflict manager loaded');