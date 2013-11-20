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
		now  = new Date().toLocaleString()
		tags = splitTags $scope.task.tags
		
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
		
	# $scope.users = $scope.project.users


# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.taskEdit = angular.copy $scope.task

	$scope.editTask = ->
		do $scope.toggleEditMode
		$scope.taskEdit.tags = splitTags $scope.taskEdit.tags
		$scope.taskEdit.dateEdit = new Date().toLocaleString()
		Projects.editTask $scope.project.id, $scope.task, $scope.taskEdit

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id, $scope.task


console.log 'Controllers loaded'