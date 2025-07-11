const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  journalEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
    required: true
  },
  commentText: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: Number,
})