import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  RiUser3Line,
  RiSettings3Line,
  RiCustomerService2Line,
  RiStarLine,
  RiMore2Line,
} from "react-icons/ri";

import "./AccountPage.css";

interface AccountPageProps {
  user?: {
    email?: string;
    [key: string]: any;
  };
  setUser: React.Dispatch<React.SetStateAction<any>>;
  // ✅ App.tsx nundi onLoginClick prop vasthundi, so ikkada define cheyyali
  onLoginClick: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, setUser, onLoginClick }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔄 Fetch user data from the backend on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          onLoginClick(); // ✅ navigate('/login') ki badulu ee prop call cheyyali
          return;
        }

        const response = await axios.get('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data.user);
        if (response.data.user?.profileImage) {
          setProfileImage(response.data.user.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem('token');
        onLoginClick(); // ✅ Error unna login ki pampali
      }
    };

    // user prop null ga unte matrame fetch cheyyali
    if (!user) { 
      fetchUser();
    }
  }, [navigate, user, setUser, onLoginClick]); // ✅ dependencies lo onLoginClick add cheyyadam better

  // 🔄 Handle image upload to the backend
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Create a local preview
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    try {
      // 🚀 Create FormData to send the file to the server
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const token = localStorage.getItem('token');
      
      // 💡 Assuming you have a backend route to handle profile image uploads
      const response = await axios.post('/api/user/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // 🔄 Update the state with the new image URL from the server
      const updatedUser = { ...user, profileImage: response.data.imageUrl };
      setUser(updatedUser);
      setProfileImage(response.data.imageUrl); // Update state with the final URL from Cloudinary
      alert('Profile image updated successfully!');
      
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image.');
      // Revert to the original image on error
      if (user?.profileImage) {
          setProfileImage(user.profileImage);
      } else {
          setProfileImage(null);
      }
    }
  };

  if (!user) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <label htmlFor="upload-input">
            <div
              className="profile-pic"
              style={{
                backgroundImage: profileImage
                  ? `url(${profileImage})`
                  : "url('https://via.placeholder.com/100')",
              }}
            ></div>
          </label>
          <input
            type="file"
            id="upload-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
            {user.email || "No email available"}
          </p>
        </div>
       </div>

      <div className="profile-options">
        <div
          className="option-card"
          onClick={() => navigate("/edit-profile", { state: { user } })}
        >
          <RiUser3Line className="icon" />
          <span>Manage Account</span>
        </div>
        <div className="option-card">
          <RiSettings3Line className="icon" />
          <span>Marketplace Settings</span>
        </div>
        <div className="option-card">
          <RiCustomerService2Line className="icon" />
          <span>Support</span>
        </div>
        <div className="option-card">
          <RiStarLine className="icon" />
          <span>Rate App</span>
        </div>
        <div className="option-card">
          <RiMore2Line className="icon" />
          <span>Others</span>
        </div>
       </div>

    </div>
  );
};

export default AccountPage;