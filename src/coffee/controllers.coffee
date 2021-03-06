# Controllers module
# ------------------------------
synappseApp = angular.module 'synappseControllers', []



# Main Controller
# ------------------------------
synappseApp.controller 'MainCtrl', ['$translate', '$scope', 'Projects', ( $translate, $scope, Projects ) ->
	$scope.about = false
	$scope.timeout = false
	$scope.synced = false
	$scope.projects = do Projects.getProjects
	$scope.me = {}
	
	# translations
	$scope.lang = do $translate.uses
	$scope.changeLanguage = ( lang ) -> 
		$translate.uses lang
		$scope.lang = lang
		localStorage['lang'] = lang
	$scope.changeLanguage localStorage['lang'] if localStorage['lang']

	# sync
	$scope.login = -> 
		$scope.me = DB.user
		do $scope.$apply

	$scope.sync = ->
		DB.sync $scope.projects, ->
			do Projects.cache
			do $scope.$apply if not $scope.$$phase
			clearTimeout $scope.timeout
			$scope.synced = true
			do $scope.$apply if not $scope.$$phase
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
		
	$scope.share = ( id ) ->
		project = Projects.readProject id
		DB.getShareUrl project.folder, ( url ) ->
			window.open url, '_blank'
]


# Project Controller
# ------------------------------	
synappseApp.controller 'ProjectCtrl', ['$scope', '$routeParams', '$filter', 'Projects', ( $scope, $routeParams, $filter, Projects ) ->
	$scope.project = Projects.findProject $routeParams.project
	$scope.project.alerts = [] if not $scope.project.alerts?
	$scope.now = getCleanDate()
	$scope.statuses = ['TODO', 'IN_PROGRESS', 'ADVANCED', 'DONE', 'ARCHIVED']
	
	# tabs
	$scope.tabs = ['TAB_DUES', 'TAB_OTHERS', 'TAB_ARCHIVED']
	$scope.currentTab = 0
	$scope.changeTab = ( tab ) -> $scope.currentTab = tab
	
	# autosync
	$scope.$watch 'project', $scope.schedule, true
		
	# add task
	$scope.task = {}
	$scope.emptyTask = ->
		$scope.task = {}
		
	# Delete task
	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id
		
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