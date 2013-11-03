<?php session_start(); if (!$_SESSION['access']) { header('location:../'); exit; } ?>
<!DOCTYPE html>
<html lang="en" ng-app="synappseApp">
	<head>
		<meta charset="utf-8">
		<title>Synapp.se - Online project management FTW</title>

		<meta name="HandheldFriendly" content="true" />
		<meta name="viewport" content="initial-scale=1.0" />

		<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:300,400,700" >
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
				<li><a href="#/tasks">Tasks</a></li>
				<li><a href="#/tasks/new-task">Add a task</a></li>
				<li><a href="#/users">Users</a></li>
			</ul>
		</nav>

		<div class="wrapper global-wrapper">
			<div ng-view class="main-view-frame"></div>
		</div>
				
		<!-- Scripts -->
		<!-- /!\ DEV VERSION OF ANGULAR ! Change it to .min when placing it in production -->
		<script src="//code.angularjs.org/1.2.0-rc.3/angular.js"></script>
		<script src="//code.angularjs.org/1.2.0-rc.3/angular-route.js"></script>
		<script src="//code.angularjs.org/1.2.0-rc.3/angular-animate.js"></script>
		<script src="//code.angularjs.org/1.2.0-rc.3/angular-resource.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.1/dropbox.min.js"></script>
		<script src="public/app.js"></script>

	</body>
</html>