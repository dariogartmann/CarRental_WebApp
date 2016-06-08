var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Car = mongoose.model('Car');
var Reservation = mongoose.model('Reservation');
var User = mongoose.model('User');
var auth = jwt({secret: 'IAMNOTSANTASECRET', userProperty: 'payload'});

var router = express.Router();

// GET /reservations
//=================================================
router.get('/reservations', auth, function(req, res, next) {
    Reservation.find({}).populate('car').populate('user').exec(function(err, reservations) {
        if(err){ return next(err); }

        res.json(reservations); 
    });
});

// POST /reservations
//=================================================
router.post('/reservations', auth, function(req, res, next) {
    var reservation = new Reservation(req.body);

    reservation.save(function(err, post){
        if(err){ return next(err); }
        
        res.json(post);
    });
});


// preload reservations
//=================================================
router.param('reservations', function(req, res, next, id) {
    var query = Reservation.findById(id);

    query.exec(function (err, reservation){
        if (err) { return next(err); }
        if (!car) { return next(new Error('can\'t find reservation')); }

        req.reservation = reservation;
    return next();
  });
});

// GET /reservations/:reservation
//=================================================
router.get('/reservations/:reservation', auth, function(req, res, next) {
  res.json(req.reservation);
});

// DELETE /reservations/:reservation
//=================================================
router.delete('/reservations/:reservation', auth, function(req, res, next) {
    var query = Reservation.remove({ _id: req.reservation.id });
    if(query.exec()) {
        res.send("success");
    }else {
        res.send("error");
    }
});

module.exports = router;
