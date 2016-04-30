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


// GET /cars
//=================================================
router.get('/cars', auth, function(req, res, next) {
    Car.find(function(err, cars) {
        if(err){ return next(err); }

        res.json(cars); 
    });
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
        res.send("success");
    }else {
        res.send("error");
    }
    
});


// AUTHENTICATION ROUTES
//=================================================
router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

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
