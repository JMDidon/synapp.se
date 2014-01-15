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
      if scope.task.id?
        do scope.toggleEditMode
        Projects.editTask scope.project.id, scope.task.id, scope.tmpTask
      else
        Projects.createTask scope.project.id, 
          name: scope.tmpTask.name
          author: DB.user.uid
          status: 0
          priority: scope.tmpTask.priority
          start: scope.tmpTask.start
          end: scope.tmpTask.end
          users: scope.tmpTask.users
        scope.tmpTask = {}
]
      
console.log 'Directives loaded'