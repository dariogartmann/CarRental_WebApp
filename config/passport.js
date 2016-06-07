var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* 
Setup user authentication using passport, an open source tool 
If a wrong username or password is entered, return an error message
*/
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, user);
        });
    }
));