# Helpers
# ------------------------------
generateID = ( n, list ) -> ( k = Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()
slug = ( str ) ->
	[from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
	( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
	str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")
	
	

# Dropbox
# ------------------------------
DB = 
	key: '8437zcdkz4nvggb'
	folder: 'Synappse/'
	client: {}
	
	# authenticate to Dropbox account
	auth: ( callback ) ->
		$this = @
		@client = new Dropbox.Client key:@key
		@client.authenticate ( error, client ) -> 
			console.log error if error
			$this.checkFolder $this.folder, callback
		
	# check if Synappse folder exists, else create it
	checkFolder: ( folder, callback ) ->
		$this = @
		@client.stat folder, ( error, stats ) ->
			if error
				$this.client.mkdir folder, ( error, stats ) ->
					console.log error if error
					do callback
			else do callback
			
	# synchronize folders
	syncProjects: ( local, callback ) ->
		$this = @
		@checkFolder @folder, ->
			$this.client.readdir $this.folder, ( error, children ) ->
				waiting = children.length
				projects = []
				for child in children
					$this.client.readFile $this.folder+child+'/'+'_app.json', ( error, data, stat ) ->
						waiting--
						return false if error
						project = JSON.parse data
						project.folder = stat.path.replace '_app.json', ''
						local.push project if project.id not in ( p.id for p in local )
						projects.push project.id
						if not waiting
							for removed in ( p.id for p in local when p.id not in projects )
								index = ( p.id for p in local ).indexOf removed
								local.splice index, 1 if index > -1
							do callback
						
		
	# synchronize project
	syncProject: ( local, callback ) ->
		$this = @
		@client.stat local.folder, ( error, stats ) ->
			$this.checkFolder local.folder, ->
				$this.client.writeFile local.folder+'_app.json', ( angular.toJson local ), ( error, stat ) ->
					console.log error if error
					do callback



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
		Projects.push
			name: name
			id: id
			folder: DB.folder+( slug name )+'/'
			users: []
			tasks: []
		do factory.cache
		
		
	# TASKS
	factory.createTask = ( projectID, taskName ) ->
		for project in Projects when project.id is projectID
			project.tasks.push
				name: taskName
				id: generateID 2, ( task.id for task in project.tasks )
		do factory.cache
		
	factory.deleteTask = ( projectID, taskID ) ->
		for project in Projects when project.id is projectID
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
	
	$scope.syncProjects = -> 
		DB.syncProjects $scope.projects, ->
			do Projects.cache
			do $scope.$apply
	
	$scope.createProject = ->
		Projects.createProject $scope.projectName
		$scope.projectName = ""
		$scope.projectFolder = ""
		
		
app.controller 'project', ( $scope, Projects ) ->
	$scope.syncProject = -> 
		DB.syncProject $scope.project, ->
			do Projects.cache
			do $scope.$apply
	
	$scope.createTask = ->
		Projects.createTask $scope.project.id, $scope.taskName
		$scope.taskName = ""
		
	$scope.deleteProject = ->
		Projects.deleteProject $scope.project.id
		
		
app.controller 'task', ( $scope, Projects ) ->
	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id
		
				