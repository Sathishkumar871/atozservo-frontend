import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  RiUser3Line,
  RiSettings3Line,
  RiCustomerService2Line,
  RiStarLine,
  RiMore2Line
} from "react-icons/ri";

import "./AccountPage.css";

interface AccountPageProps {
  user?: {
    email?: string;
    profileImage?: string;
    [key: string]: any;
  };
  setUser: React.Dispatch<React.SetStateAction<any>>;
  onLoginClick: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, setUser, onLoginClick }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          onLoginClick();
          return;
        }

        const response = await axios.get(`${backendUrl}/api/user/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setUser(response.data.user);
        if (response.data.user?.profileImage) {
          setProfileImage(response.data.user.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem('token');
        onLoginClick();
      }
    };

    if (!user) {
      fetchUser();
    } else if (user.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user, setUser, onLoginClick, backendUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const optimisticImageUrl = URL.createObjectURL(file);
    setProfileImage(optimisticImageUrl);

    try {
      const formData = new FormData();
      formData.append('profileImage', file); // ✅ matches backend

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        `${backendUrl}/api/user/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const newImageUrl = response.data.imageUrl;

      const updatedUser = { ...user, profileImage: newImageUrl };
      setUser(updatedUser);
      setProfileImage(newImageUrl);

      alert("✅ Profile image updated successfully!");
    } catch (error: any) {
      console.error('❌ Image upload failed:', error.response?.data || error.message);
      alert(`❌ Upload failed: ${error.response?.data?.message || error.message}`);
      setProfileImage(user?.profileImage || null);
    } finally {
      setIsUploading(false);
      if (optimisticImageUrl) {
        URL.revokeObjectURL(optimisticImageUrl);
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
            >
              {isUploading && <div className="upload-overlay"></div>}
            </div>
          </label>
          <input
            type="file"
            id="upload-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={isUploading}
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
        <div className="option-card" onClick={() => navigate("/support")}>
          <RiCustomerService2Line className="icon" />
          <span>Support</span>
        </div>
        <div className="option-card" onClick={() => navigate("/rate-app")}>
          <RiStarLine className="icon" />
          <span>Rate Website</span>
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
