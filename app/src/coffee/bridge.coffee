# ------------------------------
# Dropbox authentification
# ------------------------------
client = new Dropbox.Client key:'1n83me2ms50l6az'
client.authenticate (error, client) -> console.log error if (error)
  


# ------------------------------
# Model object // qui fait le café
# ------------------------------
class Model
  constructor: (@file = 'default.json') ->
    
  queue: 
    _: []
    skip: false
    enable: -> @skip = false
    disable: -> @skip = true
    execute: -> do action for action in @_
    stack: (fn) -> if @skip then @_.push fn else do fn
  
  _: []
  set: (@_) ->
  get: -> @_ 
  
  load: (callback = false) -> 
    do @queue.enable
    $this = @
    fn = ->
      do $this.queue.disable
      do $this.queue.execute
      do callback if callback
    client.readFile @file, (error, data) ->
      if error and error.status is Dropbox.ApiError.NOT_FOUND
        do $this.save fn # create file if doesn't exist
      else 
        $this.set JSON.parse data
        do fn
        
  save: (callback = false) -> 
    client.writeFile @file, ( JSON.stringify @_ ), (error, stat) ->
      console.log error if error
      do callback if callback
  
  add: (id, value) -> 
    $this = @
    @queue.stack ->
      $this._.push id:id, value:value
      do $this.save
    
  edit: (id, value) -> 
    $this = @
    @queue.stack ->
      item.value = value for item in $this._ when item.id is id
      do $this.save
    
  delete: (id) -> 
    $this = @
    @queue.stack ->
      $this._ = ( item for item in $this._ when item.id isnt id )
      do $this.save

  
  
# ------------------------------
# Data object
# ------------------------------    
window.Data = Data = 
  tasks: new Model 'tasks.json'
  
  
  
# ------------------------------
# Tests
# ------------------------------
## Get Data.tasks (should be repeated once every minute)
do Data.tasks.load
# pass conflict manager as argument and inject common data in local data

Data.tasks.add 'I0E3', 'This is a test'
Data.tasks.add 'A3C6', 'This is a test 2'
Data.tasks.add 'NC94', 'This is a test 3'
Data.tasks.add 'TU43', 'This is a test 4'
Data.tasks.delete 'NC94'
Data.tasks.add 'LI91', 'This is a test 3'
Data.tasks.edit 'I0E3', 'Dat ass'
Data.tasks.delete 'A3C6'
Data.tasks.queue.stack -> console.log do Data.tasks.get