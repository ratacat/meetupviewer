var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/meetup");
module.exports.User = require("./user.js");
//module.exports.Book = require("./book.js");