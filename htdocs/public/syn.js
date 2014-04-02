// Generated by CoffeeScript 1.6.3
var DB,load,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};load=function(e,t){var n,r,i;t==null&&(t=!1);if(e instanceof Array)return load(e.shift(),e.length?function(){return load(e,t)}:t);if(typeof e=="string"){n=e.match(/\.css(\?.*)?$/);e+="?t="+(new Date).getTime();r=document.createElement(n?"link":"script");n?(i=["text/css","stylesheet",e],r.type=i[0],r.rel=i[1],r.href=i[2]):r.src=e;r.addEventListener("load",function(e){if(t)return t(null,e)});return(n?document.body:document.head).appendChild(r)}};DB={folder:"Synappse/",file:"_project.json",user:localStorage.user?JSON.parse(localStorage.user):{},client:typeof Dropbox!="undefined"&&Dropbox!==null?new Dropbox.Client({key:"d1y1wxe9ow97xx0"}):{},auth:function(e){var t;e==null&&(e=!1);t=this;return localStorage.user&&!e?t.init():this.client.authenticate({interactive:e},function(e,n){if(n.isAuthenticated())return t.init()})},updateUser:function(){var e;e=this;return this.client.getAccountInfo(function(t,n){e.user={name:n.name,email:n.email,uid:n.uid};return localStorage.user=JSON.stringify(e.user)})},init:function(){var e;e=this;return load(["//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.js","//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-route.min.js","//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-touch.min.js","//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-animate.js","public/lib/angular-translate.min.js","public/app.js"],function(){angular.bootstrap(document,["synappseApp"]);return e.client.isAuthenticated()?e.updateUser():e.client.authenticate({interactive:!1},function(t,n){return e.updateUser()})})},readFolder:function(e,t){var n;n=this;return this.client.readdir(e,function(r,i,s,o){return r?n.client.mkdir(e,function(e,n){e&&console.log(e);return t([])}):t(o)})},checkProject:function(e,t,n){var r;r=this;return this.client.readFile(e+this.file,function(i,s,o){var u,a;if(i&&i.status===404){u=e.substring(r.folder.length+1).replace(/\/$/,"");a={name:u,id:generateID(3,t,r.user.uid+"_"),folder:e,slug:slug(u),users:[r.user],alerts:[],tasks:[],deletedTasks:[],comments:[],deletedComments:[]};return r.saveProject(a,function(){return n(a)})}a=angular.fromJson(decodeURIComponent(escape(s)));a.folder=e;return n(a)})},renameProject:function(e,t){var n;n=this;return this.client.move(e,t,function(e,t){if(e)return console.log(e)})},saveProject:function(e,t){t==null&&(t=!1);console.log(e);return this.client.writeFile(e.folder+this.file,unescape(encodeURIComponent(angular.toJson(e))),function(e,n){e&&console.log(e);if(t)return t()})},checkLocalProjects:function(e,t,n){var r,i,s,o,u,a,f,l,c,h,p;i=function(){var t,n,r;r=[];for(t=0,n=e.length;t<n;t++){s=e[t];r.push(s.id)}return r}();for(a=0,l=e.length;a<l;a++){s=e[a];if(h=s.folder,__indexOf.call(t,h)<0)if(s.id.length===2){s.id=generateID(3,i,this.user.uid+"_");s.users.push(this.user);p=s.tasks;for(f=0,c=p.length;f<c;f++){u=p[f];u.id=generateID(3,function(){var e,t,n,r;n=s.tasks;r=[];for(e=0,t=n.length;e<t;e++){o=n[e];r.push(o.id)}return r}())}this.saveProject(s)}else{r=i.indexOf(s.id);~r&&e.splice(r,1)}}return n()},sync:function(e,t){var n;t==null&&(t=!1);if(!this.client.isAuthenticated())return t?t():void 0;n=this;return this.readFolder(this.folder,function(r){var i,s,o,u,a,f,l,c,h;a=function(){var e,t,n;n=[];for(e=0,t=r.length;e<t;e++){i=r[e];i.isFolder&&n.push(i)}return n}();f=a.length;if(!f)return n.checkLocalProjects(e,[],t);s=function(){var t,n,r;r=[];for(t=0,n=e.length;t<n;t++){o=e[t];r.push(o.id)}return r}();h=[];for(l=0,c=a.length;l<c;l++){u=a[l];h.push(n.checkProject(u.path+"/",s,function(r){var i,u,l;f--;if(l=r.id,__indexOf.call(s,l)<0)e.push(r);else{u=function(){var t,n,i;i=[];for(t=0,n=e.length;t<n;t++){o=e[t];o.id===r.id&&i.push(o)}return i}()[0];n.updateProject(u,r)}if(!f)return n.checkLocalProjects(e,function(){var e,t,n;n=[];for(e=0,t=a.length;e<t;e++){i=a[e];n.push(i.path+"/")}return n}(),function(){if(t)return t()})}))}return h})},updateProject:function(e,t){var n,r,i,s,o,u,a,f,l,c;n=this.folder+slug(e.name)+"/";t.folder!==n&&this.renameProject(t.folder,n);e.folder=n;e.users=function(){var e,n,r,s;r=t.users;s=[];for(e=0,n=r.length;e<n;e++){i=r[e];s.push(i)}return s}();if(f=this.user.uid,__indexOf.call(function(){var t,n,r,s;r=e.users;s=[];for(t=0,n=r.length;t<n;t++){i=r[t];s.push(i.uid)}return s}(),f)>=0){l=e.users;for(s=0,u=l.length;s<u;s++){i=l[s];i.uid===this.user.uid&&(i=this.user)}}else e.users.push(this.user);e.tasks=this.solveConflicts(e.tasks,t.tasks,e.deletedTasks);e.deletedTasks=[];c=e.tasks;for(o=0,a=c.length;o<a;o++){r=c[o];delete r.oldID}return this.saveProject(e)},solveConflicts:function(e,t,n){var r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E;r=function(){var e,n,r;r=[];for(e=0,n=t.length;e<n;e++){o=t[e];r.push(o.id)}return r}();e=angular.copy(function(){var t,n,i,u;u=[];for(s=t=0,n=e.length;t<n;s=++t){o=e[s];(o.id.length===2||(i=o.id,__indexOf.call(r,i)>=0))&&u.push(o)}return u}());for(c=0,v=e.length;c<v;c++){o=e[c];if(o.id.length!==2)continue;o.oldID=o.id;o.author=DB.user.uid;o.id=generateID(3,r)}for(h=0,m=e.length;h<m;h++){f=e[h];if(f.id.length===3&&(b=f.id,__indexOf.call(r,b)>=0))for(p=0,g=t.length;p<g;p++){i=t[p];if(f.id===i.id&&f.edit<=i.edit)for(u in i){l=i[u];f[u]=l}}}a=function(){var t,n,r;r=[];for(t=0,n=e.length;t<n;t++){o=e[t];r.push(o.id)}return r}();for(d=0,y=t.length;d<y;d++){o=t[d];(w=o.id,__indexOf.call(a,w)<0)&&(E=o.id,__indexOf.call(n,E)<0)&&e.push(o)}return e},getShareUrl:function(e,t){t==null&&(t=!1);return this.client.makeUrl(e,function(e,n){if(t)return t(n.url)})}};(function(){DB.auth();return document.getElementById("auth").addEventListener("click",function(){return DB.auth(!0)})})();