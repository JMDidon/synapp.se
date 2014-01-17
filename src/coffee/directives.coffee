# Directives module
# ------------------------------
synappseApp = angular.module 'synappseDirectives', []


# Task form
# ------------------------------
synappseApp.directive 'taskForm', ['Projects', ( Projects ) ->
  templateUrl: 'views/taskForm.html'
  scope: true      
  controller: ( $scope, $element ) ->
    $element[0].querySelector( 'textarea' ).focus()
    $scope.tmpTask = if $scope.task.id then angular.copy $scope.task else $scope.task
    $scope.tmpTask.users = [] if not $scope.tmpTask.users?
    
    $scope.submit = ->
      return false if $scope.tmpTask.name.match /^\s*$/
      $scope.tmpTask.due = false if isNaN ( new Date $scope.tmpTask.due ).getTime()
      if $scope.task.id?
        do $scope.toggleForm
        Projects.editTask $scope.project.id, $scope.task.id, $scope.tmpTask
      else
        Projects.createTask $scope.project.id, 
          name: $scope.tmpTask.name
          author: DB.user.uid
          status: 0
          priority: $scope.tmpTask.priority
          due: $scope.tmpTask.due
          users: $scope.tmpTask.users
        $scope.tmpTask = {}
    $scope.toggleUser = ( uid ) ->
      index = $scope.tmpTask.users.indexOf uid
      if index > -1 then $scope.tmpTask.users.splice index, 1 else $scope.tmpTask.users.push uid 
]


# Calendar
# ------------------------------
synappseApp.directive 'calendar', ->
  templateUrl: 'views/calendar.html'
  scope: true
  link: ( scope ) ->
    scope.current = getCleanDate scope.tmpTask.due
    scope.current.setDate 1
    scope.rows = []
    now = getCleanDate()

    scope.update = ->
      scope.rows = []
      cell = 0
      row = []
      first = scope.current.getDay()-2 # starts on Mondy
      month = scope.current.getMonth()
      while true
        current = angular.copy scope.current
        current.setDate cell-first
        row.push 
          date: current.getTime()
          day: current.getDate()
          isToday: ( Math.round (current-now)/(1000*60*60*24) ) is 0
          isWeekEnd: cell%7 > 4
          isPrev: cell <= first
          isNext: cell > first && current.getMonth() isnt month
        if cell%7 is 6
          scope.rows.push cells: angular.copy row
          row = []
        break if cell > first && current.getMonth() isnt month && current.getDate() < 8 && cell%7 is 6
        cell++

    scope.prev = ->
      scope.current.setMonth scope.current.getMonth()-1
      do scope.update

    scope.next = ->
      scope.current.setMonth scope.current.getMonth()+1
      do scope.update

    scope.setDate = ( cell ) ->
      do scope.prev if cell.isPrev
      do scope.next if cell.isNext
      scope.tmpTask.due = if cell.date isnt scope.tmpTask.due then cell.date else false
      
    scope.remove = ->
      scope.tmpTask.due = false

    do scope.update


console.log 'Directives loaded'