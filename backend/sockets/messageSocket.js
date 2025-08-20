const messageModel = require("../models/messageModel.js");
const dayjs = require("dayjs");

const onlineUsers = new Map();

module.exports.messageSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    //registering
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered`);
    });

    //private messages
    socket.on("private-messages", async ({ senderId, receiverId, content }) => {
      try {
        const msg = await messageModel.create({
          sender: senderId,
          receiver: receiverId,
          content,
          sentAt: dayjs().toDate(),
        });
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          socket.to(receiverSocket).emit("private-message", msg);
        }

        //sending back to sender(confirmation)
        socket.emit("private-message", msg);
      } catch (err) {
        console.error("error at messageSocket.js file: ", err.message);
      }
    });

    //handling disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      }
    });
  });
};
