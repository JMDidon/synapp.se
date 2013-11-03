# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []


# Main controller
# ------------------------------
synappseApp.controller 'MainCtrl', ['$scope', 'Helpers'
	($scope, Helpers) ->
		cache = localStorage[Project.name] || Helpers.encodeProject Project.name, [], [] 
		project = Helpers.decodeProject cache 

		$scope.users = project.users
		client.getAccountInfo ( error, user ) ->
			$scope.users.push name: user.name, email: user.email if ( not $scope.users.length ) or user.name not in ( u.name for u in $scope.users )

		# $scope.users = project.users
		# client.getAccountInfo ( error, user ) ->
		# 	$scope.users.push name: user.name, email: user.email if user.name not in ( u.name for u in $scope.users )

		# names = ( u.name for u in $scope.users ) || []
		# $scope.users.push name: user.name, email: user.email if user.name not in names

		# $scope.users = project.users
		# $scope.users.push name: user.name, email: user.email if ( not $scope.users.length ) or user.name not in ( u.name for u in $scope.users )

		$scope.tasks = project.tasks
		$scope.deletedTasks = localStorage[Project.name+'_deletedTasks'] || []

		$scope.cache = () -> 
			localStorage[Project.name] = Helpers.encodeProject Project.name, $scope.users, $scope.tasks 
			localStorage[Project.name+'_deletedTasks'] = $scope.deletedTasks
]

# Task controller
# ------------------------------
synappseApp.controller 'TaskCtrl', ['$scope', 'TaskFactory', 'Helpers'
	($scope, TaskFactory, Helpers) ->
		$scope.addTask = ->
			# Generate local ID
			# Add local task
			# Save cache
			$scope.tasks.push
				id: Helpers.generateID 2, ( task.id for task in $scope.tasks )
				name: $scope.taskName
			$scope.taskName = ''
			do $scope.cache

		$scope.deleteTask = ->
			# Delete local task
			# Save cache
			$scope.deletedTasks.push $scope.task.id
			index = ( task.id for task in $scope.tasks ).indexOf $scope.task.id
			$scope.tasks.splice index, 1
			do $scope.cache




		# Conflict manager (to be moved to the dedicated module)
		# ------------------------------

		$scope.sync = ->
			# Load DB
			# Manage conflicts : local == distant (generate final IDs)
			# Save DB
			# Update local
			client.metadata Project.folder, ( error ) ->
				client.mkdir Project.folder if error and error.status is 404
				
			client.readFile Project.folder+'_app.json', ( error, data ) ->
				tasks = if data then ( JSON.parse data ).tasks else []
				distantIDs = ( task.id for task in tasks )
				localIDs = ( task.id for task in $scope.tasks )
			
				# Delete local items missing in distant
				$scope.tasks = ( task for task in $scope.tasks when task.id.length is 2 or task.id in distantIDs )
				
				# Add local items missing in distant
				( task.id = Helpers.generateID 3, distantIDs  ) for task in $scope.tasks when task.id.length is 2
				
				# Add distant items missing in local
				$scope.tasks.push task for task in tasks when task.id not in localIDs and task.id not in $scope.deletedTasks
				
				# Refresh scope
				$scope.deletedTasks = []
				do $scope.$apply
				do $scope.cache
				
				# Save file
				project = Helpers.encodeProject Project.name, $scope.users, $scope.tasks 
				client.writeFile Project.folder+'_app.json', project, ( error, stat ) ->
					console.log error if error

		$scope.cache = () -> 
			localStorage[Project.name] = Helpers.encodeProject Project.name, $scope.users, $scope.tasks 
			localStorage[Project.name+'_deletedTasks'] = $scope.deletedTasks
]

# User controller
# ------------------------------
synappseApp.controller 'UserCtrl', ['$scope', 'UserFactory', 'Helpers'
	($scope, UserFactory, Helpers) ->
		# Add users
		$scope.users = project.users
]

console.log 'Controllers loaded'