const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    likedComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    requestsSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }],

});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

