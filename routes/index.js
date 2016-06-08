var express = require('express');
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('express-jwt');


var Car = mongoose.model('Car');
var User = mongoose.model('User');

var auth = jwt({secret: 'IAMNOTSANTASECRET', userProperty: 'payload'});


var router = express.Router();

// GET home page
//=================================================
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// POST /cars
//=================================================
router.post('/cars', auth, function(req, res, next) {
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



// GET /cars
//=================================================
router.get('/cars', auth, function(req, res, next) {
    Car.find(function(err, cars) {
        if(err){ return next(err); }

        res.json(cars); 
    });
});


// GET /cars/available
// get all unreserved cars
//=================================================
router.get('/cars/available', auth, function(req, res, next) {
    Car.find({isCurrentlyReserved: {$ne: true}}, function(err, cars) {
        if(err) { return next(err); }
        
        res.json(cars);
    });
});

// GET /cars/id/:id
//=================================================
router.get('/cars/id/:id', auth, function(req, res, next) {
    Car.findOne({id : req.params.id}, function(err, car) {
        if(err) {return next(err); }
            
        console.log(car);
        
        res.json(car);
    });
});

// PUT /cars
// reserve a car
//=================================================
router.put('/cars/reserve/:car_id', auth, function(req, res, next) {
    Car.findOne({id: req.params.car_id}, function(err, car) {
        car.isCurrentlyReserved = true;
        
        car.save();
            return res.status(200).json({message: 'Updated ' +car.title});
    })
});

// GET /cars/:car
//=================================================
router.get('/cars/:car', auth, function(req, res, next) {
    res.json(req.car);
});

// DELETE /cars/:car
//=================================================
router.delete('/cars/:car', auth, function(req, res, next) {
    var query = Car.remove({ _id: req.car.id });
    if(query.exec()) {
        return res.status(200).json({message: 'Deleted ' + req.car.title});
    }else {
        return res.status(500).json({message: 'Error while deleting ' + req.car.title});
    }
    
});






module.exports = router;
