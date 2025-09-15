import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import Peer from "peerjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";


// Declare types for non-standard browser APIs to fix TypeScript errors
interface Window {
  webkitAudioContext?: typeof AudioContext;
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

// Manually declare types for TensorFlow models to fix potential errors
declare module '@tensorflow-models/face-landmarks-detection' {
    export const SupportedPackages: {
        mediapipeFacemesh: any;
    };
    export function load(packageName: any): any;
}

interface ChatMessage { user: string; text?: string; image?: string; }
interface Participant { id: string; name: string; handRaised?: boolean; }
interface VideoStream { id: string; stream: MediaStream; }
interface Reaction { id: string; emoji: string; }

const VideoTile: React.FC<{
  stream: MediaStream;
  isLocal: boolean;
  reactions: string[];
  handRaised: boolean;
  id: string;
  speaking: boolean;
}> = ({ stream, isLocal, reactions, handRaised, id, speaking }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={`video-wrap ${speaking ? 'speaking' : ''}`}>
      <video ref={ref} autoPlay playsInline muted={isLocal} />
      <div className="video-overlay">
        {isLocal ? "Me" : id.slice(0, 6)}
        {handRaised && <span className="hand-raised">✋</span>}
      </div>
      {reactions.map((r, i) => <div key={i} className="reaction">{r}</div>)}
    </div>
  );
};

