# Synappse
# ------------------------------
app = angular.module 'synappse', []



# Tasks controller
# ------------------------------
app.controller 'tasks', ( $scope ) ->
  $scope.tasks = ( JSON.parse localStorage['tasks'] ) || []
  
  $scope.save = ->
    localStorage['tasks'] = JSON.stringify $scope.tasks
    console.log $scope.tasks
  
  $scope.addTask = ->
    id = $scope.tasks[$scope.tasks.length-1].id+1 if $scope.tasks.length
    $scope.tasks.push
      id: id || 1
      name: $scope.taskName
    $scope.taskName = ''
    do $scope.save
  
 

# Task controller
# ------------------------------ 
app.controller 'task', ( $scope ) ->
  $scope.deleteTask = ->
    index = ( task.id for task in $scope.tasks ).indexOf $scope.task.id
    $scope.tasks.splice index, 1
    do $scope.save