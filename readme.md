# Synappse
Internal documentation.

## Dropbox model
JavaScript SDK: https://github.com/dropbox/dropbox-js  
Original documentation: https://www.dropbox.com/developers/core

### actions available
- `DB.sync( [ (project), … ], callback )`

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
    alerts: [
      {
        id: (int) generated
        text: (string)
        seen: [ (int), … ] storing UIDs
      },
      …
    ]
    tasks: [
      {
        id: (int) generated
        date: (timestamp) creation date
        edit: (timestamp) systematically updated using ( new Date ).getTime()
        author: (int) user UID
        name: (string)
        due: (timestamp) due date
        users: [ (int), … ] assigned users UIDs
      },
      …
    ]
    deletedTasks: [ (int), … ] storing IDs
    comments: [
      {
        id: (int) generated
        date: (timestamp) creation date
        edit: (timestamp) systematically updated using ( new Date ).getTime()
        author: (int) user UID
        taskID: (int) task ID reference, "0" if none
        parentID: (int) comment ID reference, "0" if none
        text: (string)
      },
      …
    ]
    deletedComments: [ (int), … ] storing IDs
