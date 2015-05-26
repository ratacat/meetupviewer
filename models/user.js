var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var confirm = function (pswrd, pswrdCon) {
	return pswrd === pswrdCon;
};

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
	groups: [{
		type: String
	}]
});

userSchema.statics.authenticate = function(params,cb) {
	console.log(params);
	this.findOne({
		email: params.email
	}, function(err, user){
      if (user === null){
        throw new Error("Username does not exist");
      } else if (user.checkPassword(params.password, cb)){
        cb(null, user);
      }

    })
};

userSchema.methods.checkPassword = function(password,cb) {
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

userSchema.statics.createSecure = function(params,cb) {
	var isConfirmed;

	isConfirmed = confirm(params.password,params.password_confirmation);

	if (!isConfirmed) {
		return cb("Password should Match", null);
	}

	var that = this;

	bcrypt.hash(params.password,12,function(err,hash) {
		params.password_digest = hash;
		that.create({
			email: params.email,
			passwordDigest: params.password_digest
		}, cb);
	});
};

var User = mongoose.model("User",userSchema);
module.exports = User;