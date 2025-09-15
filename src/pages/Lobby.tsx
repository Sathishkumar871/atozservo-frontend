import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Lobby: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };
  return (
    <div className="lobby-container">
      <h1>Video Call & Chat</h1>
      <form onSubmit={handleSubmit} className="lobby-form">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};
export default Lobby;