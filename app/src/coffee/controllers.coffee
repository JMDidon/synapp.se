# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []


# Main Controller
# ------------------------------
synappseApp.controller 'MainCtrl', ( $scope, Projects ) ->
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


# Project Controller
# ------------------------------	
synappseApp.controller 'ProjectCtrl', ( $scope, $routeParams, Projects ) ->
	
	$scope.project = Projects.readProject $routeParams.params

	$scope.edit_mode = false
	$scope.toggleEditMode = ->
		$scope.edit_mode = not $scope.edit_mode
	
	$scope.createTask = ->
		Projects.createTask $scope.project.id, 
			name: $scope.task.name
			status: $scope.task.status
			priority: $scope.task.priority
			start: $scope.task.start
			end: $scope.task.end
			tags: splitTags $scope.task.tags
		$scope.task = ""
		# creation date is the role of the Factory, because de user doesn't see/use it (it's only for the system to work)
		
	# $scope.users = $scope.project.users


# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.taskEdit = angular.copy $scope.task
	$scope.taskEdit.tags = $scope.taskEdit.tags.join(', ')

	$scope.editTask = ->
		do $scope.toggleEditMode
		$scope.taskEdit.tags = splitTags $scope.taskEdit.tags
		# edition date is the role of the Factory, because de user doesn't see/use it (it's only for the system to work)
		Projects.editTask $scope.project.id, $scope.task.id, $scope.taskEdit

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id, $scope.task


console.log 'Controllers loaded'