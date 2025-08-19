import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import './AudioCallPage.css'; 

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const AudioCallPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { partner, localId } = location.state || {};
    
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(partner?.audioOnly || false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    
    // WebRTC కోసం placeholder refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!partner) {
            navigate('/find-partner'); // పార్టనర్ డేటా లేకపోతే వెనక్కి పంపడం
            return;
        }

        // మీ WebRTC కనెక్షన్ లాజిక్ ఇక్కడ ప్రారంభమవుతుంది
        // ఉదా: socket.emit('join_call_room', { room_id: ... });

        // లోకల్ వీడియోను చూపించడం
        if (window.globalStream && localVideoRef.current) {
            localVideoRef.current.srcObject = window.globalStream;
        }

        socket.on('receive_message', (message: { sender: string; text: string }) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
        
        return () => {
            socket.off('receive_message');
        };
    }, [partner, navigate]);
    
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageData = { sender: 'You', text: newMessage };
            setMessages(prev => [...prev, messageData]);
            socket.emit('send_message', { to: partner.id, text: newMessage });
            setNewMessage('');
        }
    };
    
    const handleEndCall = () => {
        if (window.globalStream) {
            window.globalStream.getTracks().forEach(track => track.stop());
            window.globalStream = null;
        }
        socket.emit('end_call', { to: partner.id });
        navigate('/find-partner');
    };

    return (
        <div className="call-page-container">
            <div className="video-grid">
                <div className="video-container local-video">
                    <video ref={localVideoRef} autoPlay playsInline muted />
                    <span>You</span>
                </div>
                <div className="video-container remote-video">
                    <video ref={remoteVideoRef} autoPlay playsInline />
                    <span>{partner?.name || 'Partner'}</span>
                </div>
            </div>
            
            <div className="call-controls">
                <button className={`control-btn ${isMuted ? 'off' : ''}`} onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                <button className={`control-btn ${isCameraOff ? 'off' : ''}`} onClick={() => setIsCameraOff(!isCameraOff)}>
                    {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
                </button>
                <button className="control-btn end-call" onClick={handleEndCall}>
                    <FaPhoneSlash />
                </button>
            </div>

            <div className="chat-box">
                <div className="messages-area">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input-area">
                    <input 
                        type="text" 
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}><IoSend /></button>
                </div>
            </div>
        </div>
    );
};

export default AudioCallPage;