const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    googleId: { type: String, required: false },
    firstName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://imgs.search.brave.com/4Zao298wcGdVAOGg3B3_yMa79bBtjbkb6njql8OQKjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjY2/NTQ1MDYyL3ZlY3Rv/ci9kZWZhdWx0LXBs/YWNlaG9sZGVyLXBy/b2ZpbGUtaWNvbi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/UDMyQm1LaTRCc0I0/Smhob0NhaFRYaHdC/QTBCNkhnSjNBcm9X/SHl1TThOOD0",
    },
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
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal'
    }]

});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

