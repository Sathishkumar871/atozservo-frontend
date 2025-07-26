import React, { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import './Notification.css';

// 🔒 Props interface for type safety
interface NotificationProps {
  isPanelOpen: boolean;
}

const Notification: React.FC<NotificationProps> = ({ isPanelOpen }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleNotification = () => {
    setIsOn(!isOn);
  };

  // ❌ Hide notification button if side panel is open
  if (isPanelOpen) return null;

  return (
    <div className="notification-wrapper" onClick={toggleNotification}>
      <div className="plus-btn">
        <FaPlus size={10} />
      </div>
      <div className={`bell-btn ${isOn ? 'active' : ''}`}>
        <IoNotificationsOutline size={16} />
        {isOn && <span className="red-dot" />}
      </div>
    </div>
  );
};

export default Notification;