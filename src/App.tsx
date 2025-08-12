// App.tsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Category from './components/Category';
import ServiceDetails from './components/ServiceDetails';
import EditProfile from './components/EditProfile';
import SearchResults from './components/SearchResults';
import AccountPage from './components/AccountPage';
import FindPartnerPage from './components/chats/FindPartnerPage';
import VideoCallMobile from './components/VideoCallMobile';
import LoginPanel from './components/LoginPanel'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import socket from './socket';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ServiceProvider } from './contexts/ServiceContext';
import AtozServoChatBot from "./components/AtozServoChatBot";
import YouTubeSearch from './components/YouTubeSearch';
import SpotifyCallback from "./components/SpotifyCallback";
import GameDesign from './components/games/gamedesign';
import FreeFire from './components/games/FreeFireGame';
import Pubg from './components/games/Pubg';
import Finance from './components/finance/finance';
import MoneyLending from './components/finance/MoneyLending';
import Lobby from './components/chats/lobby';
import Room from './components/chats/Room';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loginVisible, setLoginVisible] = useState(false);
  
  
  const LoginRouteHandler = () => {
    const navigate = useNavigate();

    const handleLogin = async (userData: any) => {
      setLoginVisible(false); 
      toast.success('Login successful!');

      const deviceId = localStorage.getItem('deviceId') || nanoid();
      localStorage.setItem('deviceId', deviceId);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/store-device`, {
        email: userData.email,
        deviceId,
      });

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, {
        email: userData.email,
      });

      const fullUser = {
        ...res.data.user,
        token: userData.token || null,
      };

      localStorage.setItem("token", userData.token || "");
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);

      // ✅ లాగిన్ సక్సెస్ అయిన వెంటనే హోమ్ పేజీకి navigate చెయ్యాలి
      navigate('/home');
    };

    return <LoginPanel onClose={() => navigate('/home')} onLogin={handleLogin} />;
  };

  // ✅ Auto Login + localStorage caching
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const deviceId = localStorage.getItem("deviceId");

    if (userString) {
      const parsedUser = JSON.parse(userString);
      setUser(parsedUser);
      return;
    }

    const fetchAndSetUser = async (email: string, token: string | null = null) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, { email });
        const fullUser = { ...res.data.user, token };
        localStorage.setItem("user", JSON.stringify(fullUser));
        setUser(fullUser);
      } catch (err) {
        console.error("❌ Failed to fetch user data", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    if (token) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/check-session`, { token })
        .then((res) => {
          if (res.data.valid) {
            fetchAndSetUser(res.data.email, token);
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => localStorage.removeItem("token"));
    } else if (deviceId) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/device/auto-login`, { deviceId })
        .then((res) => {
          if (res.data.user?.email) {
            fetchAndSetUser(res.data.user.email);
          }
        })
        .catch(() => console.log('❌ Device not found for auto-login'));
    } else {
      const newDeviceId = nanoid();
      localStorage.setItem("deviceId", newDeviceId);
    }
  }, []);

  // 🔌 Socket setup
  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Socket Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <ServiceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home user={user} onLoginClick={() => setLoginVisible(true)} />} />
          <Route path="/category" element={<Category />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/find-partner-options" element={<FindPartnerPage />} />
          <Route path="/videocall/:id" element={<VideoCallMobile />} />
           <Route path="/chat" element={<Lobby />} />
           <Route path="/lobby" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} onLoginClick={() => setLoginVisible(true)} />} />
          <Route path="/youtube" element={<YouTubeSearch />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          <Route path="/gamedesign" element={<GameDesign />} />
          <Route path="/freefire" element={<FreeFire />} />
          <Route path="/pubg" element={<Pubg />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/money-lending" element={<MoneyLending />}/>
          <Route path="/login" element={<LoginRouteHandler />} />
          <Route
            path="/edit-profile"
            element={
              user ? (
                <EditProfile
                  user={user}
                  onClose={() => {}}
                  onComplete={async () => {
                    try {
                      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, {
                        email: user.email,
                      });
                      const updatedUser = { ...res.data.user, token: user.token };
                      setUser(updatedUser);
                      localStorage.setItem("user", JSON.stringify(updatedUser));
                    } catch (error) {
                      console.error("❌ Failed to refresh user after profile update");
                    }
                  }}
                />
              ) : (
                <p>Please log in to edit your profile.</p>
              )
            }
          />
        </Routes>

        {/* 🔐 Login Panel */}
        {loginVisible && (
          <LoginPanel
            onClose={() => setLoginVisible(false)}
            onLogin={async (userData) => {
              setLoginVisible(false);
              toast.success('Login successful!');

              const deviceId = localStorage.getItem('deviceId') || nanoid();
              localStorage.setItem('deviceId', deviceId);

              await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/store-device`, {
                email: userData.email,
                deviceId,
              });

              const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, {
                email: userData.email,
              });

              const fullUser = {
                ...res.data.user,
                token: userData.token || null,
              };

              localStorage.setItem("token", userData.token || "");
              localStorage.setItem("user", JSON.stringify(fullUser));
              setUser(fullUser);
            }}
          />
        )}
      </Router>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" pauseOnHover closeOnClick />
      <AtozServoChatBot />
    </ServiceProvider>
  );
}

export default App;