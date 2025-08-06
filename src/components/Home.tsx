import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Menu from "./Menu";
import Notification from "./Notification";
import BottomNav from "./BottomNav";
import PostServiceForm from "./PostServiceForm";

import "./Home.css";

interface User {
  email: string;
  token?: string;
  profileCompleted?: boolean;
}

interface Props {
  user: User | null;
  onLoginClick: () => void;
}

const Home: React.FC<Props> = ({ user, onLoginClick }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [isPanelOpen] = useState(false);
  const [showPipedPlayer, setShowPipedPlayer] = useState(false); // ⬅️ Add this line

  const handlePostClick = () => {
    if (!user) {
      onLoginClick(); // 👉 Triggers login panel from App.tsx
    } else {
      setShowPostForm(true);
    }
  };

  const handleYouTubeClick = () => {
    setShowPipedPlayer(true); // ⬅️ Show PipedPlayer
  };

  return (
    <>
      <header className="sticky-header">
        <div className="header-content">
          <div className="logo-section" onClick={handleYouTubeClick}> {/* ⬅️ Add onClick */}
            <img
              src="https://res.cloudinary.com/dlkborjdl/image/upload/v1751882045/WhatsApp_Image_2025-07-05_at_22.20.45_59cde82e_cavjfj.jpg"
              alt="AtoZ Logo"
              className="app-logo"
            />
            <span className="logo-text">atozservo</span>
          </div>

          <SearchBar />
          <Menu user={user} setUser={() => {}} />
          <Notification isPanelOpen={isPanelOpen} />
        </div>
      </header>

      <main className="scrollable-content">
        <div className="long-box">
          <h1>Welcome to AtoZ Services!</h1>
        </div>

        {showPipedPlayer && (
          <div className="youtube-player-wrapper">  {/* You can style this in CSS */}
           
          </div>
        )}

      </main>

      {showPostForm && user && (
        <PostServiceForm
          onClose={() => setShowPostForm(false)}
          user={user}
          openLogin={onLoginClick}
        />
      )}

      <BottomNav user={user} openLogin={onLoginClick} openPost={handlePostClick} />
    </>
  );
};

export default Home;
