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


console.log 'Filters module loaded'