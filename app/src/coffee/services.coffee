# Services module
# ------------------------------
synappseApp = angular.module 'synappseServices', ['ngResource']


# Projects factory
# ------------------------------
# localStorage['projects'] = [] # reinitialize cache
synappseApp.factory 'Projects', ->
	Projects = if localStorage['projects'] then ( angular.fromJson localStorage['projects'] ) else []
	factory = {}
	factory.cache = -> localStorage['projects'] = angular.toJson Projects
	factory.getProjects = -> Projects

	# PROJECTS
	factory.createProject = ( name ) ->
		id = generateID 2, ( project.id for project in Projects )
		Projects.push
			name: name
			id: id
			folder: DB.folder+( slug name )+'/'
			users: []
			tasks: []
		do factory.cache
	
	factory.readProject = ( id ) ->
		( project for project in Projects when project.id is id )[0]
		
	# TASKS
	factory.createTask = ( projectID, task ) ->
		for project in Projects when project.id is projectID
			# console.log generateID 2, ( t.id for t in project.tasks )
			task.id = generateID 2, ( t.id for t in project.tasks )
			project.tasks.push task
		do factory.cache
		
	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
			project.deletedTasks.push ( task.id for task in project.tasks when task.id is taskID )[0]
			project.tasks = ( task for task in project.tasks when task.id isnt taskID )
		do factory.cache
		
	factory


# Task Factory
# ------------------------------
#synappseApp.factory 'TaskFactory', ['$http'
#	($http) ->
#		factory = {}
#		tasks 	= []
#		dataURL = 'data/tasks.json'
#		ajaxURL = 'src/tasks.php'
#
#		factory.getTasks = () ->
#			return $http.get(dataURL, isArray: true)
#
#		factory.addTask = (taskData) ->
#			return $http.post(ajaxURL, data: {0 : 'addTask', 1 : taskData})
#
#		return factory
#]


# User Factory
# ------------------------------
#synappseApp.factory 'UserFactory', ['$http'
#	($http) ->
#		factory = {}
#		users 	= []
#		dataURL = 'data/tasks.json'
#		ajaxURL = 'src/tasks.php'
#
#		factory.getUsers = () ->
#			return $http.get(dataURL, isArray: true)
#
#		factory.addUser = (taskData) ->
#			return $http.post(ajaxURL, data: {0 : 'addTask', 1 : taskData})
#
#		return factory
#]


# Data processing helpers
# ------------------------------

#synappseApp.factory 'Helpers', ['$http'
#	($http) ->
#		factory = {}
#
#		factory.generateID = ( n, list ) ->
#			( k = Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()
#
#		factory.decodeProject = ( project ) ->
#			JSON.parse project
#
#		factory.encodeProject = ( name, users, tasks ) ->
#			project = 
#				name: name
#				users: ( user for user in users )
#				tasks: 
#					for task in tasks
#						id: task.id
#						name: task.name
#			project = JSON.stringify project
#			return project
#
#		return factory
#]

console.log 'Services loaded'