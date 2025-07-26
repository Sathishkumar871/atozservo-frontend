"use client";
import  { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./ConnectingScreen.css";

const ConnectingScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const partnerName = searchParams.get("partnerName") || "Partner";
  const partnerAvatar = searchParams.get("partnerAvatar") || "/default-avatar.png";

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push("/find-partner");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="connecting-screen">
      <div className="connected-info">
        <img src={partnerAvatar} className="avatar-large" alt="Partner Avatar" />
        <h2>{partnerName}</h2>
        <p>Connected • Audio Only</p>
      </div>

      <div className="timer-box">
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </div>

      <div className="actions">
        <button className="btn end-btn" onClick={() => router.push("/find-partner")}>
          End
        </button>
        <button className="btn chat-btn">Chat</button>
        <button className="btn call-btn">Call</button>
      </div>
    </div>
  );
};

export default ConnectingScreen;
