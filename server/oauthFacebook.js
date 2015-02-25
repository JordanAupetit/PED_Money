var Cookies = require( "cookies" )
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js');

 module.exports = function (app, userModel) {
app.use(passport.initialize());

app.get('/auth/facebook',
passport.authenticate('facebook',  { scope: [ 'email' ] }),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
    var cookies = new Cookies( req, res);
    cookies.set('token', req.user.token,{ httpOnly: false } );
  cookies.set('user', req.user.username,{ httpOnly: false } );
 res.redirect('/#/compte');
});


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// config
 passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : config.facebook.clientID,
        clientSecret    : config.facebook.clientSecret,
        callbackURL     : config.facebook.callbackURL

    },

    // facebook will send back the token and profile
   function(accessToken, refreshToken, profile, done) {
userModel.findOne({ clientID: profile.id }, function(err, user) {
  if(err) { console.log(err); }
  if (!err && user != null) {
    done(null, user);
  } else {
    var user = new userModel({
      clientID: profile.id,
      username: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      token : accessToken,
      email : profile.emails[0].value
     // created: Date.now()
    });
    user.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("saving user ...");
        done(null, user);
      };
    });
  };
});
}));






}