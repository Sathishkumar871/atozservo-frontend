// Chat.tsx
"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPhone, FiMessageCircle, FiUsers } from "react-icons/fi";
import "./Chat.css";

const stories = [
  { id: 0, name: "My Story", img: "https://i.pravatar.cc/150?img=10" },
  { id: 1, name: "Eleanor", img: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Dianne", img: "https://i.pravatar.cc/150?img=12" },
  { id: 3, name: "Guy", img: "https://i.pravatar.cc/150?img=13" },
];

const chats = [
  {
    id: 1,
    name: "Chitzy Team",
    msg: "Floyd: Good luck team! 🔥",
    time: "09:30",
    unread: true,
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jerome Bell",
    msg: "Thanks sir!",
    time: "16:52",
    unread: false,
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Floyd Miles",
    msg: "Hello, bro! Can you help me?",
    time: "13:06",
    unread: true,
    img: "https://i.pravatar.cc/150?img=3",
  },
];

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const handleFindPartnerClick = () => {
     navigate("/find-partner-options");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="logo">Chitzy</h2>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search chat or contact" />
        </div>
      </div>

      <div className="story-scroll">
        {stories.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.img} alt="story" />
            <p>{story.name}</p>
          </div>
        ))}
      </div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            className="chat-item"
            key={chat.id}
            onClick={() => navigate(`/chatroom/${chat.id}`)}
          >
            <img src={chat.img} alt="avatar" />
            <div className="chat-details">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-msg">{chat.msg}</div>
            </div>
            <div className="chat-meta">
              <span className="chat-time">{chat.time}</span>
              {chat.unread && <span className="chat-dot" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-bar">
        <button className="nav-btn" onClick={() => navigate("/chat")}> <FiMessageCircle size={20} /> <span>Chats</span> </button>
        <button className="nav-btn plus-btn" onClick={handleFindPartnerClick}> <FiUsers size={24} /> <span className="button-text">Partner</span> </button>
        <button className="nav-btn" onClick={() => alert("Calling feature coming soon")}> <FiPhone size={20} /> <span>Calls</span> </button>
      </div>
    </div>
  );
};

export default Chat;
