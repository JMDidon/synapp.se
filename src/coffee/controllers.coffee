# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []



# Main Controller
# ------------------------------
synappseApp.controller 'MainCtrl', ['$scope', 'Projects', ( $scope, Projects ) ->
	$scope.about = false
	$scope.timeout = false
	$scope.synced = false
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
			clearTimeout $scope.timeout
			$scope.synced = true
			do $scope.$apply
	do $scope.sync
	
	$scope.schedule = ->
		$scope.synced = false
		clearTimeout $scope.timeout if $scope.timeout
		$scope.timeout = setTimeout $scope.sync, 20*1000
]


# Home Controller
# ------------------------------
synappseApp.controller 'HomeCtrl', ['$scope', '$location', 'Projects', ( $scope, $location, Projects ) ->
	$scope.createProject = ->
		slug = Projects.createProject $scope.projectName
		$scope.projectName = ""
		$location.path '/'+slug
]


# Project Controller
# ------------------------------	
synappseApp.controller 'ProjectCtrl', ['$scope', '$routeParams', '$filter', 'Projects', ( $scope, $routeParams, $filter, Projects ) ->
	$scope.project = Projects.findProject $routeParams.project
	$scope.now = getCleanDate()
	
	# tabs
	$scope.tabs = ['Due', 'Others', 'Archived']
	$scope.currentTab = 0
	$scope.changeTab = ( tab ) -> $scope.currentTab = tab
	
	# autosync
	$scope.$watch 'project', $scope.schedule, true
	
	
	# $location.path '/home' if not $scope.project
	$scope.project.alerts = [] if not $scope.project.alerts?
	$scope.statuses = [
		{ k:0, v:'Todo' },
		{ k:1, v:'In progress' },
		{ k:2, v:'Advanced' },
		{ k:3, v:'Done' },
		{ k:4, v:'Archived' }
	]
		
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
		else if e.which >= 65 and e.which <= 90 and $scope.taskOpen is false
			$scope.setTaskOpen 0
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