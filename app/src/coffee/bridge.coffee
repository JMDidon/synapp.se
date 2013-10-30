do ->
  # ------------------------------
  # Conflicts manager
  # ------------------------------
  manageConflicts = (local, remote) ->
    # for item in local
    #   if item.id.length isnt 4
    #     item.id = ( n = Math.random().toString(36).substr(2,4) while ( not n ) or n in ( item.id for item in remote ) ).toString()
    # for a in similars
      # if a.edited
    local


  # ------------------------------
  # Dropbox authentification
  # ------------------------------
  client = new Dropbox.Client key:'1n83me2ms50l6az'
  client.authenticate (error, client) -> console.log error if error



  # ------------------------------
  # Module object // qui fait le café
  # ------------------------------
  class Module
    # Set json file
    constructor: (name = 'error') -> 
      @file = name+'.json'
      ( localStorage[name] = JSON.stringify [] ) if not localStorage[name]?
      @_ = JSON.parse localStorage.getItem name
      @save = -> localStorage[name] = JSON.stringify @_

    # Sync Dropbox
    sync: -> 
      $this = @
      sync = ->
        client.readFile $this.file, (error, data) ->
          $this._ = manageConflicts $this._, JSON.parse data
          console.log $this._
          do $this.save
          client.writeFile $this.file, JSON.stringify $this._
        # setTimeout sync, 5*1000
      do sync

    # Items
    get: -> @_

    # Add item (local ID automatically added)
    add: (data) -> 
      id = ( n = Math.random().toString(36).substr(2,2) while ( not n ) or n in ( item.id for item in @_ ) ).toString()
      output = id:id, edited: ( new Date ).getTime()
      output[k] = v for k, v of data when k not in ['id', 'edited']
      @_.push output
      do @save
      id

    # Edit item
    edit: (id, data) ->
      for item, i in @_ when item.id is id
        item.edited = ( new Date ).getTime()
        item[k] = v for k, v of data when k not in ['id', 'edited']
      do @save

    # Delete item
    delete: (id) -> 
      @_ = ( item for item in @_ when item.id isnt id )
      do @save



  # ------------------------------
  # Data object
  # ------------------------------    
  window.DB =
    tasks: new Module 'tasks'