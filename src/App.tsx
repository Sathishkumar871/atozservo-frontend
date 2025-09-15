// src/App.tsx
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Category from './components/Category';
//import Grocery from './components/grocary/pages/Grocery';
import Travel from './components/travel';
import Food from './components/food/food';
import ServiceDetails from './components/ServiceDetails';
//import EditProfile from './components/EditProfile';
import SearchResults from './components/SearchResults';
import AccountPage from './components/AccountPage';
import VideoCallMobile from './components/VideoCallMobile';
import LoginPanel from './components/LoginPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, ReactNode } from 'react';
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
import SupportChat from './components/SupportChat';
import RateAppPage from "./components/RateAppPage";
import ServiceListPage from './components/ServiceListPage';
import Lobby from './pages/Lobby';
import Room from './pages/Room';
import AddProduct from './components/grocary/seller/AddProduct';
import SellerLayout from './components/grocary/seller/SellerLayout.';
import SellerLogin from './components/grocary/seller/SellerLogin';
import ProductList from './components/grocary/seller/ProductList';
import Orders from './components/grocary/seller/Orders';
//import ProductDisplay from './components/grocary/pages/ProductDisplay';
import VegetablesPage from './components/grocary/pages/grocaryfiles/VegetablesPage';
import FruitsPage from './components/grocary/pages/grocaryfiles/FruitsPage';
import DrinksPage from './components/grocary/pages/grocaryfiles/DrinksPage';
import GrainsPage from './components/grocary/pages/grocaryfiles/GrainsPage';
import SnacksPage from './components/grocary/pages/grocaryfiles/SnacksPage';

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState<any>(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const LoginRouteHandler = () => {
    const navigate = useNavigate();
    const handleLogin = async (userData: any) => {
      setLoginVisible(false);
      toast.success('Login successful!');
      const deviceId = localStorage.getItem('deviceId') || nanoid();
      localStorage.setItem('deviceId', deviceId);

      await axios.post(`${apiUrl}/api/device/store-device`, { email: userData.email, deviceId });
      const res = await axios.post(`${apiUrl}/api/otp/get-user`, { email: userData.email });

      const fullUser = { ...res.data.user, token: userData.token || null };
      localStorage.setItem("token", userData.token || "");
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
      navigate('/home');
    };

    return <LoginPanel onClose={() => navigate('/home')} onLogin={handleLogin} />;
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const deviceId = localStorage.getItem("deviceId");
    setIsLoading(true);

    const fetchAndSetUser = async (email: string, token: string | null = null) => {
      try {
        const res = await axios.post(`${apiUrl}/api/otp/get-user`, { email });
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
      axios.post(`${apiUrl}/api/otp/check-session`, { token })
        .then((res) => {
          if (res.data.valid) fetchAndSetUser(res.data.email, token);
          else { localStorage.removeItem("token"); setIsLoading(false); }
        })
        .catch(() => { localStorage.removeItem("token"); setIsLoading(false); });
    } else if (deviceId) {
      axios.post(`${apiUrl}/api/device/auto-login`, { deviceId })
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
  }, [apiUrl]);

  useEffect(() => {
    socket.on('connect', () => console.log('🟢 Socket Connected:', socket.id));
    socket.on('disconnect', () => console.log('🔴 Socket Disconnected'));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  const EditProfileRouteHandler = () => {
    const navigate = useNavigate();
    const handleProfileUpdateComplete = async () => {
      try {
        const res = await axios.post(`${apiUrl}/api/otp/get-user`, { email: user.email });
        const updatedUser = { ...res.data.user, token: user.token };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate('/account');
      } catch (error) {
        console.error("❌ Failed to refresh user after profile update", error);
        toast.error("Could not refresh user data. Please check your details on the account page.");
        navigate('/account');
      }
    };
    
  };

  return (
    <ServiceProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home user={user} onLoginClick={() => setLoginVisible(true)} />} />
        <Route path="/category" element={<Category />} />
        <Route path="/food" element={<Food />} />
        <Route path="/travel" element={<Travel user={user} />} />
       
        <Route path="/vegetables" element={<VegetablesPage />} />
        <Route path="/fruits" element={<FruitsPage />} />
        <Route path="/drinks" element={<DrinksPage />} />
        <Route path="/grains" element={<GrainsPage />} />
        <Route path="/snacks" element={<SnacksPage />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/services/:serviceType" element={<ServiceListPage />} />
        <Route path="/rate-app" element={<RateAppPage />} />
        <Route path="/videocall/:id" element={<VideoCallMobile />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/youtube" element={<YouTubeSearch />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/gamedesign" element={<GameDesign />} />
        <Route path="/freefire" element={<FreeFire />} />
        <Route path="/pubg" element={<Pubg />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/money-lending" element={<MoneyLending />} />
        <Route path="/login" element={<LoginRouteHandler />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage user={user} setUser={setUser} onLoginClick={() => setLoginVisible(true)} /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportChat user={user} /></ProtectedRoute>} />
      
        <Route path="/seller" element={user ? <SellerLayout /> : <SellerLogin />}>
          <Route index element={user ? <AddProduct /> : null} />
          <Route path="product-list" element={user ? <ProductList /> : null} />
          <Route path="orders" element={user ? <Orders /> : null} />
        </Route>
      </Routes>

      {loginVisible && (
        <LoginPanel
          onClose={() => setLoginVisible(false)}
          onLogin={async (userData) => {
            setLoginVisible(false);
            toast.success('Login successful!');
            const deviceId = localStorage.getItem('deviceId') || nanoid();
            localStorage.setItem('deviceId', deviceId);
            await axios.post(`${apiUrl}/api/device/store-device`, { email: userData.email, deviceId });
            const res = await axios.post(`${apiUrl}/api/otp/get-user`, { email: userData.email });
            const fullUser = { ...res.data.user, token: userData.token || null };
            localStorage.setItem("token", userData.token || "");
            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);
          }}
        />
      )}

      <ToastContainer position="top-center" autoClose={2000} theme="colored" pauseOnHover closeOnClick />
      <AtozServoChatBot />
    </ServiceProvider>
  );
}

export default App;
