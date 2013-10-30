<?php session_start(); if (!$_SESSION['access']) { header('location:../'); exit; } ?>
<!DOCTYPE html>
<html ng-app="synappse">
<head lang="en">
  <meta charset="utf-8">
  <title>Synappse</title>
</head>
<body ng-controller="main">
  
  
  <!-- TASKS -->
  <section ng-controller="tasks">
    
    <ul>
     <li ng-repeat="task in tasks" ng-controller="task">
       {{ task.id }} - {{ task.name }}
       <a href="" ng-click="deleteTask()">Delete</a>
     </li>
    </ul>
    
    
    <form ng-submit="addTask()">
      <input type="text" ng-model="taskName">
      <input type="submit" value="add">
    </form>
    
    <a href="" ng-click="sync()">Sync</a>
    
  </section><!-- end of TASKS -->
  
  

  <!-- Scripts -->
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.1/dropbox.min.js"></script>
  <script src="public/app.js"></script>

</body>
</html>