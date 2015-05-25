var express = require("express");
var body = require ("body-parser");
var path = require("path");
var ejs = require("ejs");
var db = require("./models");
var session = require('express-session');

var app = express();
var views = path.join(__dirname,"views");

app.use(express.static(path.join(process.cwd(),'public')));
app.use(body.urlencoded({extended: true}));
app.use(session({
	secret: 'super secret',
	resave: false,
	saveUninitialized: true
}));

app.use ("/",function(req,res,next) {

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
      })
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }

next();
	// var homePath = path.join(views, "home.ejs");
	// console.log(homePath);
	// res.render(homePath);
});

app.get("/signup", function(req,res) {
	var signedupPath = path.join(views, "signup.ejs");
	res.render(signedupPath);
});

app.post("/users",function(req,res) {
	var newUser = req.body.user;
	db.User.createSecure(newUser,function(err,user) {
		if (user) {
			res.send(user);
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
		res.send(user + "<br>" + "has logged in!");
	});
});

app.get("/viewer",function(req,res) {
	var viewerPath = path.join(views, "viewer.ejs");
	res.render(viewerPath);
})

app.listen(3000,function() {
	console.log('express is');
})