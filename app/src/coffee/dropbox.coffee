# Dropbox authentification
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
						localIDs = ( p.id for p in local )
						project = if data then JSON.parse data else 

						if error and error.status is 404
							# create project even if _app.json is missing
							folder = ( decodeURI error.url ).replace /^.+\/([^\/]+)\/_app\.json(?:\?.+)?$/, '$1'
							console.log $this.folder+folder+'/'
							project =
								name: folder
								id: generateID 2, localIDs
								folder: $this.folder+folder+'/'
								users: []
								tasks: []
						else
							# get project and update folder
							project = JSON.parse data
							project.folder = stat.path.replace stat.name, ''

						# add projects to local from Dropbox
						local.push project if project.id not in localIDs
						projects.push project.id

						if not waiting
							# delete form local unexisting projects on Dropbox
							for removed in ( p.id for p in local when p.id not in projects )
								index = ( p.id for p in local ).indexOf removed
								local.splice index, 1 if index > -1
							do callback


	# synchronize project
	syncProject: ( local, callback ) ->
		$this = @
		@client.stat local.folder, ( error, stats ) ->
			$this.checkFolder local.folder, ->
				$this.client.readFile local.folder+'_app.json', ( error, data, stat ) ->
					console.log error if error
					tasks = if data then ( JSON.parse data ).tasks else []
					distantIDs = ( task.id for task in tasks )
					localIDs = ( task.id for task in local.tasks )

					# Delete local items missing in distant
					local.tasks = ( task for task in local.tasks when task.id.length is 2 or task.id in distantIDs )

					# Add local items missing in distant
					( task.id = generateID 3, distantIDs ) for task in local.tasks when task.id.length is 2

					# Add distant items missing in local
					local.tasks.push task for task in tasks when task.id not in localIDs and task.id not in local.deletedTasks
					local.deletedTasks = []

					# Save file
					$this.client.writeFile local.folder+'_app.json', ( angular.toJson local ), ( error, stat ) ->
						console.log error if error
						do callback

console.log 'Dropbox module loaded'