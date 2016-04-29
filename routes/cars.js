var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();
var Car = mongoose.model('Car');


/* GET /cars page. */
router.get('/cars', function(req, res, next) {
    
    Car.find(function(err, cars) {
        if(err){ return next(err); }

        res.json(cars); 
    });
});
    

module.exports = router;


// INACTIVE MODULE, TODO: separate files for routes