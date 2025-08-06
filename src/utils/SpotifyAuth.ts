// utils/SpotifyAuth.ts
const clientId = "fd2373ec00bb4b469d3f04384b81cd5b";
const redirectUri = "http://localhost:3000/callback"; // make sure it matches Spotify app settings
const scope = "user-read-private user-read-email";

export const getSpotifyAuthUrl = () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;
  return authUrl;
};
