# Helpers module
# ------------------------------
synappseApp = angular.module 'synappseHelpers', []


# Data processing helpers
# ------------------------------

getCleanDate = ( date ) ->
	date = if date then new Date date else new Date
	date = new Date date.getFullYear(), date.getMonth(), date.getDate()
	date

generateID = ( n, list, prefix = '') -> ( k = prefix+Math.random().toString(36).substr(2,n) while ( not k? ) or ( k in list ) ).toString()

slug = ( str ) ->
	[from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
	( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
	str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")
	
console.log 'Helpers module loaded'