const randomName = () => `User-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [videoStreams, setVideoStreams] = useState<VideoStream[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [captions, setCaptions] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [bgActive, setBgActive] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const [captionsOn, setCaptionsOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const originalStreamRef = useRef<MediaStream | null>(null);
  const localPeerIdRef = useRef<string>("");
  const displayNameRef = useRef<string>(randomName());
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const peerConnectionsRef = useRef<Map<string, { call: Peer.MediaConnection; stream: MediaStream }>>(new Map());
  const audioAnalyzersRef = useRef<Map<string, { audioCtx: AudioContext; analyser: AnalyserNode; dataArray: Uint8Array }>>(new Map());

  const bodyPixNetRef = useRef<bodyPix.BodyPix | null>(null);
  const bgActiveRef = useRef(false);
  const faceModelRef = useRef<any>(null);

  const speechRecRef = useRef<any>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicElementRef = useRef<HTMLAudioElement | null>(null);
  const localAudioTrackRef = useRef<MediaStreamTrack | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // ---------------- Initialize ----------------
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    peerRef.current = new Peer();

    peerRef.current.on("open", (peerId) => {
      localPeerIdRef.current = peerId;
      setParticipants([{ id: peerId, name: displayNameRef.current }]);
      socketRef.current?.emit("join-video-call-room", { roomId, peerId, name: displayNameRef.current });
    });

    peerRef.current.on("call", (call) => {
      if (localStreamRef.current) call.answer(localStreamRef.current);
      call.on("stream", (stream) => addVideoStream(call.peer, stream));
      if (localStreamRef.current) {
        peerConnectionsRef.current.set(call.peer, { call, stream: localStreamRef.current });
      }
    });

    navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: { sampleRate: 48000, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    }).then((stream) => {
      localStreamRef.current = stream;
      originalStreamRef.current = stream;
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      addVideoStream(localPeerIdRef.current, stream);
      startFaceTriggers(stream);
    }).catch(err => console.error("Error accessing media devices: ", err));

    // ---------------- Socket Events ----------------
    socketRef.current.on("peer-joined-call", ({ peerId, name }: { peerId: string; name: string }) => {
      setParticipants(prev => [...prev, { id: peerId, name }]);
      if (!localStreamRef.current) return;
      const call = peerRef.current?.call(peerId, localStreamRef.current);
      call?.on("stream", (stream) => addVideoStream(peerId, stream));
      if (call) peerConnectionsRef.current.set(peerId, { call, stream: localStreamRef.current });
    });

    socketRef.current.on("user-disconnected", (peerId: string) => {
      setVideoStreams(prev => prev.filter(v => v.id !== peerId));
      setParticipants(prev => prev.filter(p => p.id !== peerId));
      setSpeakingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(peerId);
        return newSet;
      });
      peerConnectionsRef.current.delete(peerId);
      audioAnalyzersRef.current.get(peerId)?.audioCtx.close();
      audioAnalyzersRef.current.delete(peerId);
    });

    socketRef.current.on("chat-message", (msg: ChatMessage) => {
      setChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("transcript", ({ from, text, interim }: { from: string; text: string; interim: boolean; }) => {
      setCaptions((interim ? "(...) " : "") + text);
    });

    socketRef.current.on("hand-raised", ({ id, raised }: { id: string; raised: boolean }) => {
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, handRaised: raised } : p));
    });

    socketRef.current.on("reaction", ({ from, type }: { from: string; type: string }) => {
      setReactions(prev => [...prev, { id: from, emoji: type }]);
      setTimeout(() => setReactions(prev => prev.filter(r => r.id !== from || r.emoji !== type)), 2000);
    });

    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      peerRef.current?.destroy();
      socketRef.current?.disconnect();
      audioAnalyzersRef.current.forEach(a => a.audioCtx.close());
      stopSpeechRecognition();
      stopFaceTriggers();
    };
  }, [roomId]);

  // ---------------- Video Streams ----------------
  const addVideoStream = (id: string, stream: MediaStream) => {
    setVideoStreams(prev => {
      if (prev.find(v => v.id === id)) return prev;
      startSpeakingDetection(id, stream);
      return [...prev, { id, stream }];
    });
  };

  // ---------------- Speaking Detection ----------------
  const startSpeakingDetection = (id: string, stream: MediaStream) => {
    if (audioAnalyzersRef.current.has(id)) return;
    if (!stream.getAudioTracks().length) return;

    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      audioAnalyzersRef.current.set(id, { audioCtx, analyser, dataArray });

      const checkVolume = () => {
        if (!audioAnalyzersRef.current.has(id)) return;
        const { analyser, dataArray } = audioAnalyzersRef.current.get(id)!;
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setSpeakingUsers(prev => {
          const newSet = new Set(prev);
          if (volume > 25) newSet.add(id);
          else newSet.delete(id);
          return newSet;
        });
        requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (e) {
      console.warn("VAD not available", e);
    }
  };

  // ---------------- Controls ----------------
  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMuted(!track.enabled);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsCameraOff(!track.enabled);
  };

  const leave = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    peerRef.current?.destroy();
    socketRef.current?.disconnect();
    stopSpeechRecognition();
    stopRecording();
    navigate("/");
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { user: displayNameRef.current, text: chatInput };
    socketRef.current?.emit("chat-message", roomId, msg);
    setChatMessages(prev => [...prev, msg]);
    setChatInput("");
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgMsg = { user: displayNameRef.current, image: reader.result as string };
      socketRef.current?.emit("chat-message", roomId, imgMsg);
      setChatMessages(prev => [...prev, imgMsg]);
    };
    reader.readAsDataURL(file);
  };

  const raiseHand = () => {
    const raised = !participants.find(p => p.id === localPeerIdRef.current)?.handRaised;
    socketRef.current?.emit("hand-raised", { roomId, id: localPeerIdRef.current, raised });
    setParticipants(prev => prev.map(p => p.id === localPeerIdRef.current ? { ...p, handRaised: raised } : p));
  };

  const sendReaction = (emoji: string) => {
    socketRef.current?.emit("reaction", { roomId, type: emoji });
  };

  const toggleBgBlur = async () => {
    if (!bgActiveRef.current) {
      bgActiveRef.current = true;
      setBgActive(true);
      if (!bodyPixNetRef.current) bodyPixNetRef.current = await bodyPix.load();
      if (!myVideoRef.current || !localStreamRef.current) return;

      const video = myVideoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d')!;

      const render = async () => {
        if (!bgActiveRef.current) return;

        // Get the segmentation of the person from the video frame
        const segmentation = await bodyPixNetRef.current!.segmentPerson(video, {
          internalResolution: 'medium',
          segmentationThreshold: 0.7
        });

        // Step 1: Draw the full video frame with a blur filter. This creates the blurred background.
        ctx.filter = 'blur(15px)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Step 2: Use globalCompositeOperation to only draw the person's image
        ctx.globalCompositeOperation = 'destination-over';

        // Step 3: Draw the un-filtered person's image using the segmentation mask.
        const mask = bodyPix.toMask(segmentation);
        bodyPix.drawMask(canvas, video, mask, 1, 0, false);
        
        // Step 4: Reset the composite operation to default
        ctx.globalCompositeOperation = 'source-over';

        // Continue the animation loop for the next frame
        requestAnimationFrame(render);
      };
      
      const stream = canvas.captureStream(30);
      const videoTrack = stream.getVideoTracks()[0];

      peerConnectionsRef.current.forEach(({ call }) => {
        const sender = (call as any).peerConnection.getSenders().find((s: any) => s.track?.kind === 'video');
        sender?.replaceTrack(videoTrack);
      });

      localStreamRef.current = new MediaStream([videoTrack, ...localStreamRef.current.getAudioTracks()]);
      render();
    } else {
      bgActiveRef.current = false;
      setBgActive(false);
      if (originalStreamRef.current) {
        const videoTrack = originalStreamRef.current.getVideoTracks()[0];
        peerConnectionsRef.current.forEach(({ call }) => {
          const sender = (call as any).peerConnection.getSenders().find((s: any) => s.track?.kind === 'video');
          sender?.replaceTrack(videoTrack);
        });
        localStreamRef.current = originalStreamRef.current;
        if (myVideoRef.current) myVideoRef.current.srcObject = originalStreamRef.current;
      }
    }
  };

  // ---------------- Face Detection and Reactions ----------------
  const startFaceTriggers = async (stream: MediaStream) => {
    try {
      if (!faceModelRef.current) {
        faceModelRef.current = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
      }

      const video = document.createElement('video');
      video.autoplay = true; video.srcObject = stream;
      video.playsInline = true; video.muted = true;
      await video.play();

      const tick = async () => {
        if (!faceModelRef.current) return;
        const preds = await faceModelRef.current.estimateFaces({ input: video });
        if (preds && preds.length) {
          const p = preds[0];
          const topLip = p.scaledMesh[13];
          const bottomLip = p.scaledMesh[14];
          const dy = Math.hypot(topLip[0] - bottomLip[0], topLip[1] - bottomLip[1]);
          if (dy > 12) {
            sendReaction('😂');
          }
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch (e) {
      console.warn("Face detection not available", e);
    }
  };

  const stopFaceTriggers = () => {
    faceModelRef.current = null;
  };

  // ---------------- Speech Recognition ----------------
  const toggleCaptions = () => {
    if (!captionsOn) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }
    speechRecRef.current = new SpeechRecognition();
    speechRecRef.current.continuous = true;
    speechRecRef.current.interimResults = true;
    speechRecRef.current.lang = 'en-US';
    speechRecRef.current.onresult = (ev: any) => {
      const text = Array.from(ev.results).map((r: any) => r[0].transcript).join('');
      setCaptions(text);
      socketRef.current?.emit("transcript", {
        roomId,
        text,
        interim: ev.results[ev.results.length - 1].isFinal ? false : true
      });
    };
    speechRecRef.current.onend = () => {
      if (captionsOn) speechRecRef.current.start();
    };
    speechRecRef.current.start();
    setCaptionsOn(true);
  };

  const stopSpeechRecognition = () => {
    if (speechRecRef.current) {
      speechRecRef.current.onend = null;
      speechRecRef.current.stop();
      speechRecRef.current = null;
    }
    setCaptions("");
    setCaptionsOn(false);
  };

  // ---------------- Background Music Mixing ----------------
  const toggleMusic = () => {
    if (!musicPlaying) {
      startMusic("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    } else {
      stopMusic();
    }
  };

  const startMusic = (url: string) => {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      console.error("AudioContext is not supported by this browser.");
      return;
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (musicPlaying) return;

    musicElementRef.current = new Audio(url);
    musicElementRef.current.crossOrigin = 'anonymous';
    const musicNode = audioCtxRef.current!.createMediaElementSource(musicElementRef.current);
    const micSrc = audioCtxRef.current!.createMediaStreamSource(localStreamRef.current!);
    const dest = audioCtxRef.current!.createMediaStreamDestination();

    const musicGain = audioCtxRef.current!.createGain();
    musicGain.gain.value = 0.3;
    musicNode.connect(musicGain).connect(dest);
    micSrc.connect(dest);

    const mixedTrack = dest.stream.getAudioTracks()[0];
    localAudioTrackRef.current = localStreamRef.current!.getAudioTracks()[0];

    peerConnectionsRef.current.forEach(p => {
      const sender = (p.call as any).peerConnection.getSenders().find((s: any) => s.track?.kind === 'audio');
      if (sender && mixedTrack) sender.replaceTrack(mixedTrack);
    });

    musicElementRef.current.loop = true;
    musicElementRef.current.play();
    setMusicPlaying(true);
  };

  const stopMusic = () => {
    if (musicElementRef.current) {
      musicElementRef.current.pause();
      musicElementRef.current.src = "";
      musicElementRef.current = null;
    }
    if (localAudioTrackRef.current) {
      peerConnectionsRef.current.forEach(p => {
        const sender = (p.call as any).peerConnection.getSenders().find((s: any) => s.track?.kind === 'audio');
        if (sender) sender.replaceTrack(localAudioTrackRef.current!);
      });
    }
    setMusicPlaying(false);
  };

  // ---------------- Recording ----------------
  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (!localStreamRef.current) return;
    recordedChunksRef.current = [];
    recorderRef.current = new MediaRecorder(localStreamRef.current, { mimeType: 'video/webm; codecs=vp8,opus' });
    recorderRef.current.ondataavailable = e => {
      if (e.data && e.data.size) recordedChunksRef.current.push(e.data);
    };
    recorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-meet-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    recorderRef.current.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);


  return (
    <div className="room-root">
      <header className="topbar">
        <div className="brand">MyMeet</div>
        <div className="room-title">Room: {roomId}</div>
        <div className="right-info">You: {displayNameRef.current}</div>
      </header>

      <main className="main-area">
        <section className="video-area">
          <div className="video-grid">
            {videoStreams.map(v => (
              <VideoTile
                key={v.id}
                stream={v.stream}
                isLocal={v.id === localPeerIdRef.current}
                reactions={reactions.filter(r => r.id === v.id).map(r => r.emoji)}
                handRaised={participants.find(p => p.id === v.id)?.handRaised || false}
                id={v.id}
                speaking={speakingUsers.has(v.id)}
              />
            ))}
          </div>
          <div className="captions-display">{captions}</div>
          <video ref={myVideoRef} style={{ display: "none" }} autoPlay playsInline muted />
        </section>

        <aside className="right-panel">
          <div className="participants-header">Participants ({participants.length})</div>
          <div className="participants-list">
            {participants.map(p => (
              <div key={p.id} className="participant-row">
                <div>{p.name}</div>
                {p.handRaised && <span>✋</span>}
              </div>
            ))}
          </div>

          <div className="chat-header">Chat</div>
          <div className="chat-box">
            {chatMessages.map((m, i) => (
              <div key={i}>
                <strong>{m.user}:</strong> {m.text} {m.image && <img src={m.image} className="chat-img" />}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <form className="chat-form" onSubmit={sendMessage}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type message..." />
            <input type="file" accept="image/*" onChange={uploadImage} />
            <button type="submit">Send</button>
          </form>

          <div className="reactions">
            <button onClick={() => sendReaction("👍")}>👍</button>
            <button onClick={() => sendReaction("❤️")}>❤️</button>
            <button onClick={() => sendReaction("😂")}>😂</button>
          </div>

          <div className="controls">
            <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
            <button onClick={toggleCamera}>{isCameraOff ? "Start Video" : "Stop Video"}</button>
            <button onClick={raiseHand}>✋ Hand</button>
            <button onClick={toggleBgBlur}>{bgActive ? "Stop BG" : "Blur BG"}</button>
            <button onClick={toggleCaptions}>{captionsOn ? "Stop Captions" : "Start Captions"}</button>
            <button onClick={toggleMusic}>{musicPlaying ? "Stop Music" : "Start Music"}</button>
            <button onClick={toggleRecording}>{isRecording ? "Stop Recording" : "Start Recording"}</button>
            <button onClick={leave}>Leave</button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Room;