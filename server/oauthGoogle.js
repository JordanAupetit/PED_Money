var Cookies = require( "cookies" )
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./oauth.js');

 module.exports = function (app, userModel) {
app.use(passport.initialize());

app.get('/auth/google',
passport.authenticate('google',  { scope : ['profile', 'email'] }),
function(req, res){
});
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
    res.redirect('/#/login?username='+req.user.username+'&token='+req.user.token)
});


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// config
 passport.use(new GoogleStrategy({

        clientID        : config.google.clientID,
        clientSecret    : config.google.clientSecret,
        callbackURL     : config.google.callbackURL,
    },

    // google will send back the token and profile
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
      tokentiers : accessToken,
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