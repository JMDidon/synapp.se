# Dropbox authentification
# ------------------------------
client = new Dropbox.Client key:'1n83me2ms50l6az'
client.authenticate ( error, client ) -> 
  console.log error if error



# Data processing helpers
# ------------------------------
generateID = ( n, list ) -> ( k = Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()
  
decodeProject = ( project ) ->
  JSON.parse project
  
encodeProject = ( name, users, tasks ) ->
  project = 
    name: name
    users: ( user for user in users )
    tasks: 
      for task in tasks
        id: task.id
        name: task.name
  JSON.stringify project
  
  
  
  
# Initialize
# ------------------------------
app = angular.module 'synappse', []
Project = 
  name: 'project'
  


# Main controller
# ------------------------------
app.controller 'main', ( $scope ) ->  
  cache = localStorage[Project.name] || encodeProject Project.name, [], []
  project = decodeProject cache
  
  # Add users
  $scope.users = project.users
  client.getAccountInfo ( error, user ) ->
    $scope.users.push name: user.name, email: user.email if user.name not in ( u.name for u in $scope.users )
    
  $scope.tasks = project.tasks
  $scope.deletedTasks = localStorage[Project.name+'_deletedTasks'] || []
    
  $scope.cache = -> 
    localStorage[Project.name] = encodeProject Project.name, $scope.users, $scope.tasks
    localStorage[Project.name+'_deletedTasks'] = $scope.deletedTasks
  
  $scope.sync = ->
    # load DB
    # manage conflicts : local == distant (generate final IDs)
    # save DB
    # update local
    client.readFile '_app.json', ( error, data ) ->
      tasks = if data then ( JSON.parse data ).tasks else []
      distantIDs = ( task.id for task in tasks )
      localIDs = ( task.id for task in $scope.tasks )
  
      # Delete local items missing in distant
      $scope.tasks = ( task for task in $scope.tasks when task.id.length is 2 or task.id in distantIDs )
      
      # Add local items missing in distant
      ( task.id = generateID 3, distantIDs ) for task in $scope.tasks when task.id.length is 2
      
      # Add distant items missing in local
      $scope.tasks.push task for task in tasks when task.id not in localIDs and task.id not in $scope.deletedTasks
      
      # Refresh scope
      $scope.deletedTasks = []
      do $scope.$apply
      do $scope.cache
      
      # Save file
      project = encodeProject Project.name, $scope.users, $scope.tasks
      client.writeFile '_app.json', project, ( error, stat ) ->
        console.log error if error



# Tasks controller
# ------------------------------
app.controller 'tasks', ( $scope ) ->  
  $scope.addTask = ->
    # generate local ID
    # add local task
    # save cache
    $scope.tasks.push 
      id: generateID 2, ( task.id for task in $scope.tasks )
      name: $scope.taskName
    $scope.taskName = ''
    do $scope.cache
  
 

# Task controller
# ------------------------------ 
app.controller 'task', ( $scope ) ->
  $scope.deleteTask = ->
    # delete local task
    # save cache
    $scope.deletedTasks.push $scope.task.id
    index = ( task.id for task in $scope.tasks ).indexOf $scope.task.id
    $scope.tasks.splice index, 1
    do $scope.cache