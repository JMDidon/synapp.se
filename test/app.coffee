# Helpers
# ------------------------------
generateID = ( n, list, prefix = '' ) -> ( k = prefix+Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()
slug = ( str ) ->
	[from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
	( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
	str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")



# Dropbox
# ------------------------------
DB = 
	key: '8437zcdkz4nvggb'
	folder: 'Synappse/'
	file: '_project.json'
	user: {}
	projects: []
	client: {}


	# Authenticate to Dropbox account
	auth: ( callback ) ->
		$this = @
		@client = new Dropbox.Client key:@key
		@client.authenticate ( error, client ) -> 
			console.log error if error
			$this.client.getAccountInfo ( error, info ) ->
				$this.user = name: info.name, email: info.email, uid: info.uid
				do callback


	# Check if Synappse folder exists, else create it
	readFolder: ( folder, callback ) ->
		$this = @
		@client.readdir folder, ( error, children, stat, childrenStat ) ->
			if error
				$this.client.mkdir folder, ( error, stat ) ->
					console.log error if error
					callback []
			else callback childrenStat
			

	# Check if project file exists or create it
	checkProject: ( folder, localIDs, callback ) ->
		$this = @
		$this.client.readFile folder+$this.file, ( error, data, stat ) ->
			if error and error.status is 404 # create project
				name = ( folder.substring $this.folder.length+1 ).replace /\/$/, ''
				$this.saveProject project, -> callback 
					name: name
					id: generateID 2, localIDs, $this.user.uid+'_'
					folder: folder
					slug: slug name
					users: [$this.user]
					tasks: []
					deletedTasks: []
			else # restore project
				project = angular.fromJson data
				project.folder = folder
				callback project
				
				
	# Save project file
	saveProject: ( project, callback = false ) ->
		@client.writeFile project.folder+@file, ( angular.toJson project ), ( error, stat ) ->
			console.log error if error
			do callback if callback


	# Synchronize
	sync: ( local, callback ) ->
		return if not @client
		$this = @
		$this.readFolder $this.folder, ( children ) ->
			# get projects (children folders)
			projects = ( child for child in children when child.isFolder )
			waiting = projects.length
			localIDs = ( p.id for p in local )
			for project in projects
				# check project file
				$this.checkProject project.path+'/', localIDs, ( data ) ->
					waiting--

					# solve conflicts
					if data.id not in localIDs then local.push data else
						localProject = ( p for p in local when p.id is data.id )[0]
						$this.solveConflicts localProject, data

					# when all DB folders are sync
					if not waiting
						localIDs = ( p.id for p in local )
						
						# process local projects which miss their Dropbox folder
						for p in local when p.folder not in ( c.path+'/' for c in projects )
							if p.id.length is 2 # create Dropbox folder from recently created local project
								p.id = generateID 2, localIDs, $this.user.uid+'_'
								p.users.push $this.user
								( task.id = generateID 3, ( t.id for t in p.tasks ) ) for task in p.tasks
								$this.saveProject p
							else # delete local project from recently removed Dropbox folder
								index = localIDs.indexOf p.id
								local.splice index, 1 if ~index
						do callback



	# Manage conflicts
	solveConflicts: ( local, distant ) ->
		# USERS
		local.users = ( u for u in distant.users )
		if @user.uid in ( u.uid for u in local.users )
			( u = @user for u in local.users when u.uid = @user.uid )
		else local.users.push @user

		# TASKS
		distantIDs = ( task.id for task in distant.tasks )
		localIDs = ( task.id for task in local.tasks )

		# delete local items missing in distant
		local.tasks = ( task for task in local.tasks when task.id.length is 2 or task.id in distantIDs )

		# add local items missing in distant
		( task.id = generateID 3, distantIDs ) for task in local.tasks when task.id.length is 2

		# add distant items missing in local
		local.tasks.push task for task in distant.tasks when task.id not in localIDs and task.id not in local.deletedTasks
		local.deletedTasks = []

		# save file
		@saveProject local


# Synappse
# ------------------------------
app = angular.module 'synappse', []


# Projects factory
# ------------------------------
# localStorage['projects'] = [] # reinitialize cache
app.factory 'Projects', ->
	Projects = if localStorage['projects'] then ( angular.fromJson localStorage['projects'] ) else []
	factory = {}
	factory.cache = -> localStorage['projects'] = angular.toJson Projects
	factory.getProjects = -> Projects


	# PROJECTS
	factory.createProject = ( name ) ->
		id = generateID 2, ( project.id for project in Projects )
		# gérer les conflits de nom de répertoire
		Projects.push
			name: name
			id: id
			folder: DB.folder+( slug name )+'/'
			slug: slug name
			users: []
			tasks: []
			deletedTasks: []
		do factory.cache

	factory.readProject = ( id ) -> ( project for project in Projects when project.id is id )[0]


	# TASKS
	factory.createTask = ( projectID, taskName ) ->
		for project in Projects when project.id is projectID
			project.tasks.push
				name: taskName
				id: generateID 2, ( task.id for task in project.tasks )
		do factory.cache

	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
			project.deletedTasks.push ( task.id for task in project.tasks when task.id is taskID )[0]
			project.tasks = ( task for task in project.tasks when task.id isnt taskID )
		do factory.cache

	factory


# Controllers
# ------------------------------
app.controller 'main', ( $scope, Projects ) ->
	$scope.projects = do Projects.getProjects
	$scope.auth = false

	$scope.login = -> 
		$scope.auth = true
		do $scope.$apply

	DB.auth $scope.login

	$scope.sync = -> 
		DB.sync $scope.projects, ->
			do Projects.cache
			do $scope.$apply

	$scope.createProject = ->
		Projects.createProject $scope.projectName
		$scope.projectName = ""
		$scope.projectFolder = ""


app.controller 'project', ( $scope, Projects ) ->	
	$scope.createTask = ->
		Projects.createTask $scope.project.id, $scope.taskName
		$scope.taskName = ""


app.controller 'task', ( $scope, Projects ) ->
	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id

