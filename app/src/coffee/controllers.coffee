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
	
	$scope.syncProjects = -> 
		DB.syncProjects $scope.projects, ->
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

	$scope.syncProject = -> 
		DB.syncProject $scope.project, ->
			do Projects.cache
			do $scope.$apply
	
	$scope.createTask = ->
		Projects.createTask $scope.project.id, 
			name: $scope.task.name
			description: $scope.task.description
		$scope.task.name = ""
		

# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id


console.log 'Controllers loaded'