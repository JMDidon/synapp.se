# Dropbox auth & sync
# ------------------------------
css = ( href ) ->
	link = document.createElement 'link'
	link.type = 'text/css'
	link.rel = 'stylesheet'
	link.href = href
	document.head.appendChild link
	
async = ( src, callback = false ) ->
	script = document.createElement 'script'
	script.src = src
	script.addEventListener 'load', ( e ) -> callback null, e if callback
	document.body.appendChild script


DB = 
	folder: 'Synappse/'
	file: '_project.json'
	user: {}
	client: new Dropbox.Client key: 'd1y1wxe9ow97xx0'


	# Authenticate to Dropbox account
	# ---
	checkAuth: ->
		$this = @
		@client.authenticate { interactive: false }, ( error, client ) -> 
			console.log error if error
			do $this.init if client.isAuthenticated()
			
	auth: ->
		$this = @
		@client.authenticate ( error, client ) -> 
			console.log error if error
			do $this.init if client.isAuthenticated()
		
		
	# Initialize app
	# ---
	init: ->
		$this = @
		@client.getAccountInfo ( error, info ) ->
			$this.user = name: info.name, email: info.email, uid: info.uid
		
		css 'public/app.css'
		async '//ajax.googleapis.com/ajax/libs/angularjs/1.2.9/angular.min.js', ->
			async '//ajax.googleapis.com/ajax/libs/angularjs/1.2.9/angular-route.min.js', ->
				async 'public/app.js', ->
					angular.element(document).ready -> angular.bootstrap document, ['synappseApp']

	# Check if Synappse folder exists, else create it
	# ---
	readFolder: ( folder, callback ) ->
		$this = @
		@client.readdir folder, ( error, children, stat, childrenStat ) ->
			if error
				$this.client.mkdir folder, ( error, stat ) ->
					console.log error if error
					callback []
			else callback childrenStat


	# Check if project file exists or create it
	# ---
	checkProject: ( folder, localIDs, callback ) ->
		$this = @
		@client.readFile folder+@file, ( error, data, stat ) ->
			if error and error.status is 404 # create project
				name = ( folder.substring $this.folder.length+1 ).replace /\/$/, ''
				project = 
					name: name
					id: generateID 3, localIDs, $this.user.uid+'_'
					folder: folder
					slug: slug name
					users: [$this.user]
					alerts: []
					tasks: []
					deletedTasks: []
					comments: []
					deletedComments: []
				$this.saveProject project, -> callback project
			else # restore project
				project = angular.fromJson decodeURIComponent escape data
				project.folder = folder
				callback project


	# Save project file
	# ---
	saveProject: ( project, callback = false ) ->
		@client.writeFile project.folder+@file, ( unescape encodeURIComponent angular.toJson project ), ( error, stat ) ->
			console.log error if error
			do callback if callback


	# Process local projects which miss their Dropbox folder
	# ---
	checkLocalProjects: ( local, folders, callback ) ->
		localIDs = ( p.id for p in local )
		for p in local when p.folder not in folders
			if p.id.length is 2 # create Dropbox folder from recently created local project
				p.id = generateID 3, localIDs, @user.uid+'_'
				p.users.push @user
				( task.id = generateID 3, ( t.id for t in p.tasks ) ) for task in p.tasks
				@saveProject p
			else # delete local project from recently removed Dropbox folder
				index = localIDs.indexOf p.id
				local.splice index, 1 if ~index
		do callback


	# Synchronize
	# ---
	sync: ( local, callback ) ->
		return do callback if not @client
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
						$this.updateProject localProject, data

					# when all DB folders are sync
					if not waiting
						$this.checkLocalProjects local, ( c.path+'/' for c in projects ), -> 
							console.log "sync complete"
							do callback


	# Update project
	# ---
	updateProject: ( local, distant ) ->
		local.folder = distant.folder

		# users
		local.users = ( u for u in distant.users )
		if @user.uid in ( u.uid for u in local.users )
			( u = @user for u in local.users when u.uid is @user.uid )
		else local.users.push @user

		# tasks & comments
		local.tasks = @solveConflicts local.tasks, distant.tasks, local.deletedTasks
		local.comments = @solveConflicts local.comments, distant.comments, local.deletedComments
		local.deletedTasks = []
		local.deletedComments = []

		# update comments taskIDs
		( comment.taskID = task.id for task in local.tasks when task.oldID is comment.taskID ) for comment in local.comments
		delete task.oldID for task in local.tasks
		# update replies parentIDs
		# ( reply.parentID = comment.id for comment in local.comments when comment.oldID is reply.parentID ) for reply in local.comments 
		# delete comment.oldID for comment in local.comments

		# update alerts
		# local.alerts.push distantAlert for distantAlert in distant.alerts when distantAlert.id not in ( a.id for a in local.alerts )
		# local.alerts = angular.copy ( localAlert for localAlert in local.alerts when localAlert.seen.length < local.users.length )

		# save file
		@saveProject local



	# Solve conflicts (add, edit, delete)
	# ---
	solveConflicts: ( localItems, distantItems, deletedItems ) ->	
		distantIDs = ( item.id for item in distantItems )

		# delete local items missing in distant
		localItems = angular.copy ( item for item, i in localItems when item.id.length is 2 or item.id in distantIDs )

		# add local items missing in distant
		for item in localItems when item.id.length is 2
			item.oldID = item.id
			item.author = DB.user.uid
			item.id = generateID 3, distantIDs

		# edit local items from distant
		for localItem in localItems when localItem.id.length is 3 and localItem.id in distantIDs
			for distantItem in distantItems when localItem.id is distantItem.id
				( localItem[k] = v for k, v of distantItem ) if localItem.edit <= distantItem.edit

		# return distant items missing in local
		localIDs = ( item.id for item in localItems )
		localItems.push item for item in distantItems when item.id not in localIDs and item.id not in deletedItems
		localItems



# Check auth & bind button
# ------------------------------
do -> 
	do DB.checkAuth
	( document.getElementById 'dbauth' ).addEventListener 'click', -> do DB.auth