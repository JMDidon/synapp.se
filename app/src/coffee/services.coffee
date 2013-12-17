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
		# Check if project exist
		projectExist = false
		projectTestName = name.toLowerCase()

		for project in Projects when project.name is projectTestName
			projectExist = true

		if projectExist == true
			console.log 'Project already exists !' 
			return
		else
			id = generateID 2, ( project.id for project in Projects )
			console.log 'Creating task with id : ', id
			Projects.push
				name: name
				id: id
				folder: DB.folder+( slug name )+'/'
				slug: slug name
				users: []
				tasks: []
				deletedTasks: []
				comments: []
				deletedComments: []
			do factory.cache
	
	factory.readProject = ( id ) -> 
		( project for project in Projects when project.id is id )[0] || {}
		
	factory.findProject = ( slug ) -> 
		( project for project in Projects when project.slug is slug )[0] || {}

	# USERS
	factory.getUserByUID = ( projectID, uid ) ->
		for project in Projects when project.id is projectID
			for user in project when user.uid is uid
				return user
		
	# TASKS
	factory.createTask = ( projectID, task ) ->
		for project in Projects when project.id is projectID
			task.id 	= generateID 2, ( t.id for t in project.tasks )
			task.date 	= ( new Date ).getTime()
			task.edit 	= ( new Date ).getTime()
			project.tasks.push task
		do factory.cache

	factory.editTask = ( projectID, taskID, values ) ->
		# Get the project
		for project in Projects when project.id is projectID
			# Get the task
			for task in project.tasks when task.id is taskID
				values.edit = ( new Date ).getTime()
				task[k] = v for k, v of values when k not in ['id', 'date']
		# Save changes
		do factory.cache
		
	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
			project.deletedTasks.push taskID if taskID not in project.deletedTasks
			project.tasks = angular.copy ( task for task in project.tasks when task.id not in project.deletedTasks )
		do factory.cache
	

	# DISCUSSIONS
	factory.createComment = ( projectID, comment ) ->
		console.log projectID, comment
		for project in Projects when project.id is projectID
			comment.id = generateID 2, ( c.id for c in project.comments )
			comment.date = ( new Date ).getTime()
			comment.edit = ( new Date ).getTime()
			project.comments.push comment
		do factory.cache

	factory.deleteComment = ( projectID, commentID ) ->
		for project in Projects when project.id is projectID
			project.deletedComments.push commentID if commentID not in project.deletedComments
			project.comments = angular.copy ( comment for comment in project.comments when comment.id not in project.deletedComments )
		do factory.cache


	factory

console.log 'Services loaded'