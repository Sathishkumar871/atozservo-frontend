import React, { useState } from 'react';
import './Menu.css';
import { TiThMenu } from 'react-icons/ti';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import { HiOutlineLogout } from 'react-icons/hi';
import { PiInfoBold } from 'react-icons/pi';

import LoginPanel from './LoginPanel';
import PolicyPanel from './PolicyPanel';

interface MenuProps {
  user: any;
  setUser: (user: any) => void;
}

const Menu: React.FC<MenuProps> = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPolicyPanel, setShowPolicyPanel] = useState(false);

  const [, setSelectedItem] = useState('');

  const toggleMenu = () => setIsOpen(!isOpen);

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
        <>
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
                  <p style={{ fontWeight: 'bold' }}>👋 Welcome</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{user.email}</p>

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
        </>
      )}
    </>
  );
};

export default Menu;
