var express = require("express"), 
	body = require ("body-parser"), 
	path = require("path"),
	ejs = require("ejs"),
	db = require("./models"),
	session = require("express-session"),
	_ = require("underscore"),
	S = require('string'),
	Data = require("./data.js");

require("datejs");
var app = express();
var views = path.join(__dirname,"views");
//app.set("view engine", "ejs");  

var data = new Data();
var d1 = [], d2 = [],d3 = [];
var useRealData = process.env.USE_REAL_DATA || false;
var devSession = process.env.DEVSESSION || false;



if (useRealData) {
	console.log("usd:"+useRealData);
	//console.log(process.env.USE_REAL_DATA);
	data.getAll('',function(err,events,d1){
		d3 = events;
		d2 = data.prepare(events);
	});
} else {
	//use disk data
	d2 = data.prepare(require("./data.json"));
}

// var REPL = require("repl");
// var repl = REPL.start("api > ");
// repl.context.data = data;

app.use(express.static(path.join(process.cwd(),'public')));
app.use(express.static(path.join(process.cwd(),'bower_components')));

app.use(body.urlencoded({extended: true}));
app.use(session({
	secret: 'super secret',
	resave: false,
	saveUninitialized: true
}));

app.use ("/",function(req,res,next) {
	console.log("req /");
if (devSession && !req.session.userId ) {
	console.log("Bypassing login for dev session");
	req.session.userId = "5563629ce53b73e15f2b51ba";
}

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

	req.currentUser(function(err,user) {
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
				if (!err) {
					follows = _.uniq(follows);
					res.send(JSON.stringify(follows))
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
	console.log("POST /events received");
	var city = req.query.city;
	var follows = [];
	var results = d2;
	//console.log("req.query: "+ JSON.stringify(req.query));
	//console.log("Number of starting results:"+results.length);

	if (req.query.city) {  
		console.log("city query found");
		results = _.filter(d2,function(event){
			return S(event.city).contains(req.query.city);
		});
	} 

	if (req.query.follows) {
		console.log("follows query found");
		if (req.session.userId) {
			db.User.getFollows(req.session.userId,function(err,follows) {
				if (!err) {
					follows = _.uniq(follows);

					//console.log("database found follows: "+follows);
					//console.log("follows type: "+ typeof follows);
					console.log("Number of results, pre follow:"+results.length);
					results = _.filter(results,function(event){
						return follows.indexOf(event.groupId.toString()) !== -1;});
					console.log("Number of results: "+results.length);
					res.send(results);
				} else {
					console.log(err);
				}
			});
			// user.follow('',function(err,groups) {
			// 		res.send(JSON.stringify(groups));
		
		}

	}
		
	if (!req.query.follows) {
		console.log("Number of final results" +results.length);
		res.send(results);}
});

var port = process.env.PORT || 3000;

app.listen(port,function() {
	console.log('express is');
})