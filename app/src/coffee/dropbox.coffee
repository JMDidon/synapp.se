# Dropbox module
# ------------------------------
synappseApp = angular.module 'synappseDropbox', []


# Dropbox authentification
# ------------------------------
client = new Dropbox.Client key:'1n83me2ms50l6az'
client.authenticate ( error, client ) -> 
	console.log error if error

console.log 'Dropbox module loaded'