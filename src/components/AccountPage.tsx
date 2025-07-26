import React, { useState } from "react";

import "./AccountPage.css";
import {
  RiUser3Line,
  RiSettings3Line,
  RiCustomerService2Line,
  RiStarLine,
  RiMore2Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface AccountPageProps {
  user: {
    email?: string;
    [key: string]: any;
  };
   setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AccountPage: React.FC<AccountPageProps> = ({ user }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

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
          {/* Display user email safely */}
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
            {user?.email || "No email available"}
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
