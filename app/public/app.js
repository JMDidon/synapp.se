var synappseApp,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

__indexOf.call([1, 2, 3], 2) >= 0;

synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseControllers', 'synappseServices', 'synappseHelpers', 'synappseFilters']);

synappseApp.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).when('/home', {
      redirectTo: '/'
    }).when('/projects/:params', {
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl'
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
          tasks: [],
          deletedTasks: [],
          comments: [],
          deletedComments: []
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
    if (!this.client) {
      return callback();
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
              console.log("sync complete");
              return callback();
            });
          }
        }));
      }
      return _results;
    });
  },
  updateProject: function(local, distant) {
    var comment, task, u, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
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
    local.comments = this.solveConflicts(local.comments, distant.comments, local.deletedComments);
    local.deletedTasks = [];
    local.deletedComments = [];
    _ref2 = local.comments;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      comment = _ref2[_j];
      _ref3 = local.tasks;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        task = _ref3[_k];
        if (task.oldID === comment.taskID) {
          comment.taskID = task.id;
        }
      }
    }
    _ref4 = local.tasks;
    for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
      task = _ref4[_l];
      delete task.oldID;
    }
    return this.saveProject(local);
  },
  solveConflicts: function(localItems, distantItems, deletedItems) {
    var distant, distantIDs, distants, i, item, k, local, localIDs, locals, v, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
    locals = angular.copy(localItems);
    distants = angular.copy(distantItems);
    distantIDs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = distants.length; _i < _len; _i++) {
        item = distants[_i];
        _results.push(item.id);
      }
      return _results;
    })();
    locals = (function() {
      var _i, _len, _ref, _results;
      _results = [];
      for (i = _i = 0, _len = locals.length; _i < _len; i = ++_i) {
        item = locals[i];
        if (item.id.length === 2 || (_ref = item.id, __indexOf.call(distantIDs, _ref) >= 0)) {
          _results.push(item);
        }
      }
      return _results;
    })();
    for (_i = 0, _len = locals.length; _i < _len; _i++) {
      item = locals[_i];
      if (!(item.id.length === 2)) {
        continue;
      }
      item.oldID = item.id;
      item.author = DB.user.uid;
      item.id = generateID(3, distantIDs);
    }
    for (_j = 0, _len1 = locals.length; _j < _len1; _j++) {
      local = locals[_j];
      if (item.id.length === 3 && (_ref = item.id, __indexOf.call(distantIDs, _ref) >= 0)) {
        for (_k = 0, _len2 = distants.length; _k < _len2; _k++) {
          distant = distants[_k];
          if (local.id === distant.id) {
            if (local.edit <= distant.edit) {
              for (k in distant) {
                v = distant[k];
                local[k] = v;
              }
            }
          }
        }
      }
    }
    localIDs = (function() {
      var _l, _len3, _results;
      _results = [];
      for (_l = 0, _len3 = locals.length; _l < _len3; _l++) {
        item = locals[_l];
        _results.push(item.id);
      }
      return _results;
    })();
    for (_l = 0, _len3 = distants.length; _l < _len3; _l++) {
      item = distants[_l];
      if ((_ref1 = item.id, __indexOf.call(localIDs, _ref1) < 0) && (_ref2 = item.id, __indexOf.call(deletedItems, _ref2) < 0)) {
        locals.push(item);
      }
    }
    return locals;
  }
};
console.log('Dropbox module loaded');
synappseApp = angular.module('synappseControllers', []);
synappseApp.controller('MainCtrl', function($scope, Projects) {
  $scope.projects = Projects.getProjects();
  $scope.auth = false;
  $scope.login = function() {
    $scope.auth = true;
    $scope.connectedUser = DB.user.name;
    return $scope.$apply();
  };
  DB.auth($scope.login);
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
synappseApp.controller('ProjectCtrl', function($scope, $routeParams, Projects) {
  $scope.project = Projects.findProject($routeParams.params);
  $scope.newTask = {};
  $scope.newComment = {};
  $scope.selectedTask = {};
  $scope.toggleCommentForm = function() {
    if ($scope.comment !== void 0) {
      $scope.comment.text = '';
    }
    return $scope.opened = !$scope.opened;
  };
  $scope.createTask = function() {
    Projects.createTask($scope.project.id, {
      name: $scope.newTask.name,
      author: DB.user.uid,
      status: $scope.newTask.status,
      priority: $scope.newTask.priority,
      start: $scope.newTask.start,
      end: $scope.newTask.end,
      tags: splitTags($scope.newTask.tags),
      users: $scope.newTask.users
    });
    return $scope.newTask = {};
  };
  return $scope.openComments = function(task) {
    $scope.opened = true;
    return $scope.selectedTask = task;
  };
});
synappseApp.controller('TaskCtrl', function($scope, $routeParams, Projects) {
  $scope.taskEdit = angular.copy($scope.task);
  $scope.taskEdit.tags = $scope.taskEdit.tags.join(', ');
  $scope.edit_mode = false;
  $scope.toggleEditMode = function() {
    return $scope.edit_mode = !$scope.edit_mode;
  };
  $scope.editTask = function() {
    console.log('TCHOU TCHOU MOTHAFUCKAZ');
    $scope.edit_mode = !$scope.edit_mode;
    $scope.taskEdit.tags = splitTags($scope.taskEdit.tags);
    return Projects.editTask($scope.project.id, $scope.task.id, $scope.taskEdit);
  };
  $scope.deleteTask = function() {
    return Projects.deleteTask($scope.project.id, $scope.task.id);
  };
  return $scope.openCommentsFromTask = function() {
    return $scope.openComments($scope.task);
  };
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
  return factory;
});
console.log('Services loaded');
synappseApp = angular.module('synappseHelpers', []);
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
splitTags = function(str) {
  if (str == null) {
    return [];
  } else {
    return str.toString().split(',').map(function(a) {
      if (a.trim) {
        return a.trim();
      }
    });
  }
};
console.log('Helpers module loaded');
synappseApp = angular.module('synappseFilters', []);
synappseApp.filter('DropboxUIDToUsername', [
  'Projects', function(Projects) {
    return function(uid, slug) {
      var firstName, project, result, user;
      project = Projects.findProject(slug);
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
    date = new Date(date);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    now = new Date;
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
console.log('Filters module loaded');
