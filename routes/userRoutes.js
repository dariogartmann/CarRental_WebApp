var express = require('express');
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('express-jwt');


var User = mongoose.model('User');

var auth = jwt({secret: 'IAMNOTSANTASECRET', userProperty: 'payload'});


var router = express.Router();


// GET /users 
//=================================================
router.get('/users', auth, function(req, res, next) {
    User.find(function(err, users) {
        if(err){ return next(err); }

        res.json(users); 
    });
});

// preload reservations
//=================================================
router.param('users', function(req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }

        req.user = user;
    return next();
  });
});

// GET /users/:user
//=================================================
router.get('/users/:user', auth, function(req, res, next) {
  res.json(req.user);
});

// DELETE /reservations/:reservation
//=================================================
router.delete('/users/:user', auth, function(req, res, next) {
    var query = User.remove({ _id: req.user.id });
    if(query.exec()) {
        res.send("success");
    }else {
        res.send("error");
    }
});


module.exports = router;
