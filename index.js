var express = require("express");
var body = require ("body-parser");
var path = require("path");


var app = express();

app.use(body.urlencoded({extended: true}));
app.get ("/",function(req,res) {
	res.send("oh yes");
})




app.listen(3000,function() {
	console.log('express is');
})