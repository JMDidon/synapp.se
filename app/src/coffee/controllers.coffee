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
		localStorage['projects'] = [] # reinitialize cache
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
	$scope.newTask = {}
	$scope.newComment = {}
	$scope.selectedTask = {}

	#$scope.edit_mode = false
	#$scope.toggleEditMode = ->
	#	$scope.edit_mode = not $scope.edit_mode

	$scope.toggleCommentForm = ->
		$scope.comment.text = '' if $scope.comment != undefined
		$scope.opened = not $scope.opened
	
	$scope.createTask = ->
		Projects.createTask $scope.project.id, 
			name: $scope.newTask.name
			author: 0
			status: $scope.newTask.status
			priority: $scope.newTask.priority
			start: $scope.newTask.start
			end: $scope.newTask.end
			tags: splitTags $scope.newTask.tags
			users: $scope.newTask.users
		$scope.newTask = {}

	$scope.openComments = ( task ) ->
		$scope.opened = true
		$scope.selectedTask = task
		Projects.createCommentsModule $scope.project.id, task.id


# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.taskEdit = angular.copy $scope.task
	$scope.taskEdit.tags = $scope.taskEdit.tags.join(', ')
	$scope.edit_mode = false

	$scope.toggleEditMode = -> 
		$scope.edit_mode = not $scope.edit_mode

	$scope.editTask = ->
		# do $scope.toggleEditMode
		$scope.edit_mode = not $scope.edit_mode
		$scope.taskEdit.tags = splitTags $scope.taskEdit.tags
		Projects.editTask $scope.project.id, $scope.task.id, $scope.taskEdit

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id
		
	$scope.openCommentsFromTask = ->
		$scope.openComments $scope.task


# Comment Controller
# ------------------------------		
synappseApp.controller 'CommentCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.createComment = ->
		Projects.createComment $scope.project.id,
			author: 0
			taskID: $scope.selectedTask.id
			parentID: 0
			text: $scope.newComment.text
		$scope.newComment = {}
		do $scope.toggleCommentForm

	$scope.deleteComment = ->
		Projects.deleteComment $scope.project.id, $scope.comment.id
		


console.log 'Controllers loaded'