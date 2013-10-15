client = new Dropbox.Client key:'1n83me2ms50l6az'
client.authenticate (error, client) -> console.log error if (error)

window.Bridge = 
  saveTasks: (tasks) -> client.writeFile 'tasks.json', JSON.stringify tasks
  getTasks: (callback) ->
    tasks = []
    client.readFile 'tasks.json', (error, data) ->
      if error and error.status is Dropbox.ApiError.NOT_FOUND
        client.writeFile 'tasks.json', JSON.stringify tasks
      else tasks = JSON.parse data
      callback tasks
  addTask: (id, value) ->
    @getTasks (tasks) ->
      tasks.push id:id, value:value
      Bridge.saveTasks tasks
  editTask: (id, value) ->
    # @getTasks (tasks) ->
    #   tasks.push id:id, value:value
    #   Bridge.saveTasks tasks
  deleteTask: (id) ->
    @getTasks (tasks) ->
      tasks.splice i, 1 for task, i in tasks when task.id is id 
      Bridge.saveTasks tasks
  
# Bridge.addTask 'I0E3', 'This is a test'
# Bridge.addTask 'A3C6', 'This is a test 2'
# Bridge.addTask 'NC94', 'This is a test 3'
Bridge.deleteTask 'NC94'