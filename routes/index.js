var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var passport = require('passport');
var session = require('express-session');

//---- Passport Configutration
router.use(session({ secret: 'folio3techsessionbasedonexpress' })); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions

// render profile page in case user is logged in and session is valid
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    user: req.user              // get the user out of session and pass to template
  });
});

// handle the facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// clear the session variables and redirect to main screen.
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
