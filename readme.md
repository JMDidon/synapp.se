# Synappse
Internal documentation

## Dropbox model
JavaScript SDK: https://github.com/dropbox/dropbox-js  
Original documentation: https://www.dropbox.com/developers/core

### actions available
- `DB.auth( callback )`
- `DB.sync( projects, callback )`

### project object structure


    name: (string)
    id: (int) generated
    folder: (string) ending with a slash (/)
    slug: (string) slug from name
    users: [
      {
        uid: (int) from Dropbox
        email: (string) from Dropbox
        name: (string) from Dropbox
      },
      …
    ]
    tasks: [
      {
        id: (int) generated
        date: (timestamp) creation date
        edit: (timestamp) systematically updated using ( new Date ).getTime()
        name: (string)
        start: (timestamp) start date
        end: (timestamp) end date
        tags: [ (string), … ]
        users: [ (user), … ] assigned users
      },
      …
    ]
    deletedTasks: [ (int), … ] storing IDs
    comments: [
      {
        id: (int) generated
        date: (timestamp) creation date
        edit: (timestamp) systematically updated using ( new Date ).getTime()
        author: (user)
        taskID: (int) task ID reference, "0" if none
        parentID: (int) comment ID reference, "0" if none
        text: (string)
      },
      …
    ]
    deletedComments: [ (int), … ] storing IDs