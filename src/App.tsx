import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Category from './components/Category';
import Chat from './components/Chat';
import ServiceDetails from './components/ServiceDetails';
import ChatRoom from './components/ChatRoom';
import EditProfile from './components/EditProfile';
import SearchResults from './components/SearchResults';
import AccountPage from './components/AccountPage';
import FindPartnerPage from './components/FindPartnerPage';
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

// Leaflet fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loginVisible, setLoginVisible] = useState(false);

  // ✅ Auto Login (token or deviceId)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const deviceId = localStorage.getItem('deviceId');

    const fetchAndSetUser = async (email: string, token: string | null = null) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, { email });
        const fullUser = { ...res.data.user, token };
        setUser(fullUser);
      } catch (err) {
        console.error("❌ Failed to fetch full user data", err);
        localStorage.removeItem('token');
      }
    };

    if (token) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/check-session`, { token })
        .then((res) => {
          if (res.data.valid) {
            fetchAndSetUser(res.data.email, token);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => localStorage.removeItem('token'));
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
      localStorage.setItem('deviceId', newDeviceId);
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
          <Route
            path="/"
            element={<Home user={user} onLoginClick={() => setLoginVisible(true)} />}
          />
          <Route path="/category" element={<Category />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatroom/:id?" element={<ChatRoom />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/find-partner-options" element={<FindPartnerPage />} />
          <Route path="/videocall/:id" element={<VideoCallMobile />} />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} />} />
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
            setUser({ ...res.data.user, token: user.token });
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

              setUser(fullUser);
            }}
          />
        )}
      </Router>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" pauseOnHover closeOnClick />
    </ServiceProvider>
  );
}

export default App;
