var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/libary_app");
module.exports.User = require("./user.js");
//module.exports.Book = require("./book.js");