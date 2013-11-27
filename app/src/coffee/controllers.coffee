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

	$scope.edit_mode = false
	$scope.toggleEditMode = ->
		$scope.edit_mode = not $scope.edit_mode

	$scope.toggleCommentForm = ->
		$scope.comment.text = '' if $scope.comment != undefined
		$scope.opened = not $scope.opened
	
	$scope.createTask = ( task ) ->
		Projects.createTask $scope.project.id, 
			name: task.name
			status: task.status
			priority: task.priority
			start: task.start
			end: task.end
			tags: splitTags task.tags
			users: [] # task.users missing in view, should be an array
		task = ''

	$scope.openComments = ( task, id ) ->
		$scope.opened = true
		$scope.task = task
		Projects.createCommentsModule $scope.project.id, id


# Task Controller
# ------------------------------		
synappseApp.controller 'TaskCtrl', ( $scope, $routeParams, Projects ) ->
	$scope.taskEdit = angular.copy $scope.task
	$scope.taskEdit.tags = $scope.taskEdit.tags.join(', ')

	$scope.editTask = ->
		do $scope.toggleEditMode
		$scope.taskEdit.tags = splitTags $scope.taskEdit.tags
		Projects.editTask $scope.project.id, $scope.task.id, $scope.taskEdit

	$scope.deleteTask = ->
		Projects.deleteTask $scope.project.id, $scope.task.id, $scope.task


# Comment Controller
# ------------------------------		
synappseApp.controller 'CommentCtrl', ( $scope, $routeParams, Projects ) ->
	
	$scope.createComment = ( taskID, comment ) ->
		Projects.createComment $scope.project.id,
			author: 'tmp'
			taskID: taskID
			parentID: 0
			text: comment.text

	$scope.deleteComment = ( commentID ) ->
		Projects.deleteComment $scope.project.id, commentID, $scope.comment


console.log 'Controllers loaded'