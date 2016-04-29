var express = require('express');
var mongoose = require('mongoose');

var Car = mongoose.model('Car');

var router = express.Router();


// GET /cars
//=================================================
router.get('/cars', function(req, res, next) {
    Car.find(function(err, cars) {
        if(err){ return next(err); }

        res.json(cars); 
    });
});

// POST /cars
//=================================================
router.post('/cars', function(req, res, next) {
  var car = new Car(req.body);

  car.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


// preload cars
//=================================================
router.param('car', function(req, res, next, id) {
  var query = Car.findById(id);

  query.exec(function (err, car){
    if (err) { return next(err); }
    if (!car) { return next(new Error('can\'t find car')); }

    req.car = car;
    return next();
  });
});

// GET /cars/:car
//=================================================
router.get('/cars/:car', function(req, res) {
  res.json(req.car);
});


module.exports = router;
