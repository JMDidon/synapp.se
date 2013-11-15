<!DOCTYPE html>
<html lang="en" ng-app="synappseApp">
	<head>
		<meta charset="utf-8">
		<title>Synapp.se - Online project management FTW</title>

		<meta name="HandheldFriendly" content="true" />
		<meta name="viewport" content="initial-scale=1.0" />

		<link href='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="public/app.css">
	</head>
	<body ng-controller="MainCtrl">
		
		<header class="header">
			<h1><a href="//synapp.se" title="Synapp.se - Online project management FTW">Synapp.se</a></h1>
			<h2> - Online project management FTW</h2>
		</header>

		<nav class="wrapper navbar">
			<ul>
				<li><a href="#/home">Home</a></li>
				<li ng-show="auth"><a href="" ng-click="sync()">Sync</a></li>
				<li ng-repeat="project in projects"><a href="#/projects/{{ project.id }}">{{ project.name }}</a></li>
			</ul>
		</nav>

		<div class="wrapper global-wrapper">
			<div ng-view class="main-view-frame"></div>
		</div>
				
		<!-- Scripts -->
		<!-- /!\ DEV VERSION OF ANGULAR ! Change it to .min when placing it in production -->
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular-route.min.js"></script>
		<!--<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular-animation.min.js"></script>-->
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular-resource.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.1/dropbox.min.js"></script>
		<script src="public/app.js"></script>

	</body>
</html>