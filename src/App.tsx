
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Category from './components/Category';
import Grocery from './components/grocary';
import Travel from './components/travel';
import Food from './components/food/food';
import ServiceDetails from './components/ServiceDetails';
import EditProfile from './components/EditProfile';
import SearchResults from './components/SearchResults';
import AccountPage from './components/AccountPage';
import FindPartnerPage from './components/chats/FindPartnerPage';
import VideoCallMobile from './components/VideoCallMobile';
import LoginPanel from './components/LoginPanel'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState} from 'react';
import { ReactNode } from "react";
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
import SupportChat from './components/SupportChat';
import Room from './components/chats/Room';
import RateAppPage from "./components/RateAppPage";
import ServiceListPage from './components/ServiceListPage';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Login handler remains the same
  const LoginRouteHandler = () => {
    const navigate = useNavigate();
    const handleLogin = async (userData: any) => {
      setLoginVisible(false); 
      toast.success('Login successful!');
      const deviceId = localStorage.getItem('deviceId') || nanoid();
      localStorage.setItem('deviceId', deviceId);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/store-device`, { email: userData.email, deviceId });
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, { email: userData.email });
      const fullUser = { ...res.data.user, token: userData.token || null };
      localStorage.setItem("token", userData.token || "");
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
      navigate('/home');
    };
    return <LoginPanel onClose={() => navigate('/home')} onLogin={handleLogin} />;
  };

  // Auth logic remains the same
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const deviceId = localStorage.getItem("deviceId");
    setIsLoading(true);
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
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (userString) {
      setUser(JSON.parse(userString));
      setIsLoading(false);
      return;
    }
    if (token) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/check-session`, { token })
        .then((res) => {
          if (res.data.valid) fetchAndSetUser(res.data.email, token);
          else { localStorage.removeItem("token"); setIsLoading(false); }
        })
        .catch(() => { localStorage.removeItem("token"); setIsLoading(false); });
    } else if (deviceId) {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/auto-login`, { deviceId })
        .then((res) => {
          if (res.data.user?.email) fetchAndSetUser(res.data.user.email);
          else setIsLoading(false);
        })
        .catch(() => { console.log('❌ Device not found for auto-login'); setIsLoading(false); });
    } else {
      const newDeviceId = nanoid();
      localStorage.setItem("deviceId", newDeviceId);
      setIsLoading(false);
    }
  }, []);

  // Socket logic remains the same
  useEffect(() => {
    socket.on('connect', () => console.log('🟢 Socket Connected:', socket.id));
    socket.on('disconnect', () => console.log('🔴 Socket Disconnected'));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Protected Route logic remains the same
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  // --- NEW: Helper component for EditProfile route ---
  // This component will handle navigation correctly after profile updates.
  const EditProfileRouteHandler = () => {
    const navigate = useNavigate();

    const handleProfileUpdateComplete = async () => {
      try {
        // Refetch user data to update the state in the whole app
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, {
          email: user.email,
        });
        const updatedUser = { ...res.data.user, token: user.token };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Navigate back to the account page after successful update
        navigate('/account');
      } catch (error) {
        // This is the line that was causing the console error before
        console.error("❌ Failed to refresh user after profile update", error);
        toast.error("Could not refresh user data. Please check your details on the account page.");
        // Still navigate back even if refresh fails
        navigate('/account');
      }
    };

    return (
      <EditProfile
        user={user}
        onClose={() => navigate('/account')} // Simple navigation on close
        onComplete={handleProfileUpdateComplete} // Call the new handler on completion
      />
    );
  };

  return (
    <ServiceProvider>
      <Router>
        <Routes>
          {/* Public routes remain the same */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home user={user} onLoginClick={() => setLoginVisible(true)} />} />
          <Route path="/category" element={<Category />} />
          <Route path="/food" element={<Food />} />
          <Route path="/travel" element={<Travel user={user} />} />
          <Route path="/grocery" element={<Grocery />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/services/:serviceType" element={<ServiceListPage />} />
          <Route path="/rate-app" element={<RateAppPage />} />
          <Route path="/find-partner-options" element={<FindPartnerPage />} />
          <Route path="/videocall/:id" element={<VideoCallMobile />} />
          <Route path="/chat" element={<Lobby />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/youtube" element={<YouTubeSearch />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          <Route path="/gamedesign" element={<GameDesign />} />
          <Route path="/freefire" element={<FreeFire />} />
          <Route path="/pubg" element={<Pubg />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/money-lending" element={<MoneyLending />}/>
          <Route path="/login" element={<LoginRouteHandler />} />

          {/* Protected Routes now use the new handler for EditProfile */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage user={user} setUser={setUser} onLoginClick={() => setLoginVisible(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportChat user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                {/* --- UPDATED: Using the new, cleaner route handler --- */}
                <EditProfileRouteHandler />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Login Panel logic remains the same */}
        {loginVisible && (
          <LoginPanel
            onClose={() => setLoginVisible(false)}
            onLogin={async (userData) => {
              setLoginVisible(false);
              toast.success('Login successful!');
              const deviceId = localStorage.getItem('deviceId') || nanoid();
              localStorage.setItem('deviceId', deviceId);
              await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/store-device`, { email: userData.email, deviceId });
              const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, { email: userData.email });
              const fullUser = { ...res.data.user, token: userData.token || null };
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