import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("https://geo-journal.vercel.app", {
  autoConnect: false,
});

export const useSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");

      socket.emit("register", userId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socket.on("private-message", (message) => {
      console.log("Received private message: ", message);
      setMessages((prev) => [...prev, message]);
    });

    //cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("private-message");
      socket.disconnect();
    };
  }, [userId]);

  const sendPrivateMessage = (receiverId, content) => {
    if (!isConnected || !userId) return false;

    socket.emit("private-messages", {
      senderId: userId,
      receiverId,
      content,
    });
    return true;
  };

  return {
    isConnected,
    messages,
    sendPrivateMessage,
  };
};
