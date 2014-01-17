// Generated by CoffeeScript 1.6.3
var generateID, getCleanDate, slug, synappseApp,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

__indexOf.call([1, 2, 3], 2) >= 0;

synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseControllers', 'synappseServices', 'synappseHelpers', 'synappseFilters', 'synappseDirectives']);

synappseApp.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).when('/home', {
      redirectTo: '/'
    }).when('/:project', {
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl'
    }, {
      controller: 'HomeCtrl'
    }).when('/:project/:section', {
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl'
    }).otherwise({
      redirectTo: '/'
    });
    return void 0;
  }
]);

/* --------------------------------------------
     Begin controllers.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseControllers', []);

synappseApp.controller('MainCtrl', function($scope, Projects) {
  $scope.projects = Projects.getProjects();
  $scope.me = {};
  $scope.login = function() {
    $scope.me = DB.user;
    return $scope.$apply();
  };
  $scope.sync = function() {
    localStorage['projects'] = [];
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

synappseApp.controller('HomeCtrl', function($scope, $routeParams, Projects) {
  return $scope.createProject = function() {
    return Projects.createProject($scope.name);
  };
});

synappseApp.controller('ProjectCtrl', function($scope, $routeParams, $location, Projects) {
  $scope.project = Projects.findProject($routeParams.project);
  $scope.now = getCleanDate();
  if ($scope.project.alerts == null) {
    $scope.project.alerts = [];
  }
  $scope.statuses = [
    {
      k: 0,
      v: 'Todo'
    }, {
      k: 1,
      v: 'In progress'
    }, {
      k: 2,
      v: 'Advanced'
    }, {
      k: 3,
      v: 'Done'
    }, {
      k: 4,
      v: 'Archived'
    }
  ];
  $scope.$watch('selectProject', function() {
    return $location.path('/' + $scope.selectProject);
  });
  $scope.task = {};
  $scope.emptyTask = function() {
    return $scope.task = {};
  };
  $scope.taskOpen = false;
  $scope.editMode = false;
  $scope.$watch('taskOpen', function() {
    return $scope.editMode = $scope.taskOpen === 0;
  });
  $scope.toggleForm = function() {
    return $scope.setTaskOpen(0);
  };
  $scope.setTaskOpen = function(taskID) {
    return $scope.taskOpen = taskID === $scope.taskOpen ? false : taskID;
  };
  return window.addEventListener('keydown', function(e) {
    if (e.which === 27) {
      $scope.setTaskOpen(false);
      return $scope.$apply();
    }
  });
});

synappseApp.controller('CommentCtrl', function($scope, $routeParams, Projects) {
  $scope.createComment = function() {
    Projects.createComment($scope.project.id, {
      author: DB.user.uid,
      taskID: $scope.selectedTask.id,
      parentID: 0,
      text: $scope.newComment.text
    });
    $scope.newComment = {};
    return $scope.toggleCommentForm();
  };
  return $scope.deleteComment = function() {
    return Projects.deleteComment($scope.project.id, $scope.comment.id);
  };
});

/* --------------------------------------------
     Begin services.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseServices', []);

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
    var id, project, projectExist, projectTestName, _i, _len;
    projectExist = false;
    projectTestName = name.toLowerCase();
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (project.name === projectTestName) {
        projectExist = true;
      }
    }
    if (projectExist === true) {
      console.log('Project already exists !');
    } else {
      id = generateID(2, (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = Projects.length; _j < _len1; _j++) {
          project = Projects[_j];
          _results.push(project.id);
        }
        return _results;
      })());
      console.log('Creating task with id : ', id);
      Projects.push({
        name: name,
        id: id,
        folder: DB.folder + (slug(name)) + '/',
        slug: slug(name),
        users: [],
        alerts: [],
        tasks: [],
        deletedTasks: [],
        comments: [],
        deletedComments: []
      });
      return factory.cache();
    }
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
    })())[0] || {};
  };
  factory.findProject = function(slug) {
    var project;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = Projects.length; _i < _len; _i++) {
        project = Projects[_i];
        if (project.slug === slug) {
          _results.push(project);
        }
      }
      return _results;
    })())[0] || {};
  };
  factory.getUserByUID = function(projectID, uid) {
    var project, user, _i, _j, _len, _len1;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (project.id === projectID) {
        for (_j = 0, _len1 = project.length; _j < _len1; _j++) {
          user = project[_j];
          if (user.uid === uid) {
            return user;
          }
        }
      }
    }
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
      if (__indexOf.call(project.deletedTasks, taskID) < 0) {
        project.deletedTasks.push(taskID);
      }
      project.tasks = angular.copy((function() {
        var _j, _len1, _ref, _ref1, _results;
        _ref = project.tasks;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          task = _ref[_j];
          if (_ref1 = task.id, __indexOf.call(project.deletedTasks, _ref1) < 0) {
            _results.push(task);
          }
        }
        return _results;
      })());
    }
    return factory.cache();
  };
  factory.createComment = function(projectID, comment) {
    var c, project, _i, _len;
    console.log(projectID, comment);
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (!(project.id === projectID)) {
        continue;
      }
      comment.id = generateID(2, (function() {
        var _j, _len1, _ref, _results;
        _ref = project.comments;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          c = _ref[_j];
          _results.push(c.id);
        }
        return _results;
      })());
      comment.date = (new Date).getTime();
      comment.edit = (new Date).getTime();
      project.comments.push(comment);
    }
    return factory.cache();
  };
  factory.deleteComment = function(projectID, commentID) {
    var comment, project, _i, _len;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (!(project.id === projectID)) {
        continue;
      }
      if (__indexOf.call(project.deletedComments, commentID) < 0) {
        project.deletedComments.push(commentID);
      }
      project.comments = angular.copy((function() {
        var _j, _len1, _ref, _ref1, _results;
        _ref = project.comments;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          comment = _ref[_j];
          if (_ref1 = comment.id, __indexOf.call(project.deletedComments, _ref1) < 0) {
            _results.push(comment);
          }
        }
        return _results;
      })());
    }
    return factory.cache();
  };
  factory.alert = function(projectID, text, userID) {
    var a, project, _i, _len;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (!(project.id === projectID)) {
        continue;
      }
      if (project.alerts == null) {
        project.alerts = [];
      }
      project.alerts.push({
        id: generateID(2, (function() {
          var _j, _len1, _ref, _results;
          _ref = project.alerts;
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            a = _ref[_j];
            _results.push(a.id);
          }
          return _results;
        })()),
        text: text,
        seen: [userID]
      });
    }
    return factory.cache();
  };
  factory.seen = function(projectID, alertID, userID) {
    var alert, project, _i, _j, _len, _len1, _ref;
    for (_i = 0, _len = Projects.length; _i < _len; _i++) {
      project = Projects[_i];
      if (project.id === projectID) {
        _ref = project.alerts;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          alert = _ref[_j];
          if (alert.id === alertID) {
            if (__indexOf.call(alert.seen, userID) < 0) {
              alert.seen.push(userID);
            }
          }
        }
      }
    }
    return factory.cache();
  };
  return factory;
});

/* --------------------------------------------
     Begin helpers.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseHelpers', []);

getCleanDate = function(date) {
  date = date ? new Date(date) : new Date;
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return date;
};

generateID = function(n, list, prefix) {
  var k;
  if (prefix == null) {
    prefix = '';
  }
  return ((function() {
    var _results;
    _results = [];
    while ((k == null) || (__indexOf.call(list, k) >= 0)) {
      _results.push(k = prefix + Math.random().toString(36).substr(2, n));
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

/* --------------------------------------------
     Begin filters.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseFilters', []);

synappseApp.filter('DropboxUIDToUsername', [
  'Projects', function(Projects) {
    return function(uid, projectID) {
      var firstName, project, result, user;
      project = Projects.readProject(projectID);
      result = ((function() {
        var _i, _len, _ref, _results;
        _ref = project.users;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          user = _ref[_i];
          if (user.uid === uid) {
            _results.push(user.name);
          }
        }
        return _results;
      })())[0];
      if (!result) {
        return "Unnamed";
      }
      firstName = result.substring(0, result.indexOf(' '));
      if (~((function() {
        var _i, _len, _ref, _results;
        _ref = project.users;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          user = _ref[_i];
          if (user.uid !== uid) {
            _results.push(user.name.substring(0, user.name.indexOf(' ')));
          }
        }
        return _results;
      })()).indexOf(firstName)) {
        return (result.substring(0, 2 + result.indexOf(' '))) + '.';
      } else {
        return firstName;
      }
    };
  }
]);

synappseApp.filter('assignee', function() {
  return function(name) {
    return name.substr(0, 1);
  };
});

synappseApp.filter('unseen', function() {
  return function(alerts) {
    var alert, _i, _len, _ref, _ref1, _results;
    _ref = alerts || [];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      alert = _ref[_i];
      if (_ref1 = DB.user.uid, __indexOf.call(alert.seen, _ref1) < 0) {
        _results.push(alert);
      }
    }
    return _results;
  };
});

synappseApp.filter('tasksDue', function() {
  return function(tasks) {
    var task, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      if (task.due !== false && task.status < 4) {
        _results.push(task);
      }
    }
    return _results;
  };
});

synappseApp.filter('tasksNoDue', function() {
  return function(tasks) {
    var task, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      if (task.due === false && task.status < 4) {
        _results.push(task);
      }
    }
    return _results;
  };
});

synappseApp.filter('tasksArchived', function() {
  return function(tasks) {
    var task, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      if (task.status === 4) {
        _results.push(task);
      }
    }
    return _results;
  };
});

synappseApp.filter('miniDate', function() {
  return function(date) {
    var diffDays, months;
    if (date === false) {
      return "";
    }
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    date = getCleanDate(date);
    diffDays = Math.round((date - getCleanDate()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 'Today';
    } else {
      return months[date.getMonth()] + ' ' + date.getDate();
    }
  };
});

synappseApp.filter('month', function() {
  return function(date) {
    var months;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    date = getCleanDate(date);
    return months[date.getMonth()] + ' ' + date.getFullYear();
  };
});

synappseApp.filter('relativeDate', function() {
  return function(date) {
    var delta;
    delta = Math.floor((new Date - date) / 1000);
    switch (false) {
      case !(delta < 120):
        return 'about one minute ago';
      case !(delta >= 120 && delta < 60 * 60):
        return (Math.floor(delta / 60)) + ' minutes ago';
      case !(delta >= 60 * 60 && delta < 60 * 60 * 2):
        return (Math.floor(delta / (60 * 60))) + ' hour ago';
      case !(delta >= 60 * 60 * 2 && delta < 60 * 60 * 24):
        return (Math.floor(delta / (60 * 60))) + ' hours ago';
      case !(delta >= 60 * 60 * 24 && delta < 60 * 60 * 24 * 2):
        return 'yesterday';
      case !(delta >= 60 * 60 * 24 && delta < 60 * 60 * 24 * 30):
        return (Math.floor(delta / (60 * 60 * 24))) + ' days ago';
      default:
        return 'on ' + smartDate(date);
    }
  };
});

synappseApp.filter('smartDate', function() {
  return function(date) {
    var days, diffDays, months, now;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    date = getCleanDate(date);
    now = getCleanDate();
    diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24));
    switch (false) {
      case date.getFullYear() === now.getFullYear():
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      case diffDays !== 0:
        return 'Today';
      case diffDays !== 1:
        return 'Tomorrow';
      case !((0 < diffDays && diffDays < 7)):
        return days[(now.getDay() + diffDays - 1) % 7];
      default:
        return months[date.getMonth()] + ' ' + date.getDate();
    }
  };
});

/* --------------------------------------------
     Begin directives.coffee
--------------------------------------------
*/


