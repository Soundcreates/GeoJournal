const express = require("express");
const messageRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

//getting controller functions
const { getMessages } = require("../controllers/messageController");

//base url
// app.use("/api/messages", messageRouter);

messageRouter.get("/:senderId/:receiverId", getMessages);

module.exports = messageRouter;
