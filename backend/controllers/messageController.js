const messageModel = require("../models/messageModel");

module.exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await messageModel
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .sort({ sentAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.log(
      "error at getmessages function in messagecontroller controller file: ",
      err.message
    );
    res.status(500).json({ error: err.message });
  }
};
