var REPL = require("repl");
var api = require("./index.js");
var data = require("./data.json");


var repl = REPL.start("api > ");
repl.context.api = api;
repl.context.data = data;

repl.on("exit", function () {
  console.log("GOODBYE!!");
  process.exit();
});

//var code = require("node-codein");