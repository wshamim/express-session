module.exports = {
    'database'      : 'mongodb://localhost/express-session',
    'secret'        : 'folio3techsessionbasedonexpress',
    'facebookAuth'  : {
  		'clientID' 		: '1728509630701638', // your App ID
  		'clientSecret': '1fe10bf970204c1b5afe3d1c4487295d', // your App Secret
  		'callbackURL' : 'http://localhost:9292/auth/facebook/callback'
  	}
};
