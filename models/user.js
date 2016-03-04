var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../config');

// set up a mongoose model
var UserSchema = new mongoose.Schema({
	email: String,
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret);
};

mongoose.model('User', UserSchema);
