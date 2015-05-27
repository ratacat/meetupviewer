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

userSchema.statics.getFollows = function(userId,cb) {
	this.findOne({ _id: userId}, function(err,user) {
		if (err) {
			cb(err,null);
		} else {
			cb(null,user.groups);
		}
	});
}

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

userSchema.methods.follow = function(groupId,cb) {
	//console.log("follow-this:  "+JSON.stringify(this));
	console.log(typeof groupId);
	if (typeof groupId === 'string') {
		console.log("group id is string");
		this.groups.push(groupId);
		this.save(function(err) {
			console.log("mongodb callback on this.save, err is:"+err);
			cb(err,this.groups);
			// if (err) return handleError(err)
			// console.log("success!");
		});
	}
}

var User = mongoose.model("User",userSchema);
module.exports = User;