var REPL = require("repl");
var api = require("./api.js");
var db = require("./models");

var repl = REPL.start("api > ");
repl.context.api = api;
repl.context.db = db;

repl.on("exit", function () {
  console.log("GOODBYE!!");
  process.exit();
});

//var code = require("node-codein");
