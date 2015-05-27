var express = require("express");
var body = require ("body-parser");
var path = require("path");
var ejs = require("ejs");
require("datejs");
var db = require("./models");
var session = require("express-session");
var api = require("./api.js");
var _ = require("underscore");

var app = express();
var views = path.join(__dirname,"views");
//app.set("view engine", "ejs");  

app.use(express.static(path.join(process.cwd(),'public')));
app.use(express.static(path.join(process.cwd(),'bower_components')));

app.use(body.urlencoded({extended: true}));
app.use(session({
	secret: 'super secret',
	resave: false,
	saveUninitialized: true
}));

app.use ("/",function(req,res,next) {
req.session.userId = "5563629ce53b73e15f2b51ba";

  req.login = function (user) {
    req.session.userId = user._id;
    console.log(user.email + " is logging in");
  };

  req.currentUser = function (cb) {
     db.User.
      findOne({
          _id: req.session.userId
      },
      function (err, user) {
        req.user = user;
        cb(null, user);
      });
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }

 //  if (!req.currentUser){
	// 	res.redirect("/login");
	// }

	//console.log(JSON.stringify(req));
	req.currentUser(function(err,user) {
		//req.currentSessionUser = user;
		//console.log
		//console.log("currentUser:"+user);
		//console.log("error:"+err);
		//console.log("req.session:"+JSON.stringify(req.session));
	});

next();
	// var homePath = path.join(views, "home.ejs");
	// console.log(homePath);
	// res.render(homePath);
});

app.get("/", function(req,res) {
	// if (req.session.userId) {
		res.redirect("/viewer");
})

app.get("/signup", function(req,res) {
	var signedupPath = path.join(views, "signup.ejs");
	res.render(signedupPath);
});

app.post("/users",function(req,res) {
	var newUser = req.body.user;
	db.User.createSecure(newUser,function(err,user) {
		if (user) {
			res.redirect("/");
		} else {
			console.log(err);
			res.redirect("/signup");
		}
	});
});

app.get("/login", function(req,res) {
	var loginPath = path.join(views, "login.ejs");
	res.render(loginPath);
});

app.post("/login", function(req,res) {
	var user = req.body.user;
	//console.log("req: "+req)

	db.User.authenticate(user, function(err,user) {
		//console.log(user + "logging in");
		req.login(user);
		//res.send(user + "<br>" + "has logged in!");
		res.redirect("/viewer");
	});
});

app.get("/viewer",function(req,res) {
	var viewerPath = path.join(views, "viewer.html");
	res.sendFile(viewerPath);
});

app.post("/follow/:groupId", function(req,res) {
	req.currentUser(function(err,user) {
		console.log("currentUser:" + user);
		//console.log("user:" + user);
		if (user) {
			user.follow(req.params.groupId,
				function(err,groups) {
					console.log("POST /follow/:"+req.params.groupId + "  :"+user.email);
					res.sendStatus(201,groups);
			});
		} else {
			console.log("POST /follow/:"+req.params.groupId + "  :no user");
			res.sendStatus(201,[]);
		}
	});
});

app.get("/follows", function(req,res) {
	req.currentUser(function(err,user) {
		//console.log("user:" + user);
		if (user) {
			db.User.getFollows(req.session.userId,function(err,follows) {
				if (!err) {res.send(JSON.stringify(follows))
				} else {
					console.log(err);
				}
			});
			// user.follow('',function(err,groups) {
			// 		res.send(JSON.stringify(groups));
		
		} else {
			res.send("[]");
		}
	});
});

app.get("/events", function(req,res) {
	res.send(api.data);
});

app.listen(3000,function() {
	console.log('express is');
})