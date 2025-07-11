const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    profileImage: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

