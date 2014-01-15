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
		$scope.connectedUser = DB.user.name
		do $scope.$apply

	DB.auth $scope.login

	$scope.sync = -> 
		localStorage['projects'] = [] # Reinitialize cache
		DB.sync $scope.projects, ->
			do Projects.cache
			do $scope.$apply

	$scope.createProject = ->
		Projects.createProject $scope.projectName
		$scope.projectName = ""
		$scope.projectFolder = ""


# Home Controller
# ------------------------------
synappseApp.controller 'HomeCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.createProject = ->
		Projects.createProject $scope.name


# Project Controller
# ------------------------------	
synappseApp.controller 'ProjectCtrl', ( $scope, $routeParams, $location, Projects ) ->
	$scope.project = Projects.findProject $routeParams.project
	$scope.project.alerts = [] if not $scope.project.alerts?
	$scope.task = {}
	$scope.taskEditMode = false

	$scope.$watch 'selectProject', ->
		$location.path '/'+$scope.selectProject
		
	$scope.setTaskEditMode = ( taskID ) -> 
		$scope.taskEditMode = if taskID is $scope.taskEditMode then false else taskID

	# $scope.alert = ( text ) ->
	# 	Projects.alert $scope.project.id, text, DB.user.uid
	# 	console.log $scope.project.alerts
	# 
	# $scope.seen = ( alertID ) ->
	# 	Projects.seen $scope.project.id, alertID, DB.user.uid



# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.taskEdit = angular.copy $scope.task
	$scope.editMode = false
	
	$scope.$watch 'taskEditMode', ->
		$scope.editMode = $scope.taskEditMode is $scope.task.id
	
	$scope.toggleEditMode = -> 
		$scope.setTaskEditMode $scope.task.id

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id


# Comment Controller
# ------------------------------		
synappseApp.controller 'CommentCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.createComment = ->
		Projects.createComment $scope.project.id,
			author: DB.user.uid
			taskID: $scope.selectedTask.id
			parentID: 0
			text: $scope.newComment.text
		$scope.newComment = {}
		do $scope.toggleCommentForm

	$scope.deleteComment = ->
		Projects.deleteComment $scope.project.id, $scope.comment.id



console.log 'Controllers loaded'