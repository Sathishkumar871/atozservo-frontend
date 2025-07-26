import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPanel.css";
import { nanoid } from "nanoid";

interface Props {
  onClose: () => void;
  onLogin: (user: any) => void;
}

const LoginPanel: React.FC<Props> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send-otp`, { email });
      alert("OTP sent to your email.");
      setOtpSent(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify-otp`, {
        email,
        otp,
      });

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);

      const userData = {
        email: res.data.user.email,
        token: res.data.token,
        profileCompleted: res.data.user.profileCompleted || false,
      };

      // 🔐 Set deviceId if not already present
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = nanoid();
        localStorage.setItem("deviceId", deviceId);
      }

      // ✅ Store device in backend
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/device/store-device`, {
        email: userData.email,
        deviceId,
      });

      onLogin(userData);
      navigate("/edit-profile");
    } catch (error: any) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="login-panel-side">
      <h3>🔐 AtoZ Services</h3>
      <div className="login-form">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {otpSent ? (
          <>
            <label>Enter OTP</label>
            <div className="otp-input-container">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="otp-box"
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const newOtp = otp.split("");
                    newOtp[i] = val;
                    setOtp(newOtp.join(""));
                  }}
                />
              ))}
            </div>

            <button className="submit-btn" onClick={verifyOtp}>
              ✅ Verify OTP
            </button>
          </>
        ) : (
          <button className="submit-btn" onClick={sendOtp}>
            📤 Send OTP
          </button>
        )}

        <button onClick={onClose} className="toggle-btn">
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default LoginPanel;
