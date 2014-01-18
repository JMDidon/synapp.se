# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []


# Main Controller
# ------------------------------
synappseApp.controller 'MainCtrl', ['$scope', 'Projects', ( $scope, Projects ) ->
	$scope.projects = do Projects.getProjects
	$scope.me = {}

	$scope.login = -> 
		$scope.me = DB.user
		do $scope.$apply

	$scope.sync = -> 
		localStorage['projects'] = [] # Reinitialize cache
		DB.sync $scope.projects, ->
			do Projects.cache
			do $scope.$apply

	$scope.createProject = ->
		Projects.createProject $scope.projectName
		$scope.projectName = ""
		$scope.projectFolder = ""
]


# Home Controller
# ------------------------------
synappseApp.controller 'HomeCtrl', ['$scope', 'Projects', ( $scope, Projects ) ->
	$scope.createProject = ->
		Projects.createProject $scope.name
]


# Project Controller
# ------------------------------	
synappseApp.controller 'ProjectCtrl', ['$scope', '$routeParams', '$location', 'Projects', ( $scope, $routeParams, $location, Projects ) ->
	$scope.project = Projects.findProject $routeParams.project
	$scope.now = getCleanDate()
	
	# $location.path '/home' if not $scope.project
	$scope.project.alerts = [] if not $scope.project.alerts?
	$scope.statuses = [
		{ k:0, v:'Todo' },
		{ k:1, v:'In progress' },
		{ k:2, v:'Advanced' },
		{ k:3, v:'Done' },
		{ k:4, v:'Archived' }
	]

	$scope.$watch 'selectProject', ->
		$location.path '/'+$scope.selectProject
		
	# add task
	$scope.task = {}
	$scope.emptyTask = ->
		$scope.task = {}
		
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
]


# Comment Controller
# ------------------------------		
synappseApp.controller 'CommentCtrl', ['$scope', '$routeParams', 'Projects', ( $scope, $routeParams, Projects ) ->
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
]