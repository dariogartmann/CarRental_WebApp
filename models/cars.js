var mongoose = require('mongoose');

var CarSchema = new mongoose.Schema({
    image: String,
    title: String,
    pricePerDay: Number,
    isCurrentlyReserved: Boolean
});

mongoose.model('Car', CarSchema);