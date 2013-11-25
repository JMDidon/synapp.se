# Helpers module
# ------------------------------
synappseApp = angular.module 'synappseHelpers', []


# Data processing helpers
# ------------------------------

generateID = ( n, list ) -> ( k = Math.random().toString(36).substr(2,n) while ( not k? ) or ( k in list ) ).toString()
slug = ( str ) ->
	[from, to, str] = ['àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;', 'aaaaaeeeeiiiiooooouuuunc------', str.toLowerCase()]
	( str = str.replace ( new RegExp from.charAt(i), 'g' ), to.charAt i ) for i in from.length
	str.replace(/^\s+|\s+$/g, '').replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/\s/gi, "-")

splitTags = ( str ) -> if not str.length then [] else str.toString().split(',').map ( a ) -> a.trim() if a.trim # avoiding spaces at the beginning/end of each tag

console.log 'Helpers module loaded'