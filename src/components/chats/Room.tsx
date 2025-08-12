import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute, BsChatDots } from 'react-icons/bs';
import { FaUserFriends, FaRegPaperPlane } from 'react-icons/fa';
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';// adjust path if needed
import './Room.css';

interface User {
  id: string;
  name: string;
  isPremium: boolean;
}

const Room: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: roomId } = useParams<{ id: string }>();

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<any>(null);

  const [currentUser, setCurrentUser] = useState<User>({
    id: Math.random().toString(36).slice(2),
    name: 'Guest',
    isPremium: true,
  });

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const displayFrameRef = useRef<HTMLDivElement | null>(null);
  const videoStreamsContainerRef = useRef<HTMLDivElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Listen to room data in Firestore
  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) {
        navigate('/lobby'); // auto-return if deleted
        return;
      }
      setRoomData(snap.data());
    });
    return () => unsub();
  }, [roomId, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userNameFromUrl = params.get('user');
    if (userNameFromUrl) {
      setCurrentUser((prev) => ({ ...prev, name: userNameFromUrl }));
    } else {
      navigate('/lobby');
    }

    // Get local media
    const getLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Media access error:', err);
      }
    };
    getLocalMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [location.search, navigate]);

  useEffect(() => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleLeaveRoom = async () => {
    if (!roomId) return;
    try {
      const updatedMembers =
        roomData?.currentMembers?.filter((m: any) => m.name !== currentUser.name) || [];

      const roomRef = doc(db, 'rooms', roomId);

      if (updatedMembers.length === 0) {
        await deleteDoc(roomRef); // delete if empty
      } else {
        await updateDoc(roomRef, { currentMembers: updatedMembers });
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      navigate('/lobby');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleToggleCamera = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsCameraOn(track.enabled);
      }
    }
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (input?.value.trim()) {
      const formattedMessage = `${currentUser.name}: ${input.value}`;
      setMessages((prev) => [...prev, formattedMessage]);
      input.value = '';
    }
  };

  return (
    <div className="container">
      <header id="nav">
        <div className="nav--list">
          <button id="members__button" onClick={() => setIsMembersOpen(!isMembersOpen)}>
            <FaUserFriends size={24} color="#ede0e0" />
          </button>
          <h3 id="logo">
            <span>TalkHive</span>
          </h3>
        </div>
        <div id="nav__links">
          <span style={{ color: '#fff', marginRight: '15px' }}>
            Room ID: {roomId}
          </span>
          <button id="chat__button" onClick={() => setIsChatOpen(!isChatOpen)}>
            <BsChatDots size={24} color="#ede0e0" />
          </button>
          <button id="leave-btn" onClick={handleLeaveRoom}>
            Leave
          </button>
        </div>
      </header>

      <main id="room__container">
        {isMembersOpen && (
          <section id="members__container">
            <div id="members__header">
              <p>Participants</p>
              <strong id="members__count">
                {roomData?.currentMembers?.length || 0}
              </strong>
            </div>
            <div id="member__list">
              {roomData?.currentMembers?.map((m: any, i: number) => (
                <div key={i} className="member__wrapper">
                  {m.name}
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="stream__container">
          <div id="streams__container" ref={videoStreamsContainerRef}>
            <div className="video__container">
              <video ref={localVideoRef} autoPlay playsInline muted />
              <span className="user-name-overlay">{currentUser.name}</span>
            </div>
          </div>

          <div className="stream__actions">
            <button onClick={handleToggleCamera} className={isCameraOn ? 'active' : ''}>
              {isCameraOn ? <BsCameraVideo size={24} /> : <BsCameraVideoOff size={24} color="red" />}
            </button>
            <button onClick={handleToggleMic} className={!isMuted ? 'active' : ''}>
              {!isMuted ? <BsMic size={24} /> : <BsMicMute size={24} color="red" />}
            </button>
            <button id="leave-btn" onClick={handleLeaveRoom}>
              Leave
            </button>
          </div>
        </section>

        {isChatOpen && (
          <section id="messages__container">
            <div id="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">{msg}</div>
              ))}
            </div>
            <form id="message__form" onSubmit={handleSendMessage}>
              <input type="text" name="message" placeholder="Send a message...." />
              <button type="submit">
                <FaRegPaperPlane />
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default Room;
