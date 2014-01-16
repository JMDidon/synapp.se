# Directives module
# ------------------------------
synappseApp = angular.module 'synappseDirectives', []

synappseApp.directive 'taskForm', ['Projects', ( Projects ) ->
  templateUrl: 'views/taskForm.html'
  scope: true
  link: ( scope ) ->
    scope.tmpTask = angular.copy scope.task
    scope.cancel = ->
      scope.tmpTask = angular.copy scope.task
      do scope.toggleEditMode
    scope.submit = ->
      return false if scope.tmpTask.name.match /^\s*$/
      if scope.task.id?
        do scope.toggleEditMode
        Projects.editTask scope.project.id, scope.task.id, scope.tmpTask
      else
        Projects.createTask scope.project.id, 
          name: scope.tmpTask.name
          author: DB.user.uid
          status: 0
          priority: scope.tmpTask.priority
          due: scope.tmpTask.due
          users: scope.tmpTask.users
        scope.tmpTask = {}
    scope.toggleUser = ( uid ) ->
      index = scope.tmpTask.users.indexOf uid
      if index > -1 then scope.tmpTask.users.splice index, 1 else scope.tmpTask.users.push uid 
]
      
console.log 'Directives loaded'