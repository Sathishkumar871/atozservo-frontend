import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  email: string;
  name?: string;
  [key: string]: any; 
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const autoLogin = () => {
      setIsLoading(true);
      const userString = localStorage.getItem("user");
      if (userString) {
        setUser(JSON.parse(userString));
      }
      setIsLoading(false);
    };
    autoLogin();
  }, []);
  
  const fetchUserByEmail = async (email: string, token: string | null = null) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/get-user`, { email });
      const fullUser = { ...res.data.user, token };
      localStorage.setItem("user", JSON.stringify(fullUser));
      if (token) localStorage.setItem("token", token);
      setUser(fullUser);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      logout();
    }
  };

  const login = async (userData: any) => {
    toast.success('Login successful!');
    await fetchUserByEmail(userData.email, userData.token);
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = { user, setUser, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};