import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { toast } from 'react-toastify'; 
import socket from "../socket";
import "./VideoCallMobile.css";
const VideoCallMobile: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { id: roomId } = useParams<{ id: string }>();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [callTime, setCallTime] = useState(0);
  const [callStarted, setCallStarted] = useState(false);
  const [callStatus, setCallStatus] = useState("Connecting...");

  
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const initCall = async () => {
      if (!roomId) {
        toast.error("Room ID is missing.");
        navigate("/chat");
        return;
      }
      
      setCallStatus("Getting media...");
      try {
      
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setCallStatus("Establishing connection...");

       
        const peer = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
           
          ],
        });
        peerRef.current = peer;

        
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        
        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

       
        peer.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus("Call Connected");
            setCallStarted(true);
            timer = setInterval(() => setCallTime(t => t + 1), 1000);
          }
        };

       
        socket.emit("join-video-call-room", roomId);

       
        socket.on("offer", async (offer) => {
          if (!peerRef.current) return;
          try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          } catch (e) {
            console.error("Error handling offer:", e);
          }
        });

       
        socket.on("answer", async (answer) => {
          if (!peerRef.current) return;
          try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (e) {
            console.error("Error handling answer:", e);
          }
        });

        
        socket.on("ice-candidate", async (candidate) => {
          if (!peerRef.current) return;
          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        });

      
        socket.on("call-ended", () => {
          toast.info("The other participant has ended the call.");
          endCall();
        });

       
        socket.on("call-ended-by-disconnect", () => {
          toast.info("The other participant disconnected.");
          endCall();
        });

       
        peer.onnegotiationneeded = async () => {
            try {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                socket.emit("offer", { roomId, offer });
            } catch (err) {
                console.error("Error creating offer:", err);
            }
        };

      } catch (error) {
        console.error("Error accessing media devices or initializing call:", error);
        setCallStatus("Failed to connect. Please check camera/mic permissions.");
        toast.error("Failed to access camera/microphone. Please ensure permissions are granted.");
        navigate("/chat");
      }
    };

    initCall();

    return () => {
      clearInterval(timer);
      peerRef.current?.close();
      localStream?.getTracks().forEach((track) => track.stop());
      socket.off("connect");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
      socket.off("call-ended-by-disconnect");
    };
  }, [roomId, navigate, localStream]);

  
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !micOn);
      setMicOn(prev => !prev);
    }
  };

  
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !camOn);
      setCamOn(prev => !prev);
    }
  };

  const endCall = () => {
    socket.emit("end-call", roomId);
    peerRef.current?.close();
    localStream?.getTracks().forEach(track => track.stop());
    navigate("/chat");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="video-call-wrapper full-screen">
      {!callStarted ? (
        <div className="connecting-screen">
          <div className="spinner"></div>
          <p>{callStatus}</p>
          <button className="cancel-call-btn" onClick={endCall}>
            <FaPhoneSlash size={24} />
            <span>Cancel</span>
          </button>
        </div>
      ) : (
        <>
          <div className="video-header">
            <div className="profile-pic">
              <img src="https://i.pravatar.cc/150?img=60" alt="partner" />
            </div>
            <div className="call-time">{formatTime(callTime)}</div>
          </div>

          <div className="video-area">
            <video ref={remoteVideoRef} autoPlay className="caller-video" />
            <video ref={localVideoRef} autoPlay muted className="local-video" />
          </div>

          <div className="call-controls">
            <button className={`control-btn ${micOn ? "" : "off"}`} onClick={toggleMic}>
              {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            <button className="end-call-btn" onClick={endCall}>
              <FaPhoneSlash />
            </button>

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
