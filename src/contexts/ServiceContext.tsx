import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface Service {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  address?: string;
  phone?: string;
  [key: string]: any;
}

interface ServiceContextType {
  allServices: Service[];
  setAllServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

// Create the context
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Custom hook
export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
};

// Provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allServices, setAllServices] = useState<Service[]>([]);

  useEffect(() => {
    axios.get('/api/services')
      .then((res) => setAllServices(res.data))
      .catch((err) => console.error("ServiceContext fetch failed:", err));
  }, []);

  return (
    <ServiceContext.Provider value={{ allServices, setAllServices }}>
      {children}
    </ServiceContext.Provider>
  );
};