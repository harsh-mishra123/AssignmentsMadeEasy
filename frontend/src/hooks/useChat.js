import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useChat({ token, roomId }) {
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      console.error("VITE_API_URL is not defined");
      return;
    }

    const socket = io(API_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", { roomId });
    });

    socket.on("recent-messages", (recent) => {
      setMessages(recent);
    });

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("online-count", ({ count }) => {
      setOnlineCount(count);
    });

    socket.on("user-typing", ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        if (isTyping) updated[userId] = userName;
        else delete updated[userId];
        return updated;
      });
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.disconnect();
    };
  }, [token, roomId]);

  const sendMessage = (text) => {
    socketRef.current?.emit("send-message", { roomId, text });
  };

  const setTyping = (isTyping) => {
    socketRef.current?.emit("typing", { roomId, isTyping });
  };

  return { messages, sendMessage, onlineCount, typingUsers, setTyping };
}