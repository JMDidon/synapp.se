#@prepros-append dropbox.coffee
#@prepros-append controllers.coffee
#@prepros-append services.coffee
#@prepros-append helpers.coffee
#@prepros-append conflictManager.coffee


# App initialisation : get the various modules and include them
# ------------------------------
synappseApp = angular.module 'synappseApp', [
	'ngRoute'
	'synappseDropbox'
	'synappseControllers'
	'synappseServices'
	'synappseHelpers'
	'synappseConflictManager'
]

# Project initialisation
# ------------------------------
# Project = 
# 	name: 'project'
# 	folder: 'project/'


# Routes
# ------------------------------
synappseApp.config ['$routeProvider',
	($routeProvider) ->
		$routeProvider.when( '/',
			templateUrl: 'views/home.html'
		).when( '/home',
			redirectTo: '/'
		).when( '/projects/:params',
            templateUrl: 'views/tasks.html'
            controller : 'ProjectCtrl'
        ).when( '/tasks',
            templateUrl: 'views/tasks.html'
            controller : 'TaskCtrl'
        ).when( '/tasks/new-task',
			templateUrl: 'views/new-task.html'
			controller : 'TaskCtrl'
		).otherwise
			redirectTo: '/'
		undefined
]

console.log 'App loaded'