var express = require('express');
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('express-jwt');

var User = mongoose.model('User');

var auth = jwt({secret: 'IAMNOTSANTASECRET', userProperty: 'payload'});



var router = express.Router();


// AUTHENTICATION ROUTES
//=================================================
router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password || !req.body.name || !req.body.mail || !req.body.address || !req.body.city || !req.body.country || !req.body.bankAccount ){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;
    user.name = req.body.name;
    user.mail = req.body.mail;
    user.address = req.body.address;
    user.city = req.body.city;
    user.country = req.body.country;
    user.isAdmin = false;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});


module.exports = router;