// Generated by CoffeeScript 1.6.3
(function(){var e,t,n,r,i=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};i.call([1,2,3],2)>=0;r=angular.module("synappseApp",["ngRoute","synappseControllers","synappseServices","synappseHelpers","synappseFilters","synappseDirectives"]);r.config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/home",{redirectTo:"/"}).when("/:project",{templateUrl:"views/project.html",controller:"ProjectCtrl"},{controller:"HomeCtrl"}).when("/:project/:section",{templateUrl:"views/project.html",controller:"ProjectCtrl"}).otherwise({redirectTo:"/"});return void 0}]);r=angular.module("synappseControllers",[]);r.controller("MainCtrl",function(e,t){e.projects=t.getProjects();e.me={};e.login=function(){e.me=DB.user;return e.$apply()};e.sync=function(){localStorage.projects=[];return DB.sync(e.projects,function(){t.cache();return e.$apply()})};return e.createProject=function(){t.createProject(e.projectName);e.projectName="";return e.projectFolder=""}});r.controller("HomeCtrl",function(e,t,n){return e.createProject=function(){return n.createProject(e.name)}});r.controller("ProjectCtrl",function(e,n,r,i){e.project=i.findProject(n.project);e.now=t();e.project.alerts==null&&(e.project.alerts=[]);e.statuses=[{k:0,v:"Todo"},{k:1,v:"In progress"},{k:2,v:"Advanced"},{k:3,v:"Done"},{k:4,v:"Archived"}];e.$watch("selectProject",function(){return r.path("/"+e.selectProject)});e.task={};e.emptyTask=function(){return e.task={}};e.taskOpen=!1;e.editMode=!1;e.$watch("taskOpen",function(){return e.editMode=e.taskOpen===0});e.toggleForm=function(){return e.setTaskOpen(0)};e.setTaskOpen=function(t){return e.taskOpen=t===e.taskOpen?!1:t};return window.addEventListener("keydown",function(t){if(t.which===27){e.setTaskOpen(!1);return e.$apply()}})});r.controller("CommentCtrl",function(e,t,n){e.createComment=function(){n.createComment(e.project.id,{author:DB.user.uid,taskID:e.selectedTask.id,parentID:0,text:e.newComment.text});e.newComment={};return e.toggleCommentForm()};return e.deleteComment=function(){return n.deleteComment(e.project.id,e.comment.id)}});r=angular.module("synappseDirectives",[]);r.directive("task",["Projects",function(e){return{templateUrl:"views/task.html",scope:!0,controller:function(t){t.editMode=!1;t.$watch("taskOpen",function(){return t.editMode=t.taskOpen===t.task.id});t.toggleForm=function(){return t.setTaskOpen(t.task.id)};t.late=t.task.due<=t.now&&t.task.status<3;t.$watch("task.status",function(){t.late=t.task.due<=t.now&&t.task.status<3;return e.editTask(t.project.id,t.task.id,t.task)});return t.deleteTask=function(){return e.deleteTask(t.project.id,t.task.id)}}}}]);r.directive("taskForm",["Projects",function(e){return{templateUrl:"views/taskForm.html",scope:!0,controller:function(t,n){n[0].querySelector("textarea").focus();t.tmpTask=t.task.id?angular.copy(t.task):t.task;t.tmpTask.users==null&&(t.tmpTask.users=[]);t.submit=function(){if(t.tmpTask.name.match(/^\s*$/))return!1;isNaN((new Date(t.tmpTask.due)).getTime())&&(t.tmpTask.due=!1);if(t.task.id!=null){t.toggleForm();return e.editTask(t.project.id,t.task.id,t.tmpTask)}e.createTask(t.project.id,{name:t.tmpTask.name,author:DB.user.uid,status:0,priority:t.tmpTask.priority||!1,due:t.tmpTask.due,users:t.tmpTask.users});t.emptyTask();t.tmpTask=t.task;return n[0].querySelector("textarea").focus()};return t.toggleUser=function(e){var n;n=t.tmpTask.users.indexOf(e);return n>-1?t.tmpTask.users.splice(n,1):t.tmpTask.users.push(e)}}}}]);r.directive("calendar",function(){return{templateUrl:"views/calendar.html",scope:!0,link:function(e){var n;e.current=t(e.tmpTask.due);e.current.setDate(1);e.rows=[];n=t();e.update=function(){var t,r,i,s,o,u;e.rows=[];t=0;o=[];i=e.current.getDay()-2;s=e.current.getMonth();u=[];for(;;){r=angular.copy(e.current);r.setDate(t-i);o.push({date:r.getTime(),day:r.getDate(),isToday:Math.round((r-n)/864e5)===0,isWeekEnd:t%7>4,isPrev:t<=i,isNext:t>i&&r.getMonth()!==s});if(t%7===6){e.rows.push({cells:angular.copy(o)});o=[]}if(t>i&&r.getMonth()!==s&&r.getDate()<8&&t%7===6)break;u.push(t++)}return u};e.prev=function(){e.current.setMonth(e.current.getMonth()-1);return e.update()};e.next=function(){e.current.setMonth(e.current.getMonth()+1);return e.update()};e.setDate=function(t){t.isPrev&&e.prev();t.isNext&&e.next();return e.tmpTask.due=t.date!==e.tmpTask.due?t.date:!1};e.remove=function(){return e.tmpTask.due=!1};return e.update()}}});r=angular.module("synappseFilters",[]);r.filter("DropboxUIDToUsername",["Projects",function(e){return function(t,n){var r,i,s,o;i=e.readProject(n);s=function(){var e,n,r,s;r=i.users;s=[];for(e=0,n=r.length;e<n;e++){o=r[e];o.uid===t&&s.push(o.name)}return s}()[0];if(!s)return"Unnamed";r=s.substring(0,s.indexOf(" "));return~function(){var e,n,r,s;r=i.users;s=[];for(e=0,n=r.length;e<n;e++){o=r[e];o.uid!==t&&s.push(o.name.substring(0,o.name.indexOf(" ")))}return s}().indexOf(r)?s.substring(0,2+s.indexOf(" "))+".":r}}]);r.filter("assignee",function(){return function(e){return e.substr(0,1)}});r.filter("unseen",function(){return function(e){var t,n,r,s,o,u;s=e||[];u=[];for(n=0,r=s.length;n<r;n++){t=s[n];(o=DB.user.uid,i.call(t.seen,o)<0)&&u.push(t)}return u}});r.filter("tasksDue",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.due!==!1&&t.status<4&&i.push(t)}return i}});r.filter("tasksNoDue",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.due===!1&&t.status<4&&i.push(t)}return i}});r.filter("tasksArchived",function(){return function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++){t=e[n];t.status===4&&i.push(t)}return i}});r.filter("miniDate",function(){return function(e){var n,r;if(e===!1)return"";r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];e=t(e);n=Math.round((e-t())/864e5);return n===0?"Today":r[e.getMonth()]+" "+e.getDate()}});r.filter("month",function(){return function(e){var n;n=["January","February","March","April","May","June","July","August","September","October","November","December"];e=t(e);return n[e.getMonth()]+" "+e.getFullYear()}});r.filter("relativeDate",function(){return function(e){var t;t=Math.floor((new Date-e)/1e3);switch(!1){case!(t<120):return"about one minute ago";case!(t>=120&&t<3600):return Math.floor(t/60)+" minutes ago";case!(t>=3600&&t<7200):return Math.floor(t/3600)+" hour ago";case!(t>=7200&&t<86400):return Math.floor(t/3600)+" hours ago";case!(t>=86400&&t<172800):return"yesterday";case!(t>=86400&&t<2592e3):return Math.floor(t/86400)+" days ago";default:return"on "+smartDate(e)}}});r.filter("smartDate",function(){return function(e){var n,r,i,s;i=["January","February","March","April","May","June","July","August","September","October","November","December"];n=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];e=t(e);s=t();r=Math.round((e-s)/864e5);switch(!1){case e.getFullYear()===s.getFullYear():return i[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear();case r!==0:return"Today";case r!==1:return"Tomorrow";case!(0<r&&r<7):return n[(s.getDay()+r-1)%7];default:return i[e.getMonth()]+" "+e.getDate()}}});r=angular.module("synappseServices",[]);r.factory("Projects",function(){var t,r;t=localStorage.projects?angular.fromJson(localStorage.projects):[];r={};r.cache=function(){return localStorage.projects=angular.toJson(t)};r.getProjects=function(){return t};r.createProject=function(i){var s,o,u,a,f,l;u=!1;a=i.toLowerCase();for(f=0,l=t.length;f<l;f++){o=t[f];o.name===a&&(u=!0)}if(u!==!0){s=e(2,function(){var e,n,r;r=[];for(e=0,n=t.length;e<n;e++){o=t[e];r.push(o.id)}return r}());console.log("Creating task with id : ",s);t.push({name:i,id:s,folder:DB.folder+n(i)+"/",slug:n(i),users:[],alerts:[],tasks:[],deletedTasks:[],comments:[],deletedComments:[]});return r.cache()}console.log("Project already exists !")};r.readProject=function(e){var n;return function(){var r,i,s;s=[];for(r=0,i=t.length;r<i;r++){n=t[r];n.id===e&&s.push(n)}return s}()[0]||{}};r.findProject=function(e){var n;return function(){var r,i,s;s=[];for(r=0,i=t.length;r<i;r++){n=t[r];n.slug===e&&s.push(n)}return s}()[0]||{}};r.getUserByUID=function(e,n){var r,i,s,o,u,a;for(s=0,u=t.length;s<u;s++){r=t[s];if(r.id===e)for(o=0,a=r.length;o<a;o++){i=r[o];if(i.uid===n)return i}}};r.createTask=function(n,i){var s,o,u,a;for(u=0,a=t.length;u<a;u++){s=t[u];if(s.id!==n)continue;i.id=e(2,function(){var e,t,n,r;n=s.tasks;r=[];for(e=0,t=n.length;e<t;e++){o=n[e];r.push(o.id)}return r}());i.date=(new Date).getTime();i.edit=(new Date).getTime();s.tasks.push(i)}return r.cache()};r.editTask=function(e,n,i){var s,o,u,a,f,l,c,h,p;for(f=0,c=t.length;f<c;f++){o=t[f];if(o.id===e){p=o.tasks;for(l=0,h=p.length;l<h;l++){u=p[l];if(u.id!==n)continue;i.edit=(new Date).getTime();for(s in i){a=i[s];s!=="id"&&s!=="date"&&(u[s]=a)}}}}return r.cache()};r.deleteTask=function(e,n){var s,o,u,a;for(u=0,a=t.length;u<a;u++){s=t[u];if(s.id!==e)continue;i.call(s.deletedTasks,n)<0&&s.deletedTasks.push(n);s.tasks=angular.copy(function(){var e,t,n,r,u;n=s.tasks;u=[];for(e=0,t=n.length;e<t;e++){o=n[e];(r=o.id,i.call(s.deletedTasks,r)<0)&&u.push(o)}return u}())}return r.cache()};r.createComment=function(n,i){var s,o,u,a;console.log(n,i);for(u=0,a=t.length;u<a;u++){o=t[u];if(o.id!==n)continue;i.id=e(2,function(){var e,t,n,r;n=o.comments;r=[];for(e=0,t=n.length;e<t;e++){s=n[e];r.push(s.id)}return r}());i.date=(new Date).getTime();i.edit=(new Date).getTime();o.comments.push(i)}return r.cache()};r.deleteComment=function(e,n){var s,o,u,a;for(u=0,a=t.length;u<a;u++){o=t[u];if(o.id!==e)continue;i.call(o.deletedComments,n)<0&&o.deletedComments.push(n);o.comments=angular.copy(function(){var e,t,n,r,u;n=o.comments;u=[];for(e=0,t=n.length;e<t;e++){s=n[e];(r=s.id,i.call(o.deletedComments,r)<0)&&u.push(s)}return u}())}return r.cache()};r.alert=function(n,i,s){var o,u,a,f;for(a=0,f=t.length;a<f;a++){u=t[a];if(u.id!==n)continue;u.alerts==null&&(u.alerts=[]);u.alerts.push({id:e(2,function(){var e,t,n,r;n=u.alerts;r=[];for(e=0,t=n.length;e<t;e++){o=n[e];r.push(o.id)}return r}()),text:i,seen:[s]})}return r.cache()};r.seen=function(e,n,s){var o,u,a,f,l,c,h;for(a=0,l=t.length;a<l;a++){u=t[a];if(u.id===e){h=u.alerts;for(f=0,c=h.length;f<c;f++){o=h[f];o.id===n&&i.call(o.seen,s)<0&&o.seen.push(s)}}}return r.cache()};return r});r=angular.module("synappseHelpers",[]);t=function(e){e=e?new Date(e):new Date;e=new Date(e.getFullYear(),e.getMonth(),e.getDate());return e};e=function(e,t,n){var r;n==null&&(n="");return function(){var s;s=[];while(r==null||i.call(t,r)>=0)s.push(r=n+Math.random().toString(36).substr(2,e));return s}().toString()};n=function(e){var t,n,r,i,s,o,u;o=["àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;","aaaaaeeeeiiiiooooouuuunc------",e.toLowerCase()],t=o[0],r=o[1],e=o[2];u=t.length;for(i=0,s=u.length;i<s;i++){n=u[i];e=e.replace(new RegExp(t.charAt(n),"g"),r.charAt(n))}return e.replace(/^\s+|\s+$/g,"").replace(/[^-a-zA-Z0-9\s]+/ig,"").replace(/\s/gi,"-")}}).call(this);