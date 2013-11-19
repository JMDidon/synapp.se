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
	# $scope.task.status = 'Pending ...'

	$scope.edit_mode = false
	console.log $scope.edit_mode

	$scope.toggleEditMode = ->
		$scope.edit_mode = not $scope.edit_mode
	
	$scope.createTask = ->
		now = new Date().toLocaleString()
		tags = $scope.task.tags
		tags = tags.toString().split(',')
		
		Projects.createTask $scope.project.id, 
			name: $scope.task.name
			description: $scope.task.description
			status: $scope.task.status
			priority: $scope.task.priority
			dateBegin: $scope.task.dateBegin
			dateEnd: $scope.task.dateEnd
			dateCreation: now
			tags: tags
		$scope.task = ""



# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->

	$scope.editTask = ->
		do $scope.toggleEditMode
		console.log $scope.edit_mode
		Projects.editTask $scope.project.id, $scope.task.id

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id, $scope.task


console.log 'Controllers loaded'