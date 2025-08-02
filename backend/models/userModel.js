const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    googleId: { type: String, required: false },
    firstName: {
        type: String,
        required: true,
    },
    avatar: String,
    username: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },

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
    countriesVisited: [{
        type: String,

    }],
    currentLocation: {
        city: {
            type: String,
            default: "Unknown City",
        },
        country: {
            type: String,
            default: "Unknown Country",
        }
    }

});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

