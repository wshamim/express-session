var mongoose = require('mongoose');

// set up a mongoose model
var UserSchema = new mongoose.Schema({
	name: String,
	password: String
});

mongoose.model('User', UserSchema);
