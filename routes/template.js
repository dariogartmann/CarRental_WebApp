var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();
var Car = mongoose.model('Car');


router.get('/template', function(req, res, next) {
    res.send("Welcome to <url>/template"); 
});

module.exports = router;