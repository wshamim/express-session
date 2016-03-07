var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var expjwt = require('express-jwt');
var config = require('../config');
var authenticate = expjwt({secret: config.secret, userProperty: 'payload'});

/* GET users listing. */
router.get('/',authenticate, function(req, res, next) {
  //res.send('respond with a resource');
  User.find(function(err, users){
    res.json(users);
  })
});

router.get('/setup', function(req, res) {

	// create a sample user
	var admin = new User({
		email: 'admin@folio3.com',
		password: 'click123'
	});
	admin.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ message: 'User Saved.', user: admin });
	});
});

router.post('/signup', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    User.findOne({name: req.body.email}, function (err, user) {
        if (user) {
            return res.status(401).json({message: 'Email already exists in our records.'});
        }

        var user = new User();
        user.email = req.body.email;
        user.setPassword(req.body.password);

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            return res.json({token: user.generateJWT()});
        });
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if(err){ return next(err); }
        if (!user) {
            return res.json( { message: 'Email not found in our records.' });
        }
        if (!user.validPassword(req.body.password)) {
            return res.json( { message: 'Incorrect password.' });
        }
        //return res.json(user);
        return res.json({token: user.generateJWT()});
    });
});

module.exports = router;
