var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {}

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
        };  
          
        cb(null, profile);
    }
));

//app routes
app.get('/', function (req, res) {
    res.render('content', { user: req.user });
});

app.get('/userlogged', function (req, res) {
    res.render('userlogged', { user: googleProfile });
    console.log(googleProfile);
});
//Passport routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/userlogged',
        failureRedirect: '/'
    }));

app.listen(3000);