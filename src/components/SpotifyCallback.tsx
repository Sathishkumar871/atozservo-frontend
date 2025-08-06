import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      navigate("/"); // back to home or dashboard
    } else {
      console.error("Access token not found.");
    }
  }, [navigate]);

  return (
    <div className="text-center p-4">
      <p>Logging you in with Spotify...</p>
    </div>
  );
};

export default SpotifyCallback;
