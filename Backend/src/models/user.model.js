const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,  
        unique: [ true, "username is already taken" ],
        required: [ true, "username is required" ]
    }, 

    email: {
        type: String,  
        unique: [ true, "Account with this email already exists" ],
        required: [ true, "email is required" ]
    },

    password: {
        type: String,  
        required: [ true, "password is required" ]
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;