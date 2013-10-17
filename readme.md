# Synappse
Internal documentation

## Dropbox tests
JavaScript SDK: https://github.com/dropbox/dropbox-js  
Original documentation: https://www.dropbox.com/developers/core

Launch app/bridge.html and manipulate app/src/coffee/bridge.coffee to test. It needs further optimization. Next steps:

Pass any action (add tasks, delete tasks, etc.) as a callback to Queue.add().
### actions available
- Tasks.add(id, value)
- Tasks.edit(id, value)
- Tasks.delete(id)