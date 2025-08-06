// src/components/ChatRoom.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPhone, FiPaperclip } from "react-icons/fi";
import { IoSendOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import socket from "../../socket";
import "./ChatRoom.css";

interface Message {
  text?: string;
  image?: string;
  from: "me" | "friend";
  time: string;
}

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chatPartnerName = id === "random" ? "Random Partner" : "Sathish Kumar";
  const chatPartnerStatus = "Online";
  const chatPartnerAvatar = id === "random" ? "https://i.pravatar.cc/150?img=60" : "/profile.jpg";

  useEffect(() => {
    socket.on("connect", () => {
      if (id) socket.emit("join_room", id);
    });

    socket.on("message", (data: Message) => {
      setMessages((prev) => [...prev, { ...data, from: "friend" }]);
    });

    if (id === "random") {
      setMessages([
        { text: "You've been connected to a random partner!", from: "friend", time: "Now" },
        { text: "Say hello!", from: "friend", time: "Now" },
      ]);
    } else {
      setMessages([
        { text: "Hey there! How's it going?", from: "friend", time: "10:00 AM" },
        { text: "I'm doing great, thanks! And you?", from: "me", time: "10:01 AM" },
        { text: "All good! Just working on some project stuff.", from: "friend", time: "10:02 AM" },
      ]);
    }

    return () => {
      socket.off("message");
      if (id) socket.emit("leave_room", id);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      from: "me",
    };
    socket.emit("send_room_message", { roomId: id, message: msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File too big.");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const imageMsg: Message = {
        image: base64,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        from: "me",
      };
      socket.emit("send_room_message", { roomId: id, message: imageMsg });
      setMessages((prev) => [...prev, imageMsg]);
      fileInputRef.current!.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chatroom-wrapper">
      {/* Header */}
      <div className="chatroom-header glass-header">
        <div className="left-section">
          <button onClick={() => navigate(-1)} className="round-btn">
            <FiArrowLeft size={20} />
          </button>
          <img src={chatPartnerAvatar} className="header-profile" alt="user avatar" />
          <div className="user-labels">
            <h2>{chatPartnerName}</h2>
            <small className="status-indicator">{chatPartnerStatus}</small>
          </div>
        </div>
        <div className="right-section">
          <FiPhone className="icon-btn" size={22} onClick={() => alert("Call feature coming soon")} />
          <FaVideo
            className="icon-btn"
            size={22}
            onClick={() => navigate(`/video-call/${id}`)}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="chatroom-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.from}`}>
            {msg.text && <p className="message-text">{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="sent" className="chat-image" />}
            <span className="message-time">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatroom-input">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <FiPaperclip
          className="attach-icon"
          size={24}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="send-button">
          <IoSendOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
