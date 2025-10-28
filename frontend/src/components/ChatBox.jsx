import React, { useState } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatBox({ token, roomId }) {
  const { messages, sendMessage, onlineCount, typingUsers, setTyping } = useChat({ token, roomId });
  const [text, setText] = useState("");

  return (
    <div style={{ width: "400px", border: "1px solid gray", padding: "1rem", borderRadius: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        <strong>Room:</strong> {roomId} | <strong>Online:</strong> {onlineCount}
      </div>

      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.senderName}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {Object.values(typingUsers).length > 0 && (
        <div style={{ fontSize: "12px", color: "gray" }}>
          {Object.values(typingUsers).join(", ")} typing...
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(text);
          setText("");
          setTyping(false);
        }}
        style={{ marginTop: "10px" }}
      >
        <input
          style={{ width: "80%" }}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(e.target.value.length > 0);
          }}
          placeholder="Type message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
