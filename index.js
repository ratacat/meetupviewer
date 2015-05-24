var express = require("express");
var body = require ("body-parser");
var path = require("path");
var ejs = require("ejs");


var app = express();
var views = path.join(__dirname,"views");

app.use(express.static(path.join(process.cwd(),'public')));
app.use(body.urlencoded({extended: true}));
app.get ("/",function(req,res) {
	var homePath = path.join(views, "home.ejs");
	console.log(homePath);
	res.render(homePath);
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
			res.redirect("/signup");
		}
	});
});


app.listen(3000,function() {
	console.log('express is');
})