# Dropbox authentification
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
		console.log folder
		$this = @
		@client.readFile folder+@file, ( error, data, stat ) ->
			if error and error.status is 404 # create project
				name = ( folder.substring $this.folder.length+1 ).replace /\/$/, ''
				project = 
					name: name
					id: generateID 2, localIDs, $this.user.uid+'_'
					folder: folder
					slug: slug name
					users: [$this.user]
					tasks: []
					deletedTasks: []
				$this.saveProject project, -> callback project
			else # restore project
				project = angular.fromJson data
				project.folder = folder
				callback project


	# Save project file
	saveProject: ( project, callback = false ) ->
		@client.writeFile project.folder+@file, ( angular.toJson project ), ( error, stat ) ->
			console.log error if error
			do callback if callback


	# process local projects which miss their Dropbox folder
	checkLocalProjects: ( local, folders, callback ) ->
		localIDs = ( p.id for p in local )
		for p in local when p.folder not in folders
			if p.id.length is 2 # create Dropbox folder from recently created local project
				p.id = generateID 2, localIDs, @user.uid+'_'
				p.users.push @user
				( task.id = generateID 3, ( t.id for t in p.tasks ) ) for task in p.tasks
				@saveProject p
			else # delete local project from recently removed Dropbox folder
				index = localIDs.indexOf p.id
				local.splice index, 1 if ~index
		do callback


	# Synchronize
	sync: ( local, callback ) ->
		return if not @client
		$this = @
		@readFolder @folder, ( children ) ->
			# get projects (children folders)
			projects = ( child for child in children when child.isFolder )
			waiting = projects.length
			return $this.checkLocalProjects local, [], callback if not waiting
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
					$this.checkLocalProjects local, ( c.path+'/' for c in projects ), ( -> 
						console.log "sync complete"
						do callback
					) if not waiting


	# Manage conflicts
	solveConflicts: ( local, distant ) ->
		local.folder = distant.folder

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

console.log 'Dropbox module loaded'