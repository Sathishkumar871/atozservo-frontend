import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaCommentDots, FaVideo, FaVideoSlash } from "react-icons/fa";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { motion } from "framer-motion";
import io from "socket.io-client";
import "./FindPartnerPage.css";

const socket = io("https://your-server-url", {
  transports: ["websocket"],
});

interface Partner {
  name: string;
  avatar: string;
  audioOnly: boolean;
}

const FindPartnerPage: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [timer, setTimer] = useState(600);
  const [cameraOn, setCameraOn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chat_partner_found", (data: Partner) => {
      setPartner(data);
      setConnecting(true);
      setIsSearching(false);
    });

    const interval = setInterval(() => {
      if (connecting && timer > 0) {
        setTimer((prev) => prev - 1);
      } else if (connecting && timer === 0) {
        disconnect();
      }
    }, 1000);

    return () => {
      socket.off("chat_partner_found");
      clearInterval(interval);
    };
  }, [connecting, timer]);

  const findPartner = () => {
    setIsSearching(true);
    socket.emit("find_partner");
  };

  const disconnect = () => {
    socket.emit("disconnect_partner");
    setPartner(null);
    setConnecting(false);
    setIsSearching(false);
    setTimer(600);
  };

  return (
    <div className="find-partner-container">
      {!partner && !isSearching && (
        <div className="find-panel">
          <h1 className="header-text">Find a speaking partner</h1>
          <p className="subtext">Connect instantly with someone around the world</p>
          <button onClick={findPartner} className="btn find-btn">
            <PersonSearchIcon className="icon" /> Find Partner
          </button>
        </div>
      )}

      {isSearching && !partner && (
        <div className="searching-screen">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="searching-video-wrapper"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              src="https://ik.imagekit.io/pimx50ija/VID_20250725112345.mp4?updatedAt=1753428059821"
              className="searching-video"
            />
          </motion.div>
          <h2>Searching for partner...</h2>
          <div className="camera-toggle">
            <button className="btn toggle-btn" onClick={() => setCameraOn(!cameraOn)}>
              {cameraOn ? <FaVideo /> : <FaVideoSlash />} {cameraOn ? "Camera On" : "Camera Off"}
            </button>
            <button className="btn cancel-btn" onClick={disconnect}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {partner && connecting && (
        <div className="connected-screen">
          <div className="partner-card">
            <img src={partner.avatar} alt="partner avatar" className="partner-avatar" />
            <h2>{partner.name}</h2>
            <p>{partner.audioOnly ? "Audio Only" : "Video Enabled"}</p>
          </div>

          <div className="chat-actions">
            <button className="btn chat-btn" onClick={() => navigate("/chat")}>
              <FaCommentDots /> Chat
            </button>
            <button className="btn call-btn" onClick={() => navigate("/call")}>
              <FaPhoneAlt /> Call
            </button>
          </div>

          <div className="session-timer">
            <p>
              Session Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </p>
            <button className="btn end-btn" onClick={disconnect}>
              End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPartnerPage;
