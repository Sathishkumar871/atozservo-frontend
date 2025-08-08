"use client";
import  { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPhone, FaComment,  FaPhoneSlash } from "react-icons/fa"; 
import { toast } from "react-toastify";
import socket from "../socket";
import "./ConnectingScreen.css";

const ConnectingScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const partnerName = searchParams.get("partnerName") || "Partner";
  const partnerAvatar = searchParams.get("partnerAvatar") || "/default-avatar.png";

  const [timeLeft, setTimeLeft] = useState(600);
  const [isDisconnected, setIsDisconnected] = useState(false); 

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const onPartnerDisconnected = () => {
      toast.info("Your partner has disconnected.");
      setIsDisconnected(true);
      if (timer) clearInterval(timer);
      setTimeout(() => router.push("/find-partner"), 3000);
    };

    socket.on("partner-disconnected", onPartnerDisconnected);

    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warn("Time limit reached. Call ended.");
          router.push("/find-partner");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
      socket.off("partner-disconnected", onPartnerDisconnected);
    };
  }, [router, partnerName]);

  const handleEndCall = () => {
    socket.emit("end-call", { partnerName });
    toast.info("You have ended the call.");
    router.push("/find-partner");
  };

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
      
      {/* ✅ Display a message when disconnected */}
      {isDisconnected && <p className="text-red-500 font-bold mt-4">Call Ended.</p>}

      <div className="actions">
        <button className="btn end-btn" onClick={handleEndCall} disabled={isDisconnected}>
          <FaPhoneSlash /> End
        </button>
        <button className="btn chat-btn" disabled={isDisconnected}>
          <FaComment /> Chat
        </button>
        <button className="btn call-btn" disabled={isDisconnected}>
          <FaPhone /> Call
        </button>
      </div>
    </div>
  );
};

export default ConnectingScreen;