synappseApp = angular.module('synappseDirectives', []);

synappseApp.directive('task', [
  'Projects', function(Projects) {
    return {
      templateUrl: 'views/task.html',
      scope: true,
      controller: function($scope) {
        $scope.editMode = false;
        $scope.$watch('taskOpen', function() {
          return $scope.editMode = $scope.taskOpen === $scope.task.id;
        });
        $scope.toggleForm = function() {
          return $scope.setTaskOpen($scope.task.id);
        };
        $scope.late = $scope.task.due <= $scope.now && $scope.task.status < 3;
        $scope.$watch('task.status', function() {
          $scope.late = $scope.task.due <= $scope.now && $scope.task.status < 3;
          return Projects.editTask($scope.project.id, $scope.task.id, $scope.task);
        });
        return $scope.deleteTask = function() {
          return Projects.deleteTask($scope.project.id, $scope.task.id);
        };
      }
    };
  }
]);

synappseApp.directive('taskForm', [
  'Projects', function(Projects) {
    return {
      templateUrl: 'views/taskForm.html',
      scope: true,
      controller: function($scope, $element) {
        $element[0].querySelector('textarea').focus();
        $scope.tmpTask = $scope.task.id ? angular.copy($scope.task) : $scope.task;
        if ($scope.tmpTask.users == null) {
          $scope.tmpTask.users = [];
        }
        $scope.submit = function() {
          if ($scope.tmpTask.name.match(/^\s*$/)) {
            return false;
          }
          if (isNaN((new Date($scope.tmpTask.due)).getTime())) {
            $scope.tmpTask.due = false;
          }
          if ($scope.task.id != null) {
            $scope.toggleForm();
            return Projects.editTask($scope.project.id, $scope.task.id, $scope.tmpTask);
          } else {
            Projects.createTask($scope.project.id, {
              name: $scope.tmpTask.name,
              author: DB.user.uid,
              status: 0,
              priority: $scope.tmpTask.priority || false,
              due: $scope.tmpTask.due,
              users: $scope.tmpTask.users
            });
            $scope.emptyTask();
            $scope.tmpTask = $scope.task;
            return $element[0].querySelector('textarea').focus();
          }
        };
        return $scope.toggleUser = function(uid) {
          var index;
          index = $scope.tmpTask.users.indexOf(uid);
          if (index > -1) {
            return $scope.tmpTask.users.splice(index, 1);
          } else {
            return $scope.tmpTask.users.push(uid);
          }
        };
      }
    };
  }
]);

