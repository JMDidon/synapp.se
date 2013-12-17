# Helpers module
# ------------------------------
synappseApp = angular.module 'synappseHelpers', []


# Data processing helpers
# ------------------------------

generateID = ( n, list, prefix = '') -> ( k = prefix+Math.random().toString(36).substr(2,n) while ( not k? ) or ( k in list ) ).toString()


slug = ( str ) ->
  [from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
  ( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
  str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")


splitTags = ( str ) -> if not str? then [] else str.toString().split(',').map ( a ) -> a.trim() if a.trim # avoiding spaces at the beginning/end of each tag


smartDate = ( date ) ->
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  date = new Date date.getFullYear(), date.getMonth(), date.getDate()
  now = new Date
  now = new Date now.getFullYear(), now.getMonth(), now.getDate()
  diffDays = Math.round (date-now)/(1000*60*60*24)
  switch
    when date.getFullYear() isnt now.getFullYear() then months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
    when diffDays is 0 then 'Today'
    when diffDays is 1 then 'Tomorrow'
    when 0 < diffDays < 7 then days[(now.getDay()+diffDays-1)%7]
    else months[date.getMonth()]+' '+date.getDate()

relativeDate = ( date ) ->
    delta = Math.floor (new Date - date)/1000
    switch
      when delta < 120 then 'about one minute ago'
      when delta >= 120 and delta < 60*60 then ( Math.floor delta/60 )+' minutes ago'
      when delta >= 60*60 and delta < 60*60*2 then ( Math.floor delta/(60*60) )+' hour ago'
      when delta >= 60*60*2 and delta < 60*60*24 then ( Math.floor delta/(60*60) )+' hours ago'
      when delta >= 60*60*24 and delta < 60*60*24*2 then 'yesterday'
      when delta >= 60*60*24 and delta < 60*60*24*30 then ( Math.floor delta/(60*60*24) )+' days ago'
      else smartDate date




console.log relativeDate new Date 'December 17, 2013 9:50:00'
console.log relativeDate new Date 'December 17, 2013 9:46:00'
console.log relativeDate new Date 'December 17, 2013 7:30:00'
console.log relativeDate new Date 'December 15, 2013 7:30:00'
console.log relativeDate new Date 'December 16, 2013 7:30:00'

console.log 'Helpers module loaded'