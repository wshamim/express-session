var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  User.find(function(err, users){
    res.json(users);
  })
});

router.get('/setup', function(req, res) {

	// create a sample user
	var admin = new User({
		name: 'admin',
		password: 'click123',
		admin: true
	});
	admin.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ message: 'User Saved.', user: admin });
	});
});

module.exports = router;
