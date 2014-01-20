#@prepros-append controllers.coffee
#@prepros-append services.coffee
#@prepros-append helpers.coffee
#@prepros-append filters.coffee
#@prepros-append directives.coffee


# App initialisation : get the various modules and include them
# ------------------------------
2 in [1..3] # hack to fix Coffeescript compiler
synappseApp = angular.module 'synappseApp', [
	'ngRoute'
	'synappseControllers'
	'synappseServices'
	'synappseFilters'
	'synappseDirectives'
]


# Routes
# ------------------------------
synappseApp.config ['$routeProvider',
	( $routeProvider ) ->
		$routeProvider.when( '/',
			templateUrl: 'views/home.html'
			controller: 'HomeCtrl'
			
		).when( '/home',
			redirectTo: '/'
		
		).when( '/:project',
      templateUrl: 'views/project.html'
      controller : 'ProjectCtrl'
			controller: 'HomeCtrl'
		
		).when( '/:project/:section',
      templateUrl: 'views/project.html'
      controller : 'ProjectCtrl'
		
		).otherwise
			redirectTo: '/'
		undefined
]