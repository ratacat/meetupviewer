var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		required: true,
		index: {
			unique: true
		}
	},
	passwordDigest: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	}
});

userSchema.statics.authenticate = function(params,cb) {
	this.findOne({
		email: params.email
	}, function(err, user) {
		user.checkPswrd(params.password,cb);
	});
};

userSchema.statics.checkPswrd = function(password,cb) {
	var user = this;
	bcrypt.compare(password,
		this.passwordDigest, function(err, isMatch) {
			if (isMatch) {
				cb(null,user);
			} else {
				cb("oops", null);
			}
		});
};