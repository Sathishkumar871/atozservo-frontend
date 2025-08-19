import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Menu from "./Menu";
import Notification from "./Notification";
import BottomNav from "./BottomNav";
import PostServiceForm from "./PostServiceForm";
import Scrolling from "./scrolling";
import MainButtons from './mainbuttons'; 

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
  const [showPipedPlayer, setShowPipedPlayer] = useState(false);

  const handlePostClick = () => {
    if (!user) {
      onLoginClick();
    } else {
      setShowPostForm(true);
    }
  };

  const handleYouTubeClick = () => {
    setShowPipedPlayer(true);
  };

  return (
    <>
      <header className="sticky-header">
        <div className="header-content">
          <div className="logo-section" onClick={handleYouTubeClick}>
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

        {/* --- మార్పు ఇక్కడే చేసాము --- */}
        {/* ఇప్పుడు Scrolling పైన ఉంది */}
        <Scrolling />

        {/* ఐకాన్ బటన్లు Scrolling కింద ఉన్నాయి */}
        <MainButtons />

        {showPipedPlayer && (
          <div className="youtube-player-wrapper">

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