# Filters module
# ------------------------------
synappseApp = angular.module 'synappseFilters', []


# Dropbox uid to username
# ------------------------------

synappseApp.filter 'DropboxUIDToUsername', ['Projects', ( Projects ) ->
	( uid, slug ) ->
		project = Projects.findProject slug
		result = ( user.name for user in project.users when user.uid is uid )[0]
		return "Unnamed" if not result
		firstName = result.substring 0, result.indexOf ' '
		if ~( user.name.substring 0, user.name.indexOf ' ' for user in project.users when user.uid isnt uid ).indexOf firstName then (result.substring 0, 2+result.indexOf ' ' )+'.' else firstName
]


# Comments dates to relative date
# ------------------------------
synappseApp.filter 'smartDate', ->
	( date ) ->
		date

synappseApp.filter 'relativeDate', ['$filter', ( $filter ) ->
	( date ) ->
		relativeDate date
		# delta = Math.floor (new Date - date)/1000
		# switch
		# 	when delta < 120 then 'about one minute ago'
		# 	when delta >= 120 and delta < 60*60 then ( Math.floor delta/60 )+' minutes ago'
		# 	when delta >= 60*60 and delta < 60*60*2 then ( Math.floor delta/(60*60) )+' hour ago'
		# 	when delta >= 60*60*2 and delta < 60*60*24 then ( Math.floor delta/(60*60) )+' hours ago'
		# 	when delta >= 60*60*24 and delta < 60*60*24*2 then 'yesterday'
		# 	when delta >= 60*60*24 and delta < 60*60*24*30 then ( Math.floor delta/(60*60*24) )+' days ago'
		# 	else $filter('smartDate') date
]

console.log 'Filters module loaded'