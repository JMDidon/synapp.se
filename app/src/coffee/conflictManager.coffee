# Conflict manager module
# ------------------------------
synappseApp = angular.module 'synappseConflictManager', []


# Bypassed for the moment
# ------------------------------


# $scope.sync = ->
# 	# Load DB
# 	# Manage conflicts : local == distant (generate final IDs)
# 	# Save DB
# 	# Update local
# 	client.metadata Project.folder, ( error ) ->
# 		client.mkdir Project.folder if error and error.status is 404
# 		
# 	client.readFile Project.folder+'_app.json', ( error, data ) ->
# 		tasks = if data then ( JSON.parse data ).tasks else []
# 		distantIDs = ( task.id for task in tasks )
# 		localIDs = ( task.id for task in $scope.tasks )
# 	
# 		# Delete local items missing in distant
# 		$scope.tasks = ( task for task in $scope.tasks when task.id.length is 2 or task.id in distantIDs )
# 		
# 		# Add local items missing in distant
# 		( task.id = generateID 3, distantIDs ) for task in $scope.tasks when task.id.length is 2
# 		
# 		# Add distant items missing in local
# 		$scope.tasks.push task for task in tasks when task.id not in localIDs and task.id not in $scope.deletedTasks
# 		
# 		# Refresh scope
# 		$scope.deletedTasks = []
# 		do $scope.$apply
# 		do $scope.cache
# 		
# 		# Save file
# 		project = encodeProject Project.name, $scope.users, $scope.tasks
# 		client.writeFile Project.folder+'_app.json', project, ( error, stat ) ->
# 			console.log error if error

console.log 'Conflict manager loaded'