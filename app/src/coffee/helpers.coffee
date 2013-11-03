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

console.log 'Helpers module loaded'