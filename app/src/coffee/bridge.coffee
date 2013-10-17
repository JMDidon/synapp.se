# ------------------------------
# Dropbox authentification
# ------------------------------
client = new Dropbox.Client key:'1n83me2ms50l6az'
client.authenticate (error, client) -> console.log error if (error)



# ------------------------------
# Queue
# ------------------------------
Queue = 
  _: []
  skip: false
  add: (fn) -> if Queue.skip then Queue._.push fn else do fn
  execute: -> do action for action in Queue._
  disable: -> Queue.skip = true
  


# ------------------------------
# Tasks
# ------------------------------

## Tasks object
Tasks =
  _: []
  file: 'tasks.json'
  
  set: (tasks) -> Tasks._ = tasks
  get: -> Tasks._ 
  save: -> client.writeFile Tasks.file, JSON.stringify Tasks._
  
  # add task
  add: (id, value) ->
    Tasks._.push id:id, value:value
    do Tasks.save
    
  # edit task
  edit: (id, value) ->
    task.value = value for task in Tasks._ when task.id is id
    do Tasks.save
    
  # delete task
  delete: (id) -> 
    Tasks._.splice i, 1 for task, i in Tasks._ when task.id is id
    do Tasks.save
    
    

## Get tasks
client.readFile Tasks.file, (error, data) ->
  if error and error.status is Dropbox.ApiError.NOT_FOUND
    do Tasks.save # create file if doesn't exist
  else
    Tasks.set JSON.parse data
  do Queue.execute
  do Queue.disable
  
  
  
# Actions
Queue.add -> Tasks.add 'I0E3', 'This is a test'
Queue.add -> Tasks.add 'A3C6', 'This is a test 2'
Queue.add -> Tasks.add 'NC94', 'This is a test 3'
Queue.add -> Tasks.delete 'NC94'
Queue.add -> console.log do Tasks.get
