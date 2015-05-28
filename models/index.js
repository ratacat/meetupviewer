var mongoose = require("mongoose");
mongoDb = process.env.MEETUPVIEWER_MONGO || process.env.MONGOLAB_URI
console.log("mongoDb"+mongoDb);
mongoose.connect(mongoDb);
module.exports.User = require("./user.js");
//module.exports.Book = require("./book.js");