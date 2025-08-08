import React, { useState } from "react";
import "./SpotifyLogo.css";
import { FaSpotify } from "react-icons/fa";

const CLIENT_ID = "fd2373ec00bb4b469d3f04384b81cd5b";
const REDIRECT_URI =  "https://atozservo.xyz/callback";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
].join(" ");
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

const SpotifyLogo: React.FC = () => {
  const [showPlayer] = useState(false);

  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="spotify-container">
      <div
        className="glassy-spotify cursor-pointer"
        onClick={() => {
          handleLogin(); 
        }}
      >
        <FaSpotify size={36} />
      </div>

      {showPlayer && (
        <div className="spotify-player-wrapper mt-3">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4dyzvuaRJ0n?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default SpotifyLogo;
