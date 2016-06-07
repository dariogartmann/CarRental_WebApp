/*
This model represents a reservation in the database
*/

var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    status: String,
    isActive: Boolean,
    dateFrom: Date,
    dateTo: Date,
    isRented: Boolean
});

mongoose.model('Reservation', ReservationSchema);