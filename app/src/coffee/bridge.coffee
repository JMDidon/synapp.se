do ->
  # ------------------------------
  # Dropbox authentification
  # ------------------------------
  client = new Dropbox.Client key:'1n83me2ms50l6az'
  client.authenticate (error, client) -> console.log error if (error)    
    
  
  
  # ------------------------------
  # Model object // qui fait le café
  # ------------------------------
  class Model
    # Set json file
    constructor: (@file = 'default.json') ->
      
    # Queue actions while Dropbox is syncing
    queue: 
      _: []
      skip: false
      open: -> @skip = false
      close: -> @skip = true
      execute: -> do action for action in @_
      stack: (fn) -> if not @skip then @_.push fn else do fn
    
    # Items
    _: []
    set: (@_) ->
    get: -> @_ 
    
    # Load from Dropbox json file
    load: (callback = false) -> 
      do @queue.open
      $this = @
      fn = ->
        do $this.queue.close
        do $this.queue.execute
        do callback if callback
      client.readFile @file, (error, data) ->
        if error and error.status is Dropbox.ApiError.NOT_FOUND
          do $this.save fn # create file if doesn't exist
        else 
          $this.set JSON.parse data
          do fn
    
    # Save to Dropbox json file
    save: (callback = false) -> 
      do @queue.open
      $this = @
      client.writeFile @file, ( JSON.stringify @_ ), (error, stat) ->
        do $this.queue.close
        do callback if callback
    
    # Add item (ID automaticly added)
    add: (data) -> 
      $this = @
      @queue.stack ->
        id = ( n = Math.random().toString(36).substr(2,3) while ( not n ) or n in ( item.id for item in @_ ) ).toString()
        output = id:id, addDate:new Date(), editDate:new Date(), status:0
        output[k] = v for k, v of data when k not in Object.keys(output)
        $this._.push output
        do $this.save
      
    # Edit item
    edit: (id, data) -> 
      $this = @
      @queue.stack ->
        for item, i in $this._ when item.id is id
          item = id:id, addDate:item.addDate, editDate:new Date(), status:0
          item[k] = v for k, v of data when k not in Object.keys(item)
          $this._[i] = item
        do $this.save
      
    # Delete item
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

Data.tasks.add value:'This is a test'
for task in do Data.tasks.get
  Data.tasks.edit task.id, value:'Dat ass'