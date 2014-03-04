(function() {
  var synappseApp,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  __indexOf.call([1, 2, 3], 2) >= 0;

  synappseApp = angular.module('synappseApp', ['ngRoute', 'synappseTranslate', 'synappseControllers', 'synappseServices', 'synappseFilters', 'synappseDirectives']);

  synappseApp.config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });
      $routeProvider.when('/home', {
        redirectTo: '/'
      });
      $routeProvider.when('/:project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      });
      $routeProvider.when('/:project/:section', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      });
      return $routeProvider.otherwise({
        redirectTo: '/'
      });
    }
  ]);

}).call(this);

  synappseApp = angular.module('synappseTranslate', ['pascalprecht.translate']);
  synappseApp.config([
    '$translateProvider', function($translateProvider) {
      $translateProvider.translations('en', {
        SELECT: 'Select a project',
        SHARE: 'share',
        FAQ_SHARE_TITLE: 'How do I share a project?',
        FAQ_SHARE_ANSWER_1: 'Click on the “share” button next to a project.',
        FAQ_SHARE_ANSWER_2: 'Once in Dropbox website, click on the ”Share” button on the top right corner.',
        FAQ_SHARE_ANSWER_3: 'Add your friend\'s email.',
        FAQ_SHARE_ANSWER_4: 'Tell them to move the shared folder into Synappse/ folder once they accepted the invitation.',
        FAQ_SHARE_ANSWER_5: 'It\'s done!',
        FAQ_DELETE_TITLE: 'How do I delete a project?',
        FAQ_DELETE_ANSWER: 'Just delete the matching folder. Your projects are located in your Dropbox/Synappse/ folder.',
        TASKS: 'Tasks',
        FILES: 'Files',
        DISCUSSIONS: 'Discussions',
        CREATE_PLACEHOLDER: 'New project name',
        CREATE: 'Create',
        SYNCED: 'Synced',
        TAB_DUES: 'Dues',
        TAB_OTHERS: 'Others',
        TAB_ARCHIVED: 'Archived',
        FORM_TASK_PLACEHOLDER: 'What do you have to do?',
        NO_MORE_TASKS: 'No more tasks',
        NO_TASKS: 'No tasks',
        TODO: 'To do',
        IN_PROGRESS: 'In progress',
        ADVANCED: 'Advanced',
        DONE: 'Done',
        ARCHIVED: 'Archived',
        NEW_TASK: 'New task',
        CANCEL: 'Cancel',
        DELETE: 'Delete',
        HIDE_CALENDAR: 'Hide calendar',
        SET_DUE_DATE: 'Set due date',
        UPDATE: 'Update',
        MON: 'M',
        TUE: 'T',
        WED: 'W',
        THU: 'T',
        FRI: 'F',
        SAT: 'S',
        SUN: 'S',
        TODAY: 'Today',
        NO_DUE: 'No due',
        REPORT: 'Report a bug'
      });
      $translateProvider.translations('fr', {
        SELECT: 'Choisir un projet',
        SHARE: 'partager',
        TASKS: 'Tâches',
        FILES: 'Fichiers',
        DISCUSSIONS: 'Discussions',
        FAQ_SHARE_TITLE: 'Comment partager un projet ?',
        FAQ_SHARE_ANSWER_1: 'Cliquer sur “partager” à côté d\'un projet.',
        FAQ_SHARE_ANSWER_2: 'Une fois sur le site Dropbox, cliquez sur "Share" en haut à droite',
        FAQ_SHARE_ANSWER_3: 'Ajoutez l\'email de votre ami(e).',
        FAQ_SHARE_ANSWER_4: 'Dites-lui de déplacer le fichier partagé dans le dossier Synappse/ une fois l\'invitation acceptée.',
        FAQ_SHARE_ANSWER_5: 'Et voilà !',
        FAQ_DELETE_TITLE: 'Comment supprimer un projet ?',
        FAQ_DELETE_ANSWER: 'Il suffit de supprimer le dossier correspondant. Vos projets sont situdés dans le dossier Dropbox/Synappse/.',
        CREATE_PLACEHOLDER: 'Nom du nouveau projet',
        CREATE: 'Créer',
        SYNCED: 'à jour',
        TAB_DUES: 'Datées',
        TAB_OTHERS: 'Autres',
        TAB_ARCHIVED: 'Archivées',
        FORM_TASK_PLACEHOLDER: 'Qu\'avez-vous à faire ?',
        NO_MORE_TASKS: 'Il n\'y a plus de tâches',
        NO_TASKS: 'Aucune tâche',
        TODO: 'À faire',
        IN_PROGRESS: 'En cours',
        ADVANCED: 'Avancée',
        DONE: 'Terminée',
        ARCHIVED: 'Archivée',
        NEW_TASK: 'Nouvelle tâche',
        CANCEL: 'Annuler',
        DELETE: 'Supprimer',
        HIDE_CALENDAR: 'Masquer cal.',
        SET_DUE_DATE: 'Date limite',
        UPDATE: 'Enregistrer',
        MON: 'L',
        TUE: 'M',
        WED: 'M',
        THU: 'J',
        FRI: 'V',
        SAT: 'S',
        SUN: 'D',
        January: 'Janvier',
        February: 'Février',
        March: 'Mars',
        April: 'Avril',
        May: 'Mai',
        June: 'Juin',
        July: 'Juillet',
        August: 'Août',
        September: 'Septembre',
        October: 'Octobre',
        November: 'Novembre',
        December: 'Décembre',
        Jan: 'Jan',
        Feb: 'Fév',
        Mar: 'Mars',
        Apr: 'Avr',
        May: 'Mai',
        June: 'Juin',
        July: 'Juil',
        Aug: 'Août',
        Sep: 'Sep',
        Oct: 'Oct',
        Nov: 'Nov',
        Dec: 'Déc',
        TODAY: 'Aujourd\'hui',
        NO_DUE: 'Non datée',
        REPORT: 'Signaler un problème'
      });
      return $translateProvider.preferredLanguage('en');
    }
  ]);
  synappseApp = angular.module('synappseControllers', []);
  synappseApp.controller('MainCtrl', [
    '$translate', '$scope', 'Projects', function($translate, $scope, Projects) {
      $scope.about = false;
      $scope.timeout = false;
      $scope.synced = false;
      $scope.projects = Projects.getProjects();
      $scope.me = {};
      $scope.lang = $translate.uses();
      $scope.changeLanguage = function(lang) {
        $translate.uses(lang);
        $scope.lang = lang;
        return localStorage['lang'] = lang;
      };
      if (localStorage['lang']) {
        $scope.changeLanguage(localStorage['lang']);
      }
      $scope.login = function() {
        $scope.me = DB.user;
        return $scope.$apply();
      };
      $scope.sync = function() {
        return DB.sync($scope.projects, function() {
          Projects.cache();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          clearTimeout($scope.timeout);
          $scope.synced = true;
          if (!$scope.$$phase) {
            return $scope.$apply();
          }
        });
      };
      $scope.sync();
      return $scope.schedule = function() {
        $scope.synced = false;
        if ($scope.timeout) {
          clearTimeout($scope.timeout);
        }
        return $scope.timeout = setTimeout($scope.sync, 20 * 1000);
      };
    }
  ]);
  synappseApp.controller('HomeCtrl', [
    '$scope', '$location', 'Projects', function($scope, $location, Projects) {
      $scope.createProject = function() {
        var slug;
        slug = Projects.createProject($scope.projectName);
        $scope.projectName = "";
        return $location.path('/' + slug);
      };
      return $scope.share = function(id) {
        var project;
        project = Projects.readProject(id);
        return DB.getShareUrl(project.folder, function(url) {
          return window.open(url, '_blank');
        });
      };
    }
  ]);
  synappseApp.controller('ProjectCtrl', [
    '$scope', '$routeParams', '$filter', 'Projects', function($scope, $routeParams, $filter, Projects) {
      $scope.project = Projects.findProject($routeParams.project);
      if ($scope.project.alerts == null) {
        $scope.project.alerts = [];
      }
      $scope.now = getCleanDate();
      $scope.statuses = ['TODO', 'IN_PROGRESS', 'ADVANCED', 'DONE', 'ARCHIVED'];
      $scope.tabs = ['TAB_DUES', 'TAB_OTHERS', 'TAB_ARCHIVED'];
      $scope.currentTab = 0;
      $scope.changeTab = function(tab) {
        return $scope.currentTab = tab;
      };
      $scope.$watch('project', $scope.schedule, true);
      $scope.task = {};
      $scope.emptyTask = function() {
        return $scope.task = {};
      };
      $scope.deleteTask = function() {
        return Projects.deleteTask($scope.project.id, $scope.task.id);
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
      $scope.tempDelete = [];
      $scope.multipleDelete = false;
      $scope.toggleDelete = function(id) {
        var index;
        index = $scope.tempDelete.indexOf(id);
        if (index > -1) {
          return $scope.tempDelete.splice(index, 1);
        } else {
          return $scope.tempDelete.push(id);
        }
      };
      $scope.toggleMultipleDelete = function() {
        var e, id, _i, _len, _ref, _results;
        e = document.getElementById('multipleDelete');
        $scope.multipleDelete = !$scope.multipleDelete;
        if ($scope.multipleDelete === true) {
          e.innerHTML = 'Delete selected';
        } else {
          e.innerHTML = 'Edit';
        }
        _ref = $scope.tempDelete;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          id = _ref[_i];
          _results.push(Projects.deleteTask($scope.project.id, id));
        }
        return _results;
      };
      return window.addEventListener('keydown', function(e) {
        if (e.which === 27) {
          $scope.setTaskOpen(false);
          return $scope.$apply();
        } else if (e.which >= 65 && e.which <= 90 && $scope.taskOpen === false) {
          $scope.setTaskOpen(0);
          return $scope.$apply();
        }
      });
    }
  ]);
  synappseApp.controller('CommentCtrl', [
    '$scope', '$routeParams', 'Projects', function($scope, $routeParams, Projects) {
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
    }
  ]);
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
      var n, original, p, _ref, _ref1;
      _ref = [name, 2], original = _ref[0], n = _ref[1];
      while (_ref1 = name.toLowerCase(), __indexOf.call((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = Projects.length; _i < _len; _i++) {
            p = Projects[_i];
            _results.push(p.name.toLowerCase());
          }
          return _results;
        })(), _ref1) >= 0) {
        name = original + ' (' + n + ')';
        n++;
      }
      Projects.push({
        name: name,
        id: generateID(2, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = Projects.length; _i < _len; _i++) {
            p = Projects[_i];
            _results.push(p.id);
          }
          return _results;
        })()),
        folder: DB.folder + (slug(name)) + '/',
        slug: slug(name),
        users: [DB.user],
        alerts: [],
        tasks: [],
        deletedTasks: [],
        comments: [],
        deletedComments: []
      });
      console.log(DB.user);
      return slug(name);
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
  synappseApp.filter('tasksFilter', function() {
    return function(tasks, filter) {
      var task, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results, _results1, _results2;
      switch (filter) {
        case 1:
          _ref = tasks || [];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            task = _ref[_i];
            if (task.due === false && task.status < 4) {
              _results.push(task);
            }
          }
          return _results;
          break;
        case 2:
          _ref1 = tasks || [];
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            task = _ref1[_j];
            if (task.status === 4) {
              _results1.push(task);
            }
          }
          return _results1;
          break;
        default:
          _ref2 = tasks || [];
          _results2 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            task = _ref2[_k];
            if (task.due !== false && task.status < 4) {
              _results2.push(task);
            }
          }
          return _results2;
      }
    };
  });
  synappseApp.filter('miniDate', [
    '$filter', function($filter) {
      return function(date, lang) {
        var diffDays, months;
        if (date === false) {
          return $filter('translate')('NO_DUE');
        }
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        date = getCleanDate(date);
        diffDays = Math.round((date - getCleanDate()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          return $filter('translate')('TODAY');
        } else if (lang === 'fr') {
          return date.getDate() + ' ' + $filter('translate')(months[date.getMonth()]);
        } else {
          return $filter('translate')(months[date.getMonth()]) + ' ' + date.getDate();
        }
      };
    }
  ]);
  synappseApp.filter('month', function() {
    return function(date) {
      var months;
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      date = getCleanDate(date);
      return months[date.getMonth()] + ' ' + date.getFullYear();
    };
  });
  synappseApp = angular.module('synappseDirectives', []);
  synappseApp.directive('task', [
    'Projects', function(Projects) {
      return {
        templateUrl: 'views/task.html',
        scope: true,
        controller: [
          '$scope', function($scope) {
            $scope.editMode = false;
            $scope.$watch('taskOpen', function() {
              return $scope.editMode = $scope.taskOpen === $scope.task.id;
            });
            $scope.toggleForm = function() {
              return $scope.setTaskOpen($scope.task.id);
            };
            $scope.$watch('task.due', function() {
              return $scope.late = $scope.task.due !== false && $scope.task.due <= $scope.now && $scope.task.status < 3;
            });
            $scope.editTask = function() {
              return Projects.editTask($scope.project.id, $scope.task.id, $scope.task);
            };
            return $scope.deleteTask = function() {
              return Projects.deleteTask($scope.project.id, $scope.task.id);
            };
          }
        ]
      };
    }
  ]);
  synappseApp.directive('taskForm', [
    'Projects', function(Projects) {
      return {
        templateUrl: 'views/taskForm.html',
        scope: true,
        controller: [
          '$scope', '$element', function($scope, $element) {
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
                $scope.changeTab(($scope.tmpTask.due === false ? 1 : 0));
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
        ]
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