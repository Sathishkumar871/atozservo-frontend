import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// --- SVG Icons (No changes here) ---
const IconCameraVideo = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.11-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"></path></svg>;
const IconCameraVideoOff = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 5a.5.5 0 0 0 .5.5v2.036l2.973-1.322a.5.5 0 0 1 .727.447v7.076a.5.5 0 0 1-.727.447L11 11.464V13.5a.5.5 0 0 0 .5.5h-9a.5.5 0 0 0-.5-.5v-9a.5.5 0 0 0 .5-.5h9zM2 5.652l8 4.499V13H2V5.652zM14 4.732 11 6.133V8.5l3 1.667V4.732z"></path></svg>;
const IconMic = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path><path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"></path></svg>;
const IconMicMute = ({ className = '' }) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3.646-7.354l-8 8 .708.708 8-8-.708-.708z"></path><path d="M4 0a3 3 0 0 0-3 3v5a3 3 0 0 0 5.123 2.547l-3.531-3.531A3 3 0 0 0 4 5V3a2 2 0 0 1 4 0v1.114l1.178-1.178A3 3 0 0 0 8 0a3 3 0 0 0-4 0z"></path></svg>;
const IconChatDots = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path><path d="M2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"></path></svg>;
const IconUserFriends = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>;
const IconPaperPlane = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path></svg>;
const IconCallEnd = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m12.383 14.213-2.558-2.558-2.122 2.122L12 18.06l4.298-4.297-2.122-2.122-2.793 2.794z"></path><path d="M12.001 2c-5.522 0-10 4.478-10 10s4.478 10 10 10 10-4.478 10-10-4.478-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>;

// --- Mock Firestore (No changes here) ---
const mockDb: { rooms: Map<string, any> } = { rooms: new Map() };
const doc = (db: any, collection: string, id: string | undefined): { collection: string; id: string | undefined } => ({ collection, id });
const onSnapshot = (docRef: { id:string | undefined }, callback: (snapshot: any) => void): (() => void) => { if (!docRef.id || !mockDb.rooms.has(docRef.id)) { mockDb.rooms.set(docRef.id || 'default', { hostId: 'user-host-123', currentMembers: [{ id: 'user-host-123', name: 'Host' }, { id: 'user-guest-456', name: 'Guest' }], isLiveVideo: false, }); } const interval = setInterval(() => { if (docRef.id) { callback({ exists: () => true, data: () => mockDb.rooms.get(docRef.id), }); } }, 1000); return () => clearInterval(interval); };
const updateDoc = async (docRef: { id:string | undefined }, data: any): Promise<void> => { if (!docRef.id) return; const currentData = mockDb.rooms.get(docRef.id) || {}; mockDb.rooms.set(docRef.id, { ...currentData, ...data }); };
const deleteDoc = async (docRef: { id:string | undefined }): Promise<void> => { if (docRef.id) { mockDb.rooms.delete(docRef.id); } };


