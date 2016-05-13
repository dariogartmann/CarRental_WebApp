var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    status: String,
    isActive: Boolean

});

mongoose.model('Reservation', ReservationSchema);