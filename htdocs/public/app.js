// Generated by CoffeeScript 1.6.3
var generateID,getCleanDate,slug,synappseApp,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};__indexOf.call([1,2,3],2)>=0;synappseApp=angular.module("synappseApp",["ngRoute","synappseControllers","synappseServices","synappseFilters","synappseDirectives"]);synappseApp.config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/home",{redirectTo:"/"}).when("/:project",{templateUrl:"views/project.html",controller:"ProjectCtrl"},{controller:"HomeCtrl"}).when("/:project/:section",{templateUrl:"views/project.html",controller:"ProjectCtrl"}).otherwise({redirectTo:"/"});return void 0}]);getCleanDate=function(e){e=e?new Date(e):new Date;e=new Date(e.getFullYear(),e.getMonth(),e.getDate());return e};generateID=function(e,t,n){var r;n==null&&(n="");return function(){var i;i=[];while(r==null||__indexOf.call(t,r)>=0)i.push(r=n+Math.random().toString(36).substr(2,e));return i}().toString()};slug=function(e){var t,n,r,i,s,o,u;o=["àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;","aaaaaeeeeiiiiooooouuuunc------",e.toLowerCase()],t=o[0],r=o[1],e=o[2];u=t.length;for(i=0,s=u.length;i<s;i++){n=u[i];e=e.replace(new RegExp(t.charAt(n),"g"),r.charAt(n))}return e.replace(/^\s+|\s+$/g,"").replace(/[^-a-zA-Z0-9\s]+/ig,"").replace(/\s/gi,"-")};synappseApp=angular.module("synappseControllers",[]);synappseApp.controller("MainCtrl",["$scope","Projects",function(e,t){e.projects=t.getProjects();e.me={};e.login=function(){e.me=DB.user;return e.$apply()};e.sync=function(){localStorage.projects=[];return DB.sync(e.projects,function(){t.cache();return e.$apply()})};return e.createProject=function(){t.createProject(e.projectName);e.projectName="";return e.projectFolder=""}}]);synappseApp.controller("HomeCtrl",["$scope","Projects",function(e,t){return e.createProject=function(){return t.createProject(e.name)}}]);synappseApp.controller("ProjectCtrl",["$scope","$routeParams","$location","Projects",function(e,t,n,r){e.project=r.findProject(t.project);e.now=getCleanDate();e.project.alerts==null&&(e.project.alerts=[]);e.statuses=[{k:0,v:"Todo"},{k:1,v:"In progress"},{k:2,v:"Advanced"},{k:3,v:"Done"},{k:4,v:"Archived"}];e.$watch("selectProject",function(){return n.path("/"+e.selectProject)});e.task={};e.emptyTask=function(){return e.task={}};e.taskOpen=!1;e.editMode=!1;e.$watch("taskOpen",function(){return e.editMode=e.taskOpen===0});e.toggleForm=function(){return e.setTaskOpen(0)};e.setTaskOpen=function(t){return e.taskOpen=t===e.taskOpen?!1:t};return window.addEventListener("keydown",function(t){if(t.which===27){e.setTaskOpen(!1);return e.$apply()}})}]);synappseApp.controller("CommentCtrl",["$scope","$routeParams","Projects",function(e,t,n){e.createComment=function(){n.createComment(e.project.id,{author:DB.user.uid,taskID:e.selectedTask.id,parentID:0,text:e.newComment.text});e.newComment={};return e.toggleCommentForm()};return e.deleteComment=function(){return n.deleteComment(e.project.id,e.comment.id)}}]);synappseApp=angular.module("synappseServices",[]);synappseApp.factory("Projects",function(){var e,t;e=localStorage.projects?angular.fromJson(localStorage.projects):[];t={};t.cache=function(){return localStorage.projects=angular.toJson(e)};t.getProjects=function(){return e};t.createProject=function(n){var r,i,s,o,u,a;s=!1;o=n.toLowerCase();for(u=0,a=e.length;u<a;u++){i=e[u];i.name===o&&(s=!0)}if(s!==!0){r=generateID(2,function(){var t,n,r;r=[];for(t=0,n=e.length;t<n;t++){i=e[t];r.push(i.id)}return r}());console.log("Creating task with id : ",r);e.push({name:n,id:r,folder:DB.folder+slug(n)+"/",slug:slug(n),users:[],alerts:[],tasks:[],deletedTasks:[],comments:[],deletedComments:[]});return t.cache()}console.log("Project already exists !")};t.readProject=function(t){var n;return function(){var r,i,s;s=[];for(r=0,i=e.length;r<i;r++){n=e[r];n.id===t&&s.push(n)}return s}()[0]||{}};t.findProject=function(t){var n;return function(){var r,i,s;s=[];for(r=0,i=e.length;r<i;r++){n=e[r];n.slug===t&&s.push(n)}return s}()[0]||{}};t.getUserByUID=function(t,n){var r,i,s,o,u,a;for(s=0,u=e.length;s<u;s++){r=e[s];if(r.id===t)for(o=0,a=r.length;o<a;o++){i=r[o];if(i.uid===n)return i}}};t.createTask=function(n,r){var i,s,o,u;for(o=0,u=e.length;o<u;o++){i=e[o];if(i.id!==n)continue;r.id=generateID(2,function(){var e,t,n,r;n=i.tasks;r=[];for(e=0,t=n.length;e<t;e++){s=n[e];r.push(s.id)}return r}());r.date=(new Date).getTime();r.edit=(new Date).getTime();i.tasks.push(r)}return t.cache()};t.editTask=function(n,r,i){var s,o,u,a,f,l,c,h,p;for(f=0,c=e.length;f<c;f++){o=e[f];if(o.id===n){p=o.tasks;for(l=0,h=p.length;l<h;l++){u=p[l];if(u.id!==r)continue;i.edit=(new Date).getTime();for(s in i){a=i[s];s!=="id"&&s!=="date"&&(u[s]=a)}}}}return t.cache()};t.deleteTask=function(n,r){var i,s,o,u;for(o=0,u=e.length;o<u;o++){i=e[o];if(i.id!==n)continue;__indexOf.call(i.deletedTasks,r)<0&&i.deletedTasks.push(r);i.tasks=angular.copy(function(){var e,t,n,r,o;n=i.tasks;o=[];for(e=0,t=n.length;e<t;e++){s=n[e];(r=s.id,__indexOf.call(i.deletedTasks,r)<0)&&o.push(s)}return o}())}return t.cache()};t.createComment=function(n,r){var i,s,o,u;console.log(n,r);for(o=0,u=e.length;o<u;o++){s=e[o];if(s.id!==n)continue;r.id=generateID(2,function(){var e,t,n,r;n=s.comments;r=[];for(e=0,t=n.length;e<t;e++){i=n[e];r.push(i.id)}return r}());r.date=(new Date).getTime();r.edit=(new Date).getTime();s.comments.push(r)}return t.cache()};t.deleteComment=function(n,r){var i,s,o,u;for(o=0,u=e.length;o<u;o++){s=e[o];if(s.id!==n)continue;__indexOf.call(s.deletedComments,r)<0&&s.deletedComments.push(r);s.comments=angular.copy(function(){var e,t,n,r,o;n=s.comments;o=[];for(e=0,t=n.length;e<t;e++){i=n[e];(r=i.id,__indexOf.call(s.deletedComments,r)<0)&&o.push(i)}return o}())}return t.cache()};t.alert=function(n,r,i){var s,o,u,a;for(u=0,a=e.length;u<a;u++){o=e[u];if(o.id!==n)continue;o.alerts==null&&(o.alerts=[]);o.alerts.push({id:generateID(2,function(){var e,t,n,r;n=o.alerts;r=[];for(e=0,t=n.length;e<t;e++){s=n[e];r.push(s.id)}return r}()),text:r,seen:[i]})}return t.cache()};t.seen=function(n,r,i){var s,o,u,a,f,l,c;for(u=0,f=e.length;u<f;u++){o=e[u];if(o.id===n){c=o.alerts;for(a=0,l=c.length;a<l;a++){s=c[a];s.id===r&&__indexOf.call(s.seen,i)<0&&s.seen.push(i)}}}return t.cache()};return t});synappseApp=angular.module("synappseDirectives",[]);synappseApp.directive("task",["Projects",function(e){return{templateUrl:"views/task.html",scope:!0,controller:["$scope",function(t){t.editMode=!1;t.$watch("taskOpen",function(){return t.editMode=t.taskOpen===t.task.id});t.toggleForm=function(){return t.setTaskOpen(t.task.id)};t.late=t.task.due<=t.now&&t.task.status<3;t.$watch("task.status",function(){t.late=t.task.due<=t.now&&t.task.status<3;return e.editTask(t.project.id,t.task.id,t.task)});return t.deleteTask=function(){return e.deleteTask(t.project.id,t.task.id)}}]}}]);synappseApp.directive("taskForm",["Projects",function(e){return{templateUrl:"views/taskForm.html",scope:!0,controller:["$scope","$element",function(t,n){n[0].querySelector("textarea").focus();t.tmpTask=t.task.id?angular.copy(t.task):t.task;t.tmpTask.users==null&&(t.tmpTask.users=[]);t.submit=function(){if(t.tmpTask.name.match(/^\s*$/))return!1;isNaN((new Date(t.tmpTask.due)).getTime())&&(t.tmpTask.due=!1);if(t.task.id!=null){t.toggleForm();return e.editTask(t.project.id,t.task.id,t.tmpTask)}e.createTask(t.project.id,{name:t.tmpTask.name,author:DB.user.uid,status:0,priority:t.tmpTask.priority||!1,due:t.tmpTask.due,users:t.tmpTask.users});t.emptyTask();t.tmpTask=t.task;return n[0].querySelector("textarea").focus()};return t.toggleUser=function(e){var n;n=t.tmpTask.users.indexOf(e);return n>-1?t.tmpTask.users.splice(n,1):t.tmpTask.users.push(e)}}]}}]);synappseApp.directive("calendar",function(){return{templateUrl:"views/calendar.html",scope:!0,link:function(e){var t;e.current=getCleanDate(e.tmpTask.due);e.current.setDate(1);e.rows=[];t=getCleanDate();e.update=function(){var n,r,i,s,o,u;e.rows=[];n=0;o=[];i=e.current.getDay()-2;s=e.current.getMonth();u=[];for(;;){r=angular.copy(e.current);r.setDate(n-i);o.push({date:r.getTime(),day:r.getDate(),isToday:Math.round((r-t)/864e5)===0,isWeekEnd:n%7>4,isPrev:n<=i,isNext:n>i&&r.getMonth()!==s});if(n%7===6){e.rows.push({cells:angular.copy(o)});o=[]}if(n>i&&r.getMonth()!==s&&r.getDate()<8&&n%7===6)break;u.push(n++)}return u};e.prev=function(){e.current.setMonth(e.current.getMonth()-1);return e.update()};e.next=function(){e.current.setMonth(e.current.getMonth()+1);return e.update()};e.setDate=function(t){t.isPrev&&e.prev();t.isNext&&e.next();return e.tmpTask.due=t.date!==e.tmpTask.due?t.date:!1};e.remove=function(){return e.tmpTask.due=!1};return e.update()}}});synappseApp=angular.module("synappseFilters",[]);synappseApp.filter("DropboxUIDToUsername",["Projects",function(e){return function(t,n){var r,i,s,o;i=e.readProject(n);s=function(){var e,n,r,s;r=i.users;s=[];for(e=0,n=r.length;e<n;e++){o=r[e];o.uid===t&&s.push(o.name)}return s}()[0];if(!s)return"Unnamed";r=s.substring(0,s.indexOf(" "));return~function(){var e,n,r,s;r=i.users;s=[];for(e=0,n=r.length;e<n;e++){o=r[e];o.uid!==t&&s.push(o.name.substring(0,o.name.indexOf(" ")))}return s}().indexOf(r)?s.substring(0,2+s.indexOf(" "))+".":r}}]);synappseApp.filter("assignee",function(){return function(e){return e.substr(0,1)}});synappseApp.filter("unseen",function(){return function(e){var t,n,r,i,s,o;i=e||[];o=[];for(n=0,r=i.length;n<r;n++){t=i[n];(s=DB.user.uid,__indexOf.call(t.seen,s)<0)&&o.push(t)}return o}});synappseApp.filter("tasksDue",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.due!==!1&&t.status<4&&i.push(t)}return i}});synappseApp.filter("tasksNoDue",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.due===!1&&t.status<4&&i.push(t)}return i}});synappseApp.filter("tasksArchived",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.status===4&&i.push(t)}return i}});synappseApp.filter("miniDate",function(){return function(e){var t,n;if(e===!1)return"";n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];e=getCleanDate(e);t=Math.round((e-getCleanDate())/864e5);return t===0?"Today":n[e.getMonth()]+" "+e.getDate()}});synappseApp.filter("month",function(){return function(e){var t;t=["January","February","March","April","May","June","July","August","September","October","November","December"];e=getCleanDate(e);return t[e.getMonth()]+" "+e.getFullYear()}});synappseApp.filter("relativeDate",function(){return function(e){var t;t=Math.floor((new Date-e)/1e3);switch(!1){case!(t<120):return"about one minute ago";case!(t>=120&&t<3600):return Math.floor(t/60)+" minutes ago";case!(t>=3600&&t<7200):return Math.floor(t/3600)+" hour ago";case!(t>=7200&&t<86400):return Math.floor(t/3600)+" hours ago";case!(t>=86400&&t<172800):return"yesterday";case!(t>=86400&&t<2592e3):return Math.floor(t/86400)+" days ago";default:return"on "+smartDate(e)}}});synappseApp.filter("smartDate",function(){return function(e){var t,n,r,i;r=["January","February","March","April","May","June","July","August","September","October","November","December"];t=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];e=getCleanDate(e);i=getCleanDate();n=Math.round((e-i)/864e5);switch(!1){case e.getFullYear()===i.getFullYear():return r[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear();case n!==0:return"Today";case n!==1:return"Tomorrow";case!(0<n&&n<7):return t[(i.getDay()+n-1)%7];default:return r[e.getMonth()]+" "+e.getDate()}}});