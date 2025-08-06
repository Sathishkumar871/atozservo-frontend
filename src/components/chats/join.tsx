// src/components/chats/join.tsx

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, Video, PhoneOff, MessageSquare, CornerDownLeft, Volume2, VolumeX, VideoOff, Hand, Gift } from 'lucide-react';
import io from 'socket.io-client';
import './join.css';
import { nanoid } from 'nanoid';

const SERVER_URL = "http://localhost:5000"; 
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

  // State for the meeting
  const [users, setUsers] = useState<User[]>([]);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isMicOn, setIsMicOn] = useState(false); // Initial state is Muted
  const [isVideoOn, setIsVideoOn] = useState(false); // Initial state is Video Off
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
  const [showMicConfirmation, setShowMicConfirmation] = useState(false);
  const [mediaAccessError, setMediaAccessError] = useState('');

  // WebRTC related refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to add a system message to the chat
  const addSystemMessage = (message: string) => {
    setChatMessages(prev => [...prev, {
        id: nanoid(),
        senderName: 'System',
        message: message,
        type: 'system_message',
        timestamp: Date.now(),
    }]);
  };
  
  // Function to start speaking detection
  const startSpeakingDetection = (stream: MediaStream) => {
    if (!stream.getAudioTracks().length) return; 
    
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    
    try {
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        microphone.connect(analyser);

        audioAnalyserRef.current = analyser;
        audioContext.resume();

        const checkSpeaking = () => {
          if (!audioAnalyserRef.current) return;
          
          const dataArray = new Uint8Array(audioAnalyserRef.current.fftSize);
          audioAnalyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          
          const speakingThreshold = 20; // This value might need adjustment
          const isSpeaking = average > speakingThreshold;

          if (localUser && socket) {
            socket.emit('speaking', { groupId, isSpeaking });
          }
        };
        
        if (speakingIntervalRef.current) {
            clearInterval(speakingIntervalRef.current);
        }
        speakingIntervalRef.current = setInterval(checkSpeaking, 200); // Check every 200ms
    } catch (e) {
        console.error("Audio detection failed:", e);
    }
  };
  
  // Main useEffect for room logic and WebRTC
  useEffect(() => {
    const roomIdentifier = groupId || nanoid();
    if (!groupId) {
        navigate(`/room/${roomIdentifier}`, { replace: true });
    }

    const initMedia = async () => {
      try {
        // Request media with both video and audio, but disable tracks initially
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        // Initial state of tracks should match component state
        stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
        stream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
        
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        const currentUser: User = {
            id: socket.id,
            name: "User-" + Math.floor(Math.random() * 1000), 
            isSpeaking: false,
            isOwner: true,
            isMicOn: isMicOn,
            isVideoOn: isVideoOn,
            imageUrl: `https://placehold.co/100x100/A7C9F5/ffffff?text=${socket.id?.substring(0, 2)}`
        };
        setLocalUser(currentUser);
        
        // This is the fix: Add the current user to the list immediately
        setUsers([currentUser]);
        
        socket.emit('joinRoom', { groupId: roomIdentifier, user: currentUser });

        setMediaAccessError('');
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setMediaAccessError("Error accessing your microphone or camera. Please check your permissions.");
        addSystemMessage("Error accessing your microphone or camera. Please check your permissions.");
      }
    };
    
    if (socket.id) {
        initMedia();
    } else {
        socket.on('connect', () => {
            initMedia();
        });
    }

    // Socket.IO event listeners
    socket.on('userJoined', (user: User) => {
      setUsers(prev => {
        if (!prev.some(u => u.id === user.id)) {
            addSystemMessage(`${user.name} has joined the room.`);
            return [...prev, user];
        }
        return prev;
      });
    });

    socket.on('userLeft', (userId: string) => {
      setUsers(prev => {
          const leavingUser = prev.find(u => u.id === userId);
          if (leavingUser) {
              addSystemMessage(`${leavingUser.name} has left the room.`);
          }
          return prev.filter(user => user.id !== userId);
      });
    });

    socket.on('userStatusChange', (userId: string, status: { isMicOn?: boolean; isVideoOn?: boolean; }) => {
        setUsers(prev => prev.map(user => {
            if (user.id === userId) {
                const updatedUser = { ...user, ...status };
                if (status.isMicOn !== undefined) {
                    addSystemMessage(`${updatedUser.name} has ${status.isMicOn ? 'unmuted' : 'muted'} their microphone.`);
                }
                if (status.isVideoOn !== undefined) {
                    addSystemMessage(`${updatedUser.name}'s video is now ${status.isVideoOn ? 'on' : 'off'}.`);
                }
                return updatedUser;
            }
            return user;
        }));
    });

    socket.on('speaking', (userId: string, isSpeaking: boolean) => {
        setUsers(prev => prev.map(user => ({
            ...user,
            isSpeaking: user.id === userId ? isSpeaking : user.isSpeaking,
        })));
    });

    socket.on('chatMessage', (messageData: { senderId: string, senderName: string, message: string }) => {
      setChatMessages(prev => [...prev, {
          id: nanoid(),
          senderName: messageData.senderName,
          message: messageData.message,
          type: 'user_message',
          timestamp: Date.now(),
      }]);
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.disconnect();
      }
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
      }
      socket.emit('leaveRoom', { groupId: roomIdentifier });
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userStatusChange');
      socket.off('speaking');
      socket.off('chatMessage');
      socket.off('connect');
    };
  }, [groupId, navigate]);
  
  const toggleMic = (confirm = true) => {
      if (confirm && !isMicOn) {
          setShowMicConfirmation(true);
          return;
      }
      
      if (!localStreamRef.current) {
          addSystemMessage("Microphone could not be accessed. Please refresh the page.");
          setShowMicConfirmation(false);
          return;
      }

      const newMicState = !isMicOn;
      setIsMicOn(newMicState);
      
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = newMicState);
      if (newMicState) {
          startSpeakingDetection(localStreamRef.current);
      } else {
          if (speakingIntervalRef.current) {
              clearInterval(speakingIntervalRef.current);
          }
          socket.emit('speaking', { groupId, isSpeaking: false });
      }
      
      setUsers(prev => prev.map(user => user.id === localUser?.id ? {...user, isMicOn: newMicState} : user));
      socket.emit('userStatusChange', { groupId, status: { isMicOn: newMicState } });
      setShowMicConfirmation(false);
  };
  
  const toggleVideo = (confirm = true) => {
    if (confirm && !isVideoOn) {
        setShowVideoConfirmation(true);
        return;
    }
    
    if (!localStreamRef.current) {
        addSystemMessage("Camera could not be accessed. Please refresh the page.");
        setShowVideoConfirmation(false);
        return;
    }

    const newVideoState = !isVideoOn;
    setIsVideoOn(newVideoState);
    
    localStreamRef.current.getVideoTracks().forEach(track => track.enabled = newVideoState);
    
    if (newVideoState && localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
    } else if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
    }

    setUsers(prev => prev.map(user => user.id === localUser?.id ? {...user, isVideoOn: newVideoState} : user));
    socket.emit('userStatusChange', { groupId, status: { isVideoOn: newVideoState } });
    setShowVideoConfirmation(false);
  };
  
  const leaveRoom = () => {
    navigate('/chat');
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && localUser) {
      socket.emit('sendChatMessage', { 
        groupId, 
        senderId: localUser.id,
        senderName: localUser.name,
        message: currentMessage 
      });
      setCurrentMessage('');
    }
  };

  const handleConfirmAction = (action: 'mic' | 'video', accept: boolean) => {
    if (action === 'mic') {
        setShowMicConfirmation(false);
        if (accept) {
            toggleMic(false);
        }
    } else if (action === 'video') {
        setShowVideoConfirmation(false);
        if (accept) {
            toggleVideo(false);
        }
    }
  };

  return (
    <div className="premium-talk-room-container">
      <div className="main-content">
        <header className="room-header">
          <button className="back-button" onClick={() => navigate('/chat')}>
            <CornerDownLeft size={24} />
          </button>
          <h1 className="room-title">Group: {groupId}</h1>
        </header>
        
        {mediaAccessError && (
          <div className="media-error-message">
            {mediaAccessError}
          </div>
        )}

        <div className="users-grid">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.id} className={`user-card ${user.isSpeaking ? 'speaking-animation' : ''}`}>
                <div className="user-profile-img-wrapper">
                  {user.isVideoOn ? (
                    <video 
                      className="user-video-stream" 
                      ref={user.id === localUser?.id ? localVideoRef : null} 
                      autoPlay 
                      playsInline 
                      muted={user.id === localUser?.id}
                    />
                  ) : (
                    <img src={user.imageUrl} alt={user.name} className="user-profile-img" />
                  )}
                  {user.isOwner && <span className="owner-badge">Owner</span>}
                  <div className="mic-status-icon">
                    {user.isMicOn ? <Volume2 size={24} color="#fff" /> : <VolumeX size={24} color="#fff" />}
                  </div>
                  {!user.isVideoOn && <div className="video-off-overlay"><VideoOff size={32} /></div>}
                </div>
                <h2 className="user-name">{user.name}</h2>
              </div>
            ))
          ) : (
            <div className="empty-room-placeholder">Waiting for others to join...</div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div className="main-controls">
          <button onClick={() => toggleMic()} className={`control-button ${isMicOn ? 'active' : ''}`}>
            <Mic size={24} />
          </button>
          <button onClick={() => toggleVideo()} className={`control-button ${isVideoOn ? 'active' : ''}`}>
            <Video size={24} />
          </button>
          <button onClick={leaveRoom} className="control-button leave-button">
            <PhoneOff size={24} />
          </button>
        </div>
        
        <button onClick={() => {}} className="footer-button-small">
          <Hand size={20} />
          <span>Raise Hand</span>
        </button>
        <button onClick={() => {}} className="footer-button-small">
          <Gift size={20} />
          <span>Send Gift</span>
        </button>
        
        <button onClick={() => setShowChat(!showChat)} className="footer-button-small chat-toggle">
          <MessageSquare size={20} />
          <span>Chat</span>
        </button>
      </div>

      {(showVideoConfirmation || showMicConfirmation) && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-box">
            <p className="confirmation-modal-message">
                {showVideoConfirmation ? "Do you want to turn on your camera?" : "Do you want to turn on your microphone?"}
            </p>
            <div className="confirmation-buttons">
                <button 
                    className="confirmation-button decline" 
                    onClick={() => handleConfirmAction(showVideoConfirmation ? 'video' : 'mic', false)}
                >
                    Decline
                </button>
                <button 
                    className="confirmation-button accept" 
                    onClick={() => handleConfirmAction(showVideoConfirmation ? 'video' : 'mic', true)}
                >
                    Accept
                </button>
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
          <form className="chat-input-container" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              className="chat-input"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-button"><CornerDownLeft size={20} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PremiumTalkRoom;