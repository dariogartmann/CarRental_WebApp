/*
This model represents a user in the database
*/

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    name: String,
    mail: String,
    phone: String,
    bankAccount: String,
    address: String,
    city: String,
    country: String,
    isAdmin: Boolean,
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

/* Set a password
 * create password by storing its hash and salt
 */
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

/* Validate password
 * hash password and compare to stored one
 */
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

// Generate json webtoken
UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'IAMNOTSANTASECRET');
};


mongoose.model('User', UserSchema);