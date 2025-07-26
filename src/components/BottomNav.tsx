import React from 'react';
import { TbSmartHome } from 'react-icons/tb';
import { BiCategory } from 'react-icons/bi';
import { BsFillChatRightHeartFill } from 'react-icons/bs';
import { FiPlusCircle } from 'react-icons/fi';
import { MdPerson } from 'react-icons/md'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

interface BottomNavProps {
  user: any;
  openLogin: () => void;
  openPost: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  user,
  openLogin,
  openPost,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProtectedRoute = (path: string) => {
    if (!user) {
      openLogin();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bottom-nav">
      {/* 1. Home */}
      <div
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <TbSmartHome className="icon" />
        <div className="nav-label">Home</div>
      </div>

      {/* 2. Category */}
      <div
        className={`nav-item ${location.pathname === '/category' ? 'active' : ''}`}
        onClick={() => navigate('/category')}
      >
        <BiCategory className="icon" />
        <div className="nav-label">Category</div>
      </div>

      {/* 3. Post */}
      <div className="post-button-wrapper" onClick={openPost}>
        <div className="post-glow-circle">
          <FiPlusCircle className="post-icon" />
        </div>
      </div>

      {/* 4. Chat */}
      <div
        className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}
        onClick={() => handleProtectedRoute('/chat')}
      >
        <BsFillChatRightHeartFill className="icon" />
        <div className="nav-label">Chat</div>
      </div>

      {/* ✅ 5. Account */}
      <div
        className={`nav-item ${location.pathname === '/account' ? 'active' : ''}`}
        onClick={() => handleProtectedRoute('/account')}
      >
        <MdPerson className="icon" />
        <div className="nav-label">Account</div>
      </div>
    </div>
  );
};

export default BottomNav;
