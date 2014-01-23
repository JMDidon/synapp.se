# Filters module
# ------------------------------
synappseApp = angular.module 'synappseFilters', []


# Dropbox uid to username
# ------------------------------
synappseApp.filter 'DropboxUIDToUsername', ['Projects', ( Projects ) ->
	( uid, projectID ) ->
		project = Projects.readProject projectID
		result = ( user.name for user in project.users when user.uid is uid )[0]
		return "Unnamed" if not result
		firstName = result.substring 0, result.indexOf ' '
		if ~( user.name.substring 0, user.name.indexOf ' ' for user in project.users when user.uid isnt uid ).indexOf firstName then (result.substring 0, 2+result.indexOf ' ' )+'.' else firstName
]

synappseApp.filter 'assignee', ->
	( name ) ->
		name.substr 0, 1


# Alerts
# ------------------------------
synappseApp.filter 'unseen', ->
	( alerts ) ->
		alert for alert in ( alerts or [] ) when DB.user.uid not in alert.seen




# Tasks
# ------------------------------
synappseApp.filter 'tasksFilter', -> ( tasks, filter ) -> 
	switch filter
		when 1 then task for task in tasks or [] when task.due is false and task.status < 4
		when 2 then task for task in tasks or [] when task.status is 4
		else task for task in tasks or [] when task.due isnt false and task.status < 4



# Date filters
# ------------------------------
synappseApp.filter 'miniDate', [ '$filter', ( $filter ) ->
	( date, lang ) ->
		return 'No due' if date is false
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		date = getCleanDate date
		diffDays = Math.round (date-getCleanDate())/(1000*60*60*24)
		if diffDays is 0 then $filter('translate')('Today') 
		else if lang == 'fr' then date.getDate()+' '+$filter('translate')(months[date.getMonth()])
		else $filter('translate')(months[date.getMonth()])+' '+date.getDate()
]
		
synappseApp.filter 'month', ->
	( date ) ->
		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		date = getCleanDate date
		months[date.getMonth()]+' '+date.getFullYear()
	
	
# synappseApp.filter 'relativeDate', ->
# 	( date ) ->
# 		delta = Math.floor (new Date - date)/1000
# 		switch
# 			when delta < 120 then 'about one minute ago'
# 			when delta >= 120 and delta < 60*60 then ( Math.floor delta/60 )+' minutes ago'
# 			when delta >= 60*60 and delta < 60*60*2 then ( Math.floor delta/(60*60) )+' hour ago'
# 			when delta >= 60*60*2 and delta < 60*60*24 then ( Math.floor delta/(60*60) )+' hours ago'
# 			when delta >= 60*60*24 and delta < 60*60*24*2 then 'yesterday'
# 			when delta >= 60*60*24 and delta < 60*60*24*30 then ( Math.floor delta/(60*60*24) )+' days ago'
# 			else 'on '+smartDate date


# synappseApp.filter 'smartDate', ->
# 	( date ) ->
# 		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
# 		days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
# 		date = getCleanDate date
# 		now = getCleanDate()
# 		diffDays = Math.round (date-now)/(1000*60*60*24)
# 		switch
# 			when date.getFullYear() isnt now.getFullYear() then months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
# 			when diffDays is 0 then 'Today'
# 			when diffDays is 1 then 'Tomorrow'
# 			when 0 < diffDays < 7 then days[(now.getDay()+diffDays-1)%7]
# 			else months[date.getMonth()]+' '+date.getDate()