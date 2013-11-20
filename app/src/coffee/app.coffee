#@prepros-append dropbox.coffee
#@prepros-append controllers.coffee
#@prepros-append services.coffee
#@prepros-append helpers.coffee


# App initialisation : get the various modules and include them
# ------------------------------
2 in [1..3]
synappseApp = angular.module 'synappseApp', [
	'ngRoute'
	'synappseControllers'
	'synappseServices'
	'synappseHelpers'
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
        ).when( '/projects/:params/users',
            templateUrl: 'views/users.html'
            controller : 'ProjectCtrl'
		).otherwise
			redirectTo: '/'
		undefined
]

console.log 'App loaded'