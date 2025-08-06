// PremiumTalkRoom.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Mic, Video, PhoneOff, MessageSquare,
  CornerDownLeft, Volume2, VolumeX, VideoOff, Hand, Gift
} from 'lucide-react';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import './join.css';


const SERVER_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://atozservo-backend.onrender.com";

const socket = io(SERVER_URL, { transports: ["websocket"] });
interface User {
  id: string;
  name: string;
  isSpeaking: boolean;
  isOwner: boolean;
  isMicOn: boolean;
  isVideoOn: boolean;
  imageUrl: string;
}

interface ChatMessage {
  id: string;
  senderName: string;
  message: string;
  type: 'user_message' | 'system_message';
  timestamp: number;
}

const PremiumTalkRoom: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [users, setUsers] = useState<User[]>([]);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
  const [showMicConfirmation, setShowMicConfirmation] = useState(false);
  const [mediaAccessError, setMediaAccessError] = useState('');
  const [handRaised, setHandRaised] = useState(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Utility: add system message
  const addSystemMessage = (msg: string) => {
    setChatMessages(prev => [...prev, {
      id: nanoid(),
      senderName: 'System',
      message: msg,
      type: 'system_message',
      timestamp: Date.now()
    }]);
  };

  // Start mic detection
  const startSpeakingDetection = (stream: MediaStream) => {
    const audioContext = audioContextRef.current ||= new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyser);

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    audioAnalyserRef.current = analyser;

    speakingIntervalRef.current && clearInterval(speakingIntervalRef.current);

    speakingIntervalRef.current = setInterval(() => {
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b) / data.length;
      socket.emit('speaking', { groupId, isSpeaking: avg > 20 });
    }, 200);
  };

  // Join room and media setup
  useEffect(() => {
    const roomId = groupId || nanoid();
    if (!groupId) navigate(`/room/${roomId}`, { replace: true });

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getAudioTracks().forEach(t => t.enabled = isMicOn);
        stream.getVideoTracks().forEach(t => t.enabled = isVideoOn);

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;

        const newUser: User = {
       id: socket?.id || "unknown-id",
      name: "User-" + Math.floor(Math.random() * 1000),
       isSpeaking: false,
      isOwner: true,
      isMicOn,
      isVideoOn,
      imageUrl: `https://placehold.co/100x100/A7C9F5/ffffff?text=${(socket?.id || "??").substring(0, 2)}`
};

        setLocalUser(newUser);
        setUsers([newUser]);
        socket.emit('joinRoom', { groupId: roomId, user: newUser });
      } catch (err) {
        console.error(err);
        setMediaAccessError("Failed to access media devices.");
        addSystemMessage("Media access failed. Check permissions.");
      }
    };

    if (socket.connected) setupMedia();
    else socket.once('connect', setupMedia);

    // Listeners
    socket.on('userJoined', (user: User) => {
      setUsers(prev => prev.some(u => u.id === user.id) ? prev : [...prev, user]);
      addSystemMessage(`${user.name} joined.`);
    });

    socket.on('userLeft', (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
      addSystemMessage(`User left.`);
    });

    socket.on('userStatusChange', (userId, status) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...status } : u));
    });

    socket.on('speaking', (userId: string, isSpeaking: boolean) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSpeaking } : u));
    });

    socket.on('chatMessage', ({ senderName, message }: { senderName: string, message: string }) => {
      setChatMessages(prev => [...prev, {
        id: nanoid(),
        senderName,
        message,
        type: 'user_message',
        timestamp: Date.now()
      }]);
    });

    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      audioAnalyserRef.current?.disconnect();
      if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);

      socket.emit('leaveRoom', { groupId: roomId });
      socket.off();
    };
  }, []);

  const toggleMic = (confirm = true) => {
    if (confirm && !isMicOn) return setShowMicConfirmation(true);
    if (!localStreamRef.current) return;

    const newMic = !isMicOn;
    setIsMicOn(newMic);
    localStreamRef.current.getAudioTracks().forEach(t => t.enabled = newMic);
    setUsers(prev => prev.map(u => u.id === localUser?.id ? { ...u, isMicOn: newMic } : u));
    socket.emit('userStatusChange', { groupId, status: { isMicOn: newMic } });

    newMic ? startSpeakingDetection(localStreamRef.current) : socket.emit('speaking', { groupId, isSpeaking: false });
    setShowMicConfirmation(false);
  };

  const toggleVideo = (confirm = true) => {
    if (confirm && !isVideoOn) return setShowVideoConfirmation(true);
    if (!localStreamRef.current) return;

    const newVid = !isVideoOn;
    setIsVideoOn(newVid);
    localStreamRef.current.getVideoTracks().forEach(t => t.enabled = newVid);
    setUsers(prev => prev.map(u => u.id === localUser?.id ? { ...u, isVideoOn: newVid } : u));
    socket.emit('userStatusChange', { groupId, status: { isVideoOn: newVid } });

    if (localVideoRef.current) localVideoRef.current.srcObject = newVid ? localStreamRef.current : null;
    setShowVideoConfirmation(false);
  };

  const leaveRoom = () => navigate('/chat');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !localUser) return;
    socket.emit('sendChatMessage', {
      groupId,
      senderId: localUser.id,
      senderName: localUser.name,
      message: currentMessage
    });
    setCurrentMessage('');
  };

  const handleConfirmAction = (type: 'mic' | 'video', accept: boolean) => {
    if (type === 'mic') {
      setShowMicConfirmation(false);
      if (accept) toggleMic(false);
    } else {
      setShowVideoConfirmation(false);
      if (accept) toggleVideo(false);
    }
  };

  const raiseHand = () => {
    setHandRaised(!handRaised);
    addSystemMessage(`${localUser?.name} ${!handRaised ? 'raised' : 'lowered'} their hand.`);
  };

  return (
    <div className="premium-talk-room-container">
      <header className="room-header">
        <button className="back-button" onClick={leaveRoom}>
          <CornerDownLeft size={24} />
        </button>
        <h1 className="room-title">Group: {groupId}</h1>
      </header>

      {mediaAccessError && <div className="media-error-message">{mediaAccessError}</div>}

      <div className="users-grid">
        {users.length > 0 ? users.map(user => (
          <div key={user.id} className={`user-card ${user.isSpeaking ? 'speaking-animation' : ''}`}>
            <div className="user-profile-img-wrapper">
              {user.isVideoOn ? (
                <video ref={user.id === localUser?.id ? localVideoRef : null} autoPlay playsInline muted={user.id === localUser?.id} />
              ) : (
                <img src={user.imageUrl} alt={user.name} className="user-profile-img" />
              )}
              {user.isOwner && <span className="owner-badge">Owner</span>}
              <div className="mic-status-icon">
                {user.isMicOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </div>
              {!user.isVideoOn && <div className="video-off-overlay"><VideoOff size={32} /></div>}
            </div>
            <h2 className="user-name">{user.name}</h2>
          </div>
        )) : <div className="empty-room-placeholder">Waiting for others...</div>}
      </div>

      <div className="footer-bar">
        <div className="main-controls">
          <button onClick={() => toggleMic()} className={`control-button ${isMicOn ? 'active' : ''}`}><Mic /></button>
          <button onClick={() => toggleVideo()} className={`control-button ${isVideoOn ? 'active' : ''}`}><Video /></button>
          <button onClick={leaveRoom} className="control-button leave-button"><PhoneOff /></button>
        </div>

        <button onClick={raiseHand} className="footer-button-small"><Hand /><span>Hand</span></button>
        <button onClick={() => {}} className="footer-button-small"><Gift /><span>Gift</span></button>
        <button onClick={() => setShowChat(!showChat)} className="footer-button-small chat-toggle"><MessageSquare /><span>Chat</span></button>
      </div>

      {(showMicConfirmation || showVideoConfirmation) && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-box">
            <p>{showMicConfirmation ? 'Turn on Microphone?' : 'Turn on Camera?'}</p>
            <div>
              <button onClick={() => handleConfirmAction(showMicConfirmation ? 'mic' : 'video', false)}>Decline</button>
              <button onClick={() => handleConfirmAction(showMicConfirmation ? 'mic' : 'video', true)}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <div className="chat-window">
          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.type === 'system_message' ? 'system-message' : (msg.senderName === localUser?.name ? 'self' : 'other')}`}>
                <div className="message-content">
                  {msg.type === 'user_message' && <div className="message-sender">{msg.senderName}</div>}
                  <div className="message-text">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chat-input-container">
            <input type="text" value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} placeholder="Type..." />
            <button type="submit"><CornerDownLeft /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PremiumTalkRoom;
