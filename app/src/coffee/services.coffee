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

		# Check if folder exists
		Projects.push
			name: name
			id: id
			folder: DB.folder+( slug name )+'/'
			users: []
			tasks: []
			deletedTasks: []
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

	factory.editTask = ( projectID, taskID, task ) ->
		for project in Projects when project.id is projectID
			#for t in project.tasks when t.id is taskID
			#	task.id = t.id
			#	t = task
			#	console.log task
			for task in project.tasks when task.id is taskID
				console.log null
		
	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
			project.deletedTasks.push ( task.id for task in project.tasks when task.id is taskID )[0]
			project.tasks = ( task for task in project.tasks when task.id isnt taskID )
		do factory.cache
		
	factory

console.log 'Services loaded'