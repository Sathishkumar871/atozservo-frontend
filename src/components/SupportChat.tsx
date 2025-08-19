// SupportChat.tsx
import React, { useEffect, useState } from 'react';
import socket from '../socket'; // Already existing socket instance
import './SupportChat.css';

const SupportChat = ({ user }: { user: any }) => {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    socket.emit('joinSupport', { userId: user?.email }); // User join support room

    socket.on('supportMessage', (msg: {sender: string, text: string}) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('supportMessage');
    }
  }, [user]);

  const handleSend = () => {
    if (newMsg.trim() === '') return;
    const msg = { sender: user.email, text: newMsg };
    socket.emit('sendSupportMessage', msg);
    setMessages(prev => [...prev, msg]);
    setNewMsg('');
  };

  return (
    <div className="support-chat-container">
      <div className="chat-header">Customer Support</div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.sender === user.email ? 'user' : 'support'}`}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMsg} 
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default SupportChat;