// --- CSS Styles as a Component ---
const RoomStyles = () => (
    <style>{`
        :root {
            --primary-bg: #1a1a1a; --secondary-bg: #242424; --primary-accent: #6f42c1;
            --primary-text: #f0f0f0; --secondary-text: #a0a0a0; --danger-color: #dc3545;
            --active-color: #28a745; --border-color: #3a3a3a;
        }
        .room-container {
            display: flex; flex-direction: column; height: 100vh; width: 100vw;
            background-color: var(--primary-bg); color: var(--primary-text); overflow: hidden;
        }
        .room-header {
            display: flex; justify-content: space-between; align-items: center; padding: 1rem;
            background-color: var(--secondary-bg); border-bottom: 1px solid var(--border-color); flex-shrink: 0;
        }
        .room-header h3 { margin: 0; color: var(--primary-accent); font-weight: bold; }
        .room-info { font-size: 0.9rem; color: var(--secondary-text); }
        .icon-button { background: none; border: none; color: var(--primary-text); cursor: pointer; font-size: 1.5rem; position: relative; }
        .participant-count {
            position: absolute; top: -5px; right: -10px; background-color: var(--primary-accent);
            color: white; font-size: 0.7rem; border-radius: 50%; padding: 2px 6px; font-weight: bold;
        }
        .room-main { display: flex; flex-grow: 1; overflow: hidden; }
        .stream-section { flex-grow: 1; display: flex; flex-direction: column; padding: 1rem; transition: width 0.3s ease-in-out; }

        /* --- MODIFIED CSS FOR VIDEO GRID --- */
        #video-grid {
            display: flex; /* Changed from grid to flex */
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap; /* Allows items to wrap */
            gap: 2rem; /* Space between participants */
            flex-grow: 1;
            overflow-y: auto;
            padding: 2rem 0; /* Add some padding */
        }
        /* --- NEW CSS for participant wrapper --- */
        .participant-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem; /* Space between circle and name */
        }
        /* --- MODIFIED CSS FOR VIDEO PLAYER (THE CIRCLE) --- */
        .video-player {
            background-color: var(--secondary-bg);
            border-radius: 50%; /* This makes it a circle */
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid transparent; /* Border for speaking indicator */
            transition: border-color 0.3s ease;
            width: 180px;  /* Fixed width */
            height: 180px; /* Fixed height */
        }
        .video-player.speaking {
            border-color: var(--active-color);
            box-shadow: 0 0 15px var(--active-color);
        }
        .video-player video {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Ensures video fills the circle */
        }
        /* --- MODIFIED CSS FOR AVATAR --- */
        .avatar-placeholder {
            width: 100%; /* Make avatar fill the circle */
            height: 100%;
            border-radius: 50%;
            background-color: var(--primary-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem; /* Larger initial */
            font-weight: bold;
            color: white;
        }
        /* --- MODIFIED CSS FOR VIDEO LABEL (NAME) --- */
        .video-label {
            color: var(--secondary-text);
            font-size: 1rem;
            font-weight: 500;
        }
        /* --- END OF MODIFICATIONS --- */
        
        .controls-bar { display: flex; justify-content: center; align-items: center; padding: 1rem 0 0 0; gap: 1rem; flex-shrink: 0; }
        .control-button {
            background-color: var(--secondary-bg); border: 1px solid var(--border-color); color: var(--primary-text);
            width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 1.5rem; transition: background-color 0.2s, transform 0.2s;
        }
        .control-button:hover { background-color: #3a3a3a; }
        .control-button.active { background-color: var(--primary-accent); border-color: var(--primary-accent); }
        .control-button .danger-icon { color: var(--danger-color); }
        .leave-button { background-color: var(--danger-color); border-color: var(--danger-color); }
        .leave-button:hover { background-color: #c82333; }
        .chat-section {
            width: 300px; flex-shrink: 0; background-color: var(--secondary-bg); border-left: 1px solid var(--border-color);
            display: flex; flex-direction: column; padding: 1rem; transition: width 0.3s ease-in-out;
        }
        .messages-list { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
        .message-item { background-color: #3a3a3a; padding: 0.5rem 0.8rem; border-radius: 10px; font-size: 0.9rem; }
        .message-form { display: flex; margin-top: 1rem; gap: 0.5rem; }
        .message-form input { flex-grow: 1; background-color: var(--primary-bg); border: 1px solid var(--border-color); color: var(--primary-text); padding: 0.7rem; border-radius: 20px; }
        .message-form button { background-color: var(--primary-accent); border: none; color: white; width: 45px; height: 45px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; }
        
        @media (max-width: 768px) {
            .room-main.chat-active .stream-section { display: none; }
            .chat-section { width: 100%; position: absolute; top: 60px; left: 0; right: 0; bottom: 0; z-index: 10; height: calc(100% - 60px); }
            .room-header .room-info { display: none; }
            .controls-bar { gap: 0.75rem; }
            .control-button { width: 50px; height: 50px; font-size: 1.2rem; }
            
            /* --- MODIFIED CSS FOR MOBILE --- */
            #video-grid {
                flex-direction: column; /* Stack circles vertically on mobile */
                align-items: center;
                padding: 1rem 0;
            }
            .video-player {
                width: 150px; /* Make circles smaller */
                height: 150px;
            }
            .avatar-placeholder {
                font-size: 3rem; /* Adjust initial font size */
            }
            /* --- END OF MOBILE MODIFICATIONS --- */
        }
    `}</style>
);


interface User { id: string; name: string; }