synappseApp.directive('calendar', function() {
  return {
    templateUrl: 'views/calendar.html',
    scope: true,
    link: function(scope) {
      var now;
      scope.current = getCleanDate(scope.tmpTask.due);
      scope.current.setDate(1);
      scope.rows = [];
      now = getCleanDate();
      scope.update = function() {
        var cell, current, first, month, row, _results;
        scope.rows = [];
        cell = 0;
        row = [];
        first = scope.current.getDay() - 2;
        month = scope.current.getMonth();
        _results = [];
        while (true) {
          current = angular.copy(scope.current);
          current.setDate(cell - first);
          row.push({
            date: current.getTime(),
            day: current.getDate(),
            isToday: (Math.round((current - now) / (1000 * 60 * 60 * 24))) === 0,
            isWeekEnd: cell % 7 > 4,
            isPrev: cell <= first,
            isNext: cell > first && current.getMonth() !== month
          });
          if (cell % 7 === 6) {
            scope.rows.push({
              cells: angular.copy(row)
            });
            row = [];
          }
          if (cell > first && current.getMonth() !== month && current.getDate() < 8 && cell % 7 === 6) {
            break;
          }
          _results.push(cell++);
        }
        return _results;
      };
      scope.prev = function() {
        scope.current.setMonth(scope.current.getMonth() - 1);
        return scope.update();
      };
      scope.next = function() {
        scope.current.setMonth(scope.current.getMonth() + 1);
        return scope.update();
      };
      scope.setDate = function(cell) {
        if (cell.isPrev) {
          scope.prev();
        }
        if (cell.isNext) {
          scope.next();
        }
        return scope.tmpTask.due = cell.date !== scope.tmpTask.due ? cell.date : false;
      };
      scope.remove = function() {
        return scope.tmpTask.due = false;
      };
      return scope.update();
    }
  };
});
