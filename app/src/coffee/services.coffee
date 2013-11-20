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
			task.id = generateID 2, ( t.id for t in project.tasks )
			project.tasks.push task
		do factory.cache

	factory.editTask = ( projectID, oldTask, newTask ) ->
		# Get the project
		for project in Projects when project.id is projectID
			# Get the tasks
			for t in project.tasks when t.id is oldTask.id
				t = newTask
				# Delete the old task, then we save the edited one
				project.tasks = ( task for task in project.tasks when task.id isnt oldTask.id )
				console.log newTask
				project.tasks.push newTask
		# Save changes
		do factory.cache
		
	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
			project.deletedTasks.push ( task.id for task in project.tasks when task.id is taskID )[0]
			project.tasks = ( task for task in project.tasks when task.id isnt taskID )
		do factory.cache
		
	factory

console.log 'Services loaded'