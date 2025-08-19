import axios from 'axios';

// The base URL of your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Your token key is 'token'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Interceptor to automatically log out when the token expires
api.interceptors.response.use(
  (response) => response, // If the response is successful, do nothing
  (error) => {
    // If a 401 Unauthorized error occurs
    if (error.response && error.response.status === 401) {
      // Remove the old token
      localStorage.removeItem('token'); 
      localStorage.removeItem('display_name');
      alert("Session expired. Please log in again.");
      
      // Redirect the user to the login page
      window.location.href = '/login'; // Your login page route
    }
    return Promise.reject(error);
  }
);

export default api;