const Room: React.FC = () => {
    // --- STATE AND HOOKS (No changes here) ---
    const navigate = useNavigate();
    const { id: roomId } = useParams<{ id: string }>();
    const [isMuted, setIsMuted] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [roomData, setRoomData] = useState<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentUser] = useState<User>({ id: 'user-guest-456', name: 'Guest' });
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const isHost = roomData?.hostId === currentUser.id;

    // --- USE EFFECT HOOKS (No changes here) ---
    useEffect(() => {
        if (!roomId) return;
        const roomRef = doc(mockDb, 'rooms', roomId);
        const unsub = onSnapshot(roomRef, (snap) => {
            if (!snap.exists()) {
                alert('Room does not exist.'); navigate('/chat'); return;
            }
            const data = snap.data();
            setRoomData(data);
            if (data.isLiveVideo && !isCameraOn) setIsCameraOn(true);
        });
        return () => unsub();
    }, [roomId, navigate, isCameraOn]);

    const setupSpeakingIndicator = (stream: MediaStream) => {
        if (audioContextRef.current) audioContextRef.current.close();
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkSpeaking = () => {
            if (audioContext.state === 'closed') return;
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
            setIsSpeaking(average > 20);
            requestAnimationFrame(checkSpeaking);
        };
        checkSpeaking();
    };

    useEffect(() => {
        let isMounted = true;
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    localStreamRef.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                    stream.getVideoTracks()[0].enabled = false;
                    setupSpeakingIndicator(stream);
                }
            } catch (err) {
                console.error('Media access error:', err);
                if (isMounted) alert('Could not access camera or microphone.');
            }
        };
        getMedia();

        return () => {
            isMounted = false;
            localStreamRef.current?.getTracks().forEach((track) => track.stop());
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
        };
    }, []);

    useEffect(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = isCameraOn;
            }
        }
    }, [isCameraOn]);

    // --- EVENT HANDLERS (No changes here) ---
    const handleLeaveRoom = async () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close();
        }
        
        navigate('/chat');

        if (!roomId) {
            return;
        }

        try {
            if (isHost) {
                await deleteDoc(doc(mockDb, 'rooms', roomId));
            } else if (roomData?.currentMembers) {
                const updatedMembers = roomData.currentMembers.filter((m: any) => m.id !== currentUser.id);
                await updateDoc(doc(mockDb, 'rooms', roomId), { currentMembers: updatedMembers });
            }
        } catch (error) {
            console.error('Error updating room data on leave:', error);
        }
    };

    const handleToggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsMuted(!audioTrack.enabled); }
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input') as HTMLInputElement;
        if (input?.value.trim()) {
            setMessages((prev) => [...prev, `${currentUser.name}: ${input.value}`]);
            input.value = '';
        }
    };
    
    const handleVideoCallRequest = async () => {
        if (!roomId) return;
        if (isHost) {
             const newVideoState = !roomData.isLiveVideo;
              await updateDoc(doc(mockDb, 'rooms', roomId), { isLiveVideo: newVideoState });
              setIsCameraOn(newVideoState);
        } else alert("Only the host can start the video call.");
    }

    // --- JSX (RETURN STATEMENT) ---
    return (
        <div className="room-container">
            <RoomStyles />
            <header className="room-header">
                <h3>TalkHive</h3>
                <div className="room-info">Room ID: {roomId}</div>
                <button className="icon-button" onClick={() => setIsMembersOpen(!isMembersOpen)}>
                    <IconUserFriends />
                    <span className="participant-count">{roomData?.currentMembers?.length || 0}</span>
                </button>
            </header>
            <main className={`room-main ${isChatOpen ? 'chat-active' : ''}`}>
                <section className="stream-section">
                    {/* --- MODIFIED JSX FOR VIDEO GRID --- */}
                    <div id="video-grid">
                        {/* Participant 1: You */}
                        <div className="participant-wrapper">
                            <div className={`video-player ${isSpeaking ? 'speaking' : ''}`}>
                                {isCameraOn ? (
                                    <video ref={localVideoRef} autoPlay playsInline muted />
                                ) : (
                                    <div className="avatar-placeholder">{currentUser.name.charAt(0)}</div>
                                )}
                            </div>
                            <div className="video-label">{currentUser.name} (You)</div>
                        </div>

                        {/* Participant 2: Host */}
                        <div className="participant-wrapper">
                             <div className="video-player">
                               <div className="avatar-placeholder">H</div>
                            </div>
                            <div className="video-label">Host</div>
                        </div>
                    </div>
                    {/* --- END OF JSX MODIFICATIONS --- */}

                    <div className="controls-bar">
                        <button className={`control-button ${!isMuted ? 'active' : ''}`} onClick={handleToggleMic}>
                            {!isMuted ? <IconMic /> : <IconMicMute className="danger-icon" />}
                        </button>
                        <button className={`control-button ${isCameraOn ? 'active' : ''}`} onClick={handleVideoCallRequest}>
                            {isCameraOn ? <IconCameraVideo /> : <IconCameraVideoOff />}
                        </button>
                        <button className="control-button" onClick={() => setIsChatOpen(!isChatOpen)}>
                            <IconChatDots />
                        </button>
                        <button className="control-button leave-button" onClick={handleLeaveRoom}>
                            <IconCallEnd />
                        </button>
                    </div>
                </section>
                {isChatOpen && (
                    <section className="chat-section">
                        <div className="messages-list">
                            {messages.map((msg, index) => (
                                <div key={index} className="message-item">{msg}</div>
                            ))}
                        </div>
                        <form className="message-form" onSubmit={handleSendMessage}>
                            <input type="text" placeholder="Send a message..." />
                            <button type="submit"><IconPaperPlane /></button>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Room;