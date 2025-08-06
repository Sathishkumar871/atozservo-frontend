import React, { useState } from 'react';
import './Menu.css';
import { TiThMenu } from 'react-icons/ti';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import { HiOutlineLogout } from 'react-icons/hi';
import { PiInfoBold } from 'react-icons/pi';
import LoginPanel from './LoginPanel';
import PolicyPanel from './PolicyPanel';
import YouTubeLogo from './YouTubeLogo';
import YouTubeSearch from './YouTubeSearch';
import SpotifyLogo from "./SpotifyLogo"; 
import Games from './games/Games';
import { useNavigate } from 'react-router-dom';
import Finance from './finance/finance';

interface MenuProps {
  user: any;
  setUser: (user: any) => void;
}

const Menu: React.FC<MenuProps> = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPolicyPanel, setShowPolicyPanel] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [, setSelectedItem] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleGamesClick = () => {
    setIsOpen(false); // close menu
    navigate('/gamedesign'); // navigate to gamedesign page
  };

  return (
    <>
      {!isOpen && !showPolicyPanel && (
        <button className="menu-btn" onClick={toggleMenu}>
          <TiThMenu className="menu-icon" />
        </button>
      )}

      {showPolicyPanel ? (
        <div className="fullscreen-panel">
          <PolicyPanel onClose={() => setShowPolicyPanel(false)} />
        </div>
      ) : (
        <div className={`side-panel ${isOpen ? 'open' : ''}`}>
          <button className="back-btn" onClick={toggleMenu}>
            <IoArrowBack size={22} />
          </button>
          <button className="close-btn" onClick={toggleMenu}>
            <IoClose size={28} />
          </button>

          <div className="panel-content">
            {!user ? (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login / Signup
              </button>
            ) : (
              <>
                <div className="welcome-block">
                  <p className="welcome-text">👋 Welcome</p>
                  <p className="user-email">{user.email}</p>

                  <SpotifyLogo />
                  <Finance/>

                  {/* Games button with click handler */}
                  <Games onClick={handleGamesClick} />

                  <div className="logo-button-row">
                    {!showSearchBar && (
                      <YouTubeLogo onClick={() => setShowSearchBar(true)} />
                    )}
                  </div>

                  {showSearchBar && (
                    <div className="youtube-search-wrapper">
                      <button
                        className="close-search-btn"
                        onClick={() => setShowSearchBar(false)}
                      >
                        ❌
                      </button>
                      <YouTubeSearch />
                    </div>
                  )}

                  <button
                    className="icon-btn"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setUser(null);
                      setSelectedItem('logout');
                      alert('Logged out');
                    }}
                  >
                    <HiOutlineLogout size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}

            <div className="policy-wrapper">
              <button
                className="icon-btn policy-launch"
                onClick={() => {
                  setShowPolicyPanel(true);
                  setSelectedItem('policy');
                }}
              >
                <PiInfoBold size={16} />
                <span>Policy</span>
              </button>
            </div>
          </div>

          {showLogin && (
            <LoginPanel
              onClose={() => setShowLogin(false)}
              onLogin={(u) => {
                setUser(u);
                setShowLogin(false);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Menu;
