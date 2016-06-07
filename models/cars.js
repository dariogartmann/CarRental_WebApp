/*
This model represents a car in the database
*/

var mongoose = require('mongoose');

var CarSchema = new mongoose.Schema({
    image: String,
    title: String,
    pricePerDay: Number,
    brand: String,
    model: String,
    horsePower: Number,
    fuelConsumption: Number,
    numberOfSeats: Number,
    numberOfDoors: Number,
    isAutomatic: Boolean,
    isCurrentlyReserved: Boolean
});

mongoose.model('Car', CarSchema);