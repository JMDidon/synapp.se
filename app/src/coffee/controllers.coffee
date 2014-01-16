# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []


# Main Controller
# ------------------------------
synappseApp.controller 'MainCtrl', ( $scope, Projects ) ->
	$scope.projects = do Projects.getProjects
	$scope.auth = false
	$scope.me = {}

	$scope.login = -> 
		$scope.auth = true
		$scope.me = DB.me
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
	# $location.path '/home' if not $scope.project
	$scope.project.alerts = [] if not $scope.project.alerts?
	$scope.task = {}
	$scope.statuses = [
		{ k:0, v:'Todo' },
		{ k:1, v:'In progress' },
		{ k:2, v:'Advanced' },
		{ k:3, v:'Done' },
		{ k:4, v:'Archived' }
	]

	$scope.$watch 'selectProject', ->
		$location.path '/'+$scope.selectProject
		
	# edit mode
	$scope.taskOpen = false
	$scope.editMode = false
	$scope.$watch 'taskOpen', -> $scope.editMode = $scope.taskOpen is 0
	$scope.toggleForm = -> $scope.setTaskOpen 0
	$scope.setTaskOpen = ( taskID ) -> $scope.taskOpen = if taskID is $scope.taskOpen then false else taskID
	
	window.addEventListener 'keydown', ( e ) ->
		if e.which is 27
			$scope.setTaskOpen false
			do $scope.$apply

	# alerts
	# $scope.alert = ( text ) ->
	# 	Projects.alert $scope.project.id, text, DB.user.uid
	# 	console.log $scope.project.alerts
	# 
	# $scope.seen = ( alertID ) ->
	# 	Projects.seen $scope.project.id, alertID, DB.user.uid



# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	# edit mode
	$scope.editMode = false
	$scope.$watch 'taskOpen', -> $scope.editMode = $scope.taskOpen is $scope.task.id
	$scope.toggleForm = -> $scope.setTaskOpen $scope.task.id
		
	# statuses
	$scope.$watch 'task.status', ->
		Projects.editTask $scope.project.id, $scope.task.id, $scope.task	

	# delete
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