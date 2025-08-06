import React from 'react';
import './YouTubeLogo.css';

interface YouTubeLogoProps {
  onClick: () => void;
}

const YouTubeLogo: React.FC<YouTubeLogoProps> = ({ onClick }) => {
  return (
    <div className="youtube-logo-container" onClick={onClick}>
      <div className="youtube-icon">
        <div className="play-button">
          <span className="play-symbol">&#9658;</span>
        </div>
      </div>
    </div>
  );
};

export default YouTubeLogo;
