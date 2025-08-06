// src/components/VideoCallMobile.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import socket from "../socket"; // Socket.IO client
import "./VideoCallMobile.css"; // Styles for the video call component

const VideoCallMobile: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null); // Ref for local video element
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // Ref for remote video element
  const navigate = useNavigate(); // Hook for navigation
  const { id: roomId } = useParams<{ id: string }>(); // Get the roomId from URL

  const [micOn, setMicOn] = useState(true); // State for microphone toggle
  const [camOn, setCamOn] = useState(true); // State for camera toggle
  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // Local media stream
  const peerRef = useRef<RTCPeerConnection | null>(null); // WebRTC PeerConnection instance
  const [callTime, setCallTime] = useState(0); // State for call duration
  const [callStarted, setCallStarted] = useState(false); // State to indicate if call has started
  const [callStatus, setCallStatus] = useState("Connecting..."); // Status message for the call

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined; // Timer for call duration

    const initCall = async () => {
      setCallStatus("Getting media...");
      try {
        // Request local media (video and audio)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setCallStatus("Establishing connection...");

        // Create a new RTCPeerConnection
        const peer = new RTCPeerConnection({
          iceServers: [ // Google's public STUN server for NAT traversal
            { urls: 'stun:stun.l.google.com:19302' },
          ],
        });
        peerRef.current = peer;

        // Add local tracks to the peer connection
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        // Handle ICE candidates (network information exchange)
        peer.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate);
            // Send ICE candidate to the other peer via Socket.IO
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        // Handle remote tracks (when remote peer's stream is received)
        peer.ontrack = (event) => {
          console.log("Remote track received:", event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus("Call Connected");
            setCallStarted(true);
            // Start call timer when remote stream is received
            timer = setInterval(() => setCallTime(t => t + 1), 1000);
          }
        };

        // Join the specific video call room on the backend
        socket.emit("join-video-call-room", roomId);

        // Listen for SDP offers from the other peer
        socket.on("offer", async (offer) => {
          console.log("Received offer:", offer);
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          console.log("Sending answer:", answer);
          socket.emit("answer", { roomId, answer });
        });

        // Listen for SDP answers from the other peer
        socket.on("answer", async (answer) => {
          console.log("Received answer:", answer);
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Listen for ICE candidates from the other peer
        socket.on("ice-candidate", async (candidate) => {
          console.log("Received ICE candidate:", candidate);
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        });

        // Listen for call ended signal from the other peer
        socket.on("call-ended", () => {
          alert("The other participant has ended the call.");
          endCall();
        });

        // Listen for call ended due to disconnect
        socket.on("call-ended-by-disconnect", () => {
          alert("The other participant disconnected.");
          endCall();
        });


       
        peer.onnegotiationneeded = async () => {
            try {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                console.log("Sending offer:", offer);
                socket.emit("offer", { roomId, offer });
            } catch (err) {
                console.error("Error creating offer:", err);
            }
        };

      } catch (error) {
        console.error("Error accessing media devices or initializing call:", error);
        setCallStatus("Failed to connect. Please check camera/mic permissions.");
        alert("Failed to access camera/microphone. Please ensure permissions are granted.");
        navigate("/chat"); // Go back if call cannot be initiated
      }
    };

    initCall();

    // Cleanup function: runs when component unmounts
    return () => {
      clearInterval(timer); // Stop call timer
      peerRef.current?.close(); // Close RTCPeerConnection
      localStream?.getTracks().forEach((track) => track.stop()); // Stop local media tracks
      // Remove Socket.IO listeners to prevent memory leaks
      socket.off("connect");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
      socket.off("call-ended-by-disconnect");
      // Inform backend that this client is leaving the call
      socket.emit("end-call", roomId);
    };
  }, [roomId, navigate, localStream]); // Dependencies for useEffect

  // Toggle microphone on/off
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !micOn);
      setMicOn(prev => !prev);
    }
  };

  // Toggle camera on/off
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !camOn);
      setCamOn(prev => !prev);
    }
  };

  // End the call
  const endCall = () => {
    // Clean up WebRTC connection and local media
    peerRef.current?.close();
    localStream?.getTracks().forEach(track => track.stop());
    // Navigate back to the main chat list
    navigate("/chat");
  };

  // Format call time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="video-call-wrapper full-screen">
      {!callStarted ? ( // Show connecting screen if call hasn't started
        <div className="connecting-screen">
          <div className="spinner"></div>
          <p>{callStatus}</p>
          <button className="cancel-call-btn" onClick={endCall}>
            <FaPhoneSlash size={24} />
            <span>Cancel</span>
          </button>
        </div>
      ) : ( // Show call interface once call has started
        <>
          <div className="video-header">
            <div className="profile-pic">
              {/* Placeholder for remote user's profile pic */}
              <img src="https://i.pravatar.cc/150?img=60" alt="partner" />
            </div>
            <div className="call-time">{formatTime(callTime)}</div>
          </div>

          <div className="video-area">
            {/* Remote video stream */}
            <video ref={remoteVideoRef} autoPlay className="caller-video" />
            {/* Local video stream (muted) */}
            <video ref={localVideoRef} autoPlay muted className="local-video" />
          </div>

          <div className="call-controls">
            {/* Microphone toggle button */}
            <button className={`control-btn ${micOn ? "" : "off"}`} onClick={toggleMic}>
              {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            {/* End Call button */}
            <button className="end-call-btn" onClick={endCall}>
              <FaPhoneSlash />
            </button>

            {/* Camera toggle button */}
            <button className={`control-btn ${camOn ? "" : "off"}`} onClick={toggleCam}>
              {camOn ? <FaVideo /> : <FaVideoSlash />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCallMobile;
