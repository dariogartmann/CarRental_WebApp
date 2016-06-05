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

// GET /username/:username
//=================================================
router.get('/username/:name', auth, function(req, res, next) {
    User.findOne({username: req.params.name}, function(err, user) {
        if(err) {return next(err);} 
        res.json(user);
    });
});

// GET /users/:user
//=================================================
router.get('/users/:user', auth, function(req, res, next) {
  res.json(req.user);
});


// PUT /users
//=================================================
router.put('/users', auth, function(req, res, next) {
    
    var userToUpdate = new User(req.body);
    
    User.findByIdAndUpdate(userToUpdate.id, 
                           { name: userToUpdate.name,
                            mail: userToUpdate.mail,
                            address: userToUpdate.address,
                            city: userToUpdate.city,
                            country: userToUpdate.country
                           }, function(err, user) {
        if (err) throw err;
        return res.status(200).json({message: 'Updated ' +user.username});
    });
});





// DELETE /users/:user
//=================================================
router.delete('/users/:user', auth, function(req, res, next) {
    var query = User.remove({ _id: req.user.id });
    if(query.exec()) {
        return res.status(200).json({message: 'Success'});
    }else {
        return res.status(500).json({message: 'Error'});
    }
});


module.exports = router;
