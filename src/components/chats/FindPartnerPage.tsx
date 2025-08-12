import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FindPartnerPage.css';

declare global {
  interface Window {
    globalStream: MediaStream | null;
  }
}
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

interface Partner {
  id: string;
  name: string;
  avatar: string;
  audioOnly: boolean;
}

const FindPartnerPage: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [username, setUsername] = useState<string>("GuestUser");
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelSearch = useCallback(() => {
    setIsSearching(false);
    socket.emit("cancel_search", { id: socket.id });

    if (window.globalStream) {
      window.globalStream.getTracks().forEach(track => track.stop());
      window.globalStream = null;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    toast.info("Search cancelled.", { autoClose: 3000 });
  }, []);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: true,
        });
        window.globalStream = userStream;
      } catch (err) {
        console.error('Error accessing media devices.', err);
        toast.error('Could not access microphone. Please check permissions.', { autoClose: 5000 });
      }
    };
    initMedia();
  }, [cameraOn]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("partner_found", (partnerData: Partner) => {
      console.log("Partner found:", partnerData);
      setPartner(partnerData);
      setIsSearching(false);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      new Audio("/connected.mp3").play();
      navigator.vibrate?.(200);
      toast.success("Partner found! Connecting now...", { autoClose: 3000 });

      navigate("/audiocall", {
        state: {
          partner: partnerData,
          socketId: socket.id,
        },
      });
    });

    const handlePopstate = () => {
      if (isSearching) cancelSearch();
    };
    window.addEventListener('popstate', handlePopstate);

    return () => {
      socket.off("connect");
      socket.off("partner_found");
      window.removeEventListener('popstate', handlePopstate);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [navigate, isSearching, cancelSearch]);

  const findPartner = () => {
    if (!window.globalStream) {
      toast.error("Microphone not ready. Please wait or check permissions.", { autoClose: 5000 });
      return;
    }

    setIsSearching(true);
    socket.emit("find_partner", {
      id: socket.id,
      name: username,
      avatar: `https://ui-avatars.com/api/?name=${username}`,
      audioOnly: true,
    });

    searchTimeoutRef.current = setTimeout(() => {
      if (isSearching) {
        setIsSearching(false);
        toast.error("No partner found. Try again later.", { autoClose: 5000 });
      }
    }, 15000);
  };

  return (
    <div className="find-partner-container">
      {!isSearching && !partner && (
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
              src="https://ik.imagekit.io/pimx50ija/1754281876013.mp4?updatedAt=1754282633742"
              className="searching-video"
            />
          </motion.div>
          <h2>Searching for partner...</h2>
          <div className="camera-toggle">
            <button className="btn toggle-btn" onClick={() => setCameraOn(!cameraOn)}>
              {cameraOn ? <FaVideo /> : <FaVideoSlash />} {cameraOn ? "Camera On" : "Camera Off"}
            </button>
            <button className="btn cancel-btn" onClick={cancelSearch}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPartnerPage;
