# Helpers module
# ------------------------------
synappseApp = angular.module 'synappseHelpers', []


# Data processing helpers
# ------------------------------

# synappseApp.service 'Helpers', ['$http'
# 	($http) ->
# 		generateID = ( n, list ) -> ( k = Math.random().toString(36).substr(2,n) while ( not k ) or k in list ).toString()
# 
# 		decodeProject = ( project ) ->
# 			JSON.parse project
# 
# 		encodeProject = ( name, users, tasks ) ->
# 			project = 
# 				name: name
# 				users: ( user for user in users )
# 				tasks: 
# 					for task in tasks
# 						id: task.id
# 						name: task.name
# 			JSON.stringify project
# 
# 		undefined
# ]
generateID = ( n, list ) -> ( k = Math.random().toString(36).substr(2,n) while ( not k? ) or ( k in list ) ).toString()
slug = ( str ) ->
	[from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
	( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
	str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")

console.log 'Helpers module loaded'