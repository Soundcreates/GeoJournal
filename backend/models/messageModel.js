const mongoose = require("mongoose");
const dayjs = require("dayjs");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sentAt: {
    type: Date,
    default: () => dayjs().toDate(),
    required: true,
  },

  geoLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journal",
    required: false,
  },
});

module.exports = mongoose.model("Message", messageSchema);
