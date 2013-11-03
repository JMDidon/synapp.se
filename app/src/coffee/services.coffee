# Services module
# ------------------------------
synappseApp = angular.module 'synappseServices', ['ngResource']


# Task Factory
# ------------------------------
synappseApp.factory 'TaskFactory', ['$http'
	($http) ->
		factory = {}
		tasks 	= []
		dataURL = 'data/tasks.json'
		ajaxURL = 'src/tasks.php'

		factory.getTasks = () ->
			return $http.get(dataURL, isArray: true)

		factory.addTask = (taskData) ->
			return $http.post(ajaxURL, data: {0 : 'addTask', 1 : taskData})

		return factory
]


# User Factory
# ------------------------------
synappseApp.factory 'UserFactory', ['$http'
	($http) ->
		factory = {}
		users 	= []
		dataURL = 'data/tasks.json'
		ajaxURL = 'src/tasks.php'

		factory.getUsers = () ->
			return $http.get(dataURL, isArray: true)

		factory.addUser = (taskData) ->
			return $http.post(ajaxURL, data: {0 : 'addTask', 1 : taskData})

		return factory
]


# Data processing helpers
# ------------------------------

synappseApp.factory 'Helpers', ['$http'
	($http) ->
		factory = {}

		factory.generateID = ( n, list ) ->
			( k = Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()

		factory.decodeProject = ( project ) ->
			JSON.parse project

		factory.encodeProject = ( name, users, tasks ) ->
			project = 
				name: name
				users: ( user for user in users )
				tasks: 
					for task in tasks
						id: task.id
						name: task.name
			project = JSON.stringify project
			return project

		return factory
]

console.log 'Services loaded'