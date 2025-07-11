const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    imageUrl: String,
    aiCaption: String,
    hashtags: [{
        type: String,
    }],
    location: {
        type: "Point",
        coordinates: [longitude, latitude],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const journalModel = mongoose.model('Journal', journalSchema);

module.exports = journalModel;