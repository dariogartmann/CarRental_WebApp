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
router.get('/posts/:car', function(req, res) {
  res.json(req.car);
});


module.exports = router;
