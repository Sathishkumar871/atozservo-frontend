// public/main.js
// Feature set:
// - WebRTC mesh (<=10 peers)
// - Browser noise suppression via getUserMedia constraints
// - Background blur / photo using BodyPix (client-side canvas)
// - Canvas filter example (CSS filter via canvas)
// - Reactions via socket + face-triggered reaction (using Face Landmarks)
// - Browser speech recognition (captions) -> broadcast to room
// - Background music mixing via WebAudio
// - Recording (MediaRecorder) -> presign upload to S3
// - Call-end report collect (pc.getStats) -> POST /report

const socket = io("http://localhost:5000");
const params = new URLSearchParams(location.search);
const roomId = params.get("room") || "demo";
const displayName = params.get("name") || `User-${Math.floor(Math.random()*1000)}`;

document.getElementById("roomInfo").textContent = `Room: ${roomId} • ${displayName}`;

const grid = document.getElementById("grid");
const chatEl = document.getElementById("chat");
const captionsEl = document.getElementById("captions");

const muteBtn = document.getElementById("muteBtn");
const camBtn = document.getElementById("camBtn");
const bgBtn = document.getElementById("bgBtn");
const filterBtn = document.getElementById("filterBtn");
const transBtn = document.getElementById("transBtn");
const musicBtn = document.getElementById("musicBtn");
const recordBtn = document.getElementById("recordBtn");
const leaveBtn = document.getElementById("leaveBtn");
const startMusicBtn = document.getElementById("startMusic");
const bgFileInput = document.getElementById("bgFile");
const musicUrlInput = document.getElementById("musicUrl");

let localStream;
let localProcessedStream = null; // after bg/filter processing (replace outgoing)
let peers = new Map(); // peerId -> { pc, el, video }
let audioEnabled = true;
let videoEnabled = true;
let captionsOn = false;
let bgActive = false;
let musicPlaying = false;
let recorder = null;
let recordedChunks = [];
let callStart = Date.now();
let reactionCounts = {};

const MAX_PEERS = 10;

// rtc config (add TURN here)
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // Add TURN if you have one:
    // { urls: "turn:YOUR_TURN_HOST:3478", username: "...", credential: "..." }
  ]
};

// UI helper - create tile
function createTile(id, name, isLocal=false) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.id = `tile-${id}`;

  const video = document.createElement("video");
  video.autoplay = true; video.playsInline = true;
  if (isLocal) video.muted = true;

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = name || id;

  tile.appendChild(video);
  tile.appendChild(label);
  grid.appendChild(tile);

  return { tile, video, label };
}

function removeTile(id) {
  const el = document.getElementById(`tile-${id}`);
  if (el) el.remove();
}

// append chat
function appendChat(name, message, me=false) {
  const d = document.createElement("div");
  d.style.padding = "6px"; d.style.margin = "6px"; d.style.borderRadius = "8px";
  d.style.background = me ? "#0b1220" : "transparent";
  d.textContent = `${name}: ${message}`;
  chatEl.appendChild(d);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// send reaction
function sendReaction(type) {
  socket.emit("reaction", { roomId, type });
  showReaction(socket.id, type);
}

// show reaction overlay
function showReaction(peerId, type) {
  const tile = document.getElementById(`tile-${peerId === socket.id ? 'local' : peerId}`);
  if (!tile) return;
  const badge = document.createElement("div");
  badge.className = "reaction";
  badge.textContent = type;
  tile.appendChild(badge);
  setTimeout(()=> badge.remove(), 2200);
  // count
  reactionCounts[type] = (reactionCounts[type] || 0) + 1;
}

// voice-activity detector (simple)
function startVAD(tileEl, stream) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    function tick() {
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (let i=0;i<data.length;i++){
        const v = Math.abs(data[i] - 128) / 128;
        if (v>peak) peak = v;
      }
      if (peak > 0.08 && !tileEl.classList.contains('muted')) tileEl.classList.add('speaking');
      else tileEl.classList.remove('speaking');
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return { audioCtx, analyser };
  } catch(e) {
    console.warn("VAD not available", e);
    return null;
  }
}

// ------------ media init -------------
async function initLocal() {
  // request high-quality video + built-in suppression
  localStream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: { sampleRate: 48000, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  });

  // local tile
  const local = createTile("local", `${displayName} (you)`, true);
  local.video.srcObject = localStream;
  peers.set("local", { pc: null, el: local.tile, video: local.video });

  // local VAD
  startVAD(local.tile, localStream);

  // optionally start captions
  if (captionsOn) startSpeechRecognition();

  // send join after getting media
  socket.emit("join-room", { roomId, name: displayName });
}

// ------------- Peer management (mesh) ---------------
function ensurePeer(peerId, peerName, isInitiator=false) {
  if (peers.has(peerId) && peers.get(peerId).pc) return peers.get(peerId);

  const pc = new RTCPeerConnection(rtcConfig);
  // attach local tracks to pc
  const sendStream = localProcessedStream || localStream;
  sendStream.getTracks().forEach(track => pc.addTrack(track, sendStream));

  // UI tile
  const tileObj = createTile(peerId, peerName);
  const videoEl = tileObj.video;
  const tileEl = tileObj.tile;

  const obj = { pc, el: tileEl, video: videoEl, name: peerName, analyser: null };
  peers.set(peerId, obj);

  pc.ontrack = (ev) => {
    const [stream] = ev.streams;
    videoEl.srcObject = stream;
    obj.stream = stream;
    obj.analyser = startVAD(tileEl, stream);
  };

  pc.onicecandidate = (ev) => {
    if (ev.candidate) {
      socket.emit("signal", { to: peerId, payload: { type: "candidate", candidate: ev.candidate } });
    }
  };

  pc.onconnectionstatechange = () => {
    if (["failed","closed","disconnected"].includes(pc.connectionState)) {
      removeTile(peerId);
      if (peers.has(peerId)) peers.delete(peerId);
    }
  };

  // initiator creates offer
  if (isInitiator) {
    pc.createOffer().then(offer=>{
      pc.setLocalDescription(offer);
      socket.emit("signal", { to: peerId, payload: { type: "sdp", sdp: offer } });
    }).catch(console.error);
  }

  return obj;
}

// -------------- signaling handlers ----------------
socket.on("existing-participants", (list) => {
  list.forEach(p => {
    if (peers.size-1 >= MAX_PEERS) return;
    ensurePeer(p.id, p.name, true);
  });
});

socket.on("new-participant", ({ id, name }) => {
  ensurePeer(id, name, false);
});

socket.on("participant-left", ({ id }) => {
  const p = peers.get(id);
  if (p && p.pc) try { p.pc.close(); } catch(e){}
  removeTile(id);
  peers.delete(id);
});

socket.on("signal", async ({ from, payload }) => {
  const ent = ensurePeer(from, undefined, false);
  const pc = ent.pc;
  if (!pc) return;
  if (payload.type === "sdp") {
    const desc = new RTCSessionDescription(payload.sdp);
    await pc.setRemoteDescription(desc);
    if (desc.type === "offer") {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("signal", { to: from, payload: { type: "sdp", sdp: answer } });
    }
  } else if (payload.type === "candidate") {
    try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)); } catch(e){ console.warn(e) }
  }
});

// reactions display
socket.on("reaction", ({ from, type }) => {
  showReaction(from, type);
});

// transcripts broadcasted
socket.on("transcript", ({ from, text, interim }) => {
  captionsEl.textContent = (interim ? "(...) " : "") + text;
});

// chat
socket.on("chat", ({ from, message }) => {
  appendChat(from.name || from.id.slice(0,5), message, false);
});

// assistant summary
socket.on("assistant-summary", ({ summary }) => {
  appendChat("Assistant", summary, false);
});

// ------------- background replacement (BodyPix) -------------
let bodyPixNet = null;
let bgCanvas = null;
let bgCanvasStream = null;
let bgImageUrl = null;

async function loadBodyPix() {
  if (!bodyPixNet) bodyPixNet = await bodyPix.load();
  return bodyPixNet;
}

async function startBackgroundReplace(imageUrl=null) {
  await loadBodyPix();
  bgImageUrl = imageUrl;
  // create hidden video to play original track
  const video = document.createElement("video");
  video.autoplay = true; video.playsInline = true; video.muted = true;
  video.srcObject = new MediaStream([ localStream.getVideoTracks()[0] ]);
  await video.play();

  bgCanvas = document.createElement("canvas");
  bgCanvas.width = 640; bgCanvas.height = 480;
  const ctx = bgCanvas.getContext('2d');

  async function render() {
    const segmentation = await bodyPixNet.segmentPerson(video, { internalResolution:'medium', segmentationThreshold:0.7 });
    // draw background (photo or blurred)
    if (bgImageUrl) {
      const img = new Image();
      img.src = bgImageUrl;
      try { await img.decode(); ctx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height); } catch(e){ ctx.fillStyle="#222"; ctx.fillRect(0,0,bgCanvas.width,bgCanvas.height); }
    } else {
      ctx.fillStyle = "#222"; ctx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
    }
    // mask and draw person
    const mask = bodyPix.toMask(segmentation);
    ctx.putImageData(mask, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(video, 0,0, bgCanvas.width, bgCanvas.height);
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(render);
  }
  render();

  bgCanvasStream = bgCanvas.captureStream(24);
  const newTrack = bgCanvasStream.getVideoTracks()[0];
  // replace outgoing video track for each peer
  peers.forEach(p => {
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) sender.replaceTrack(newTrack);
    }
  });
  localProcessedStream = new MediaStream([ newTrack ].concat(localStream.getAudioTracks()));
  return bgCanvasStream;
}

function stopBackgroundReplace() {
  if (bgCanvasStream) {
    bgCanvasStream.getTracks().forEach(t=>t.stop());
    bgCanvasStream = null;
  }
  // restore original video track
  peers.forEach(p => {
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) {
        const orig = localStream.getVideoTracks()[0];
        sender.replaceTrack(orig);
      }
    }
  });
  localProcessedStream = null;
}

// -------------- filters (canvas CSS filter) ---------------
let filterCanvas = null;
let filterStream = null;
function startCanvasFilter(filterCss='blur(2px) saturate(1.2)') {
  const video = document.createElement("video"); video.autoplay=true; video.playsInline=true; video.muted=true;
  video.srcObject = new MediaStream([ localStream.getVideoTracks()[0] ]);
  video.play();

  filterCanvas = document.createElement("canvas"); filterCanvas.width = 640; filterCanvas.height = 480;
  const ctx = filterCanvas.getContext('2d');
  function loop() {
    ctx.filter = filterCss;
    ctx.drawImage(video, 0,0,filterCanvas.width, filterCanvas.height);
    requestAnimationFrame(loop);
  }
  loop();
  filterStream = filterCanvas.captureStream(25);
  const newTrack = filterStream.getVideoTracks()[0];
  peers.forEach(p => {
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) sender.replaceTrack(newTrack);
    }
  });
  localProcessedStream = new MediaStream([ newTrack ].concat(localStream.getAudioTracks()));
}

function stopCanvasFilter() {
  if (filterStream) filterStream.getTracks().forEach(t=>t.stop());
  filterStream = null;
  peers.forEach(p => {
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
  });
  localProcessedStream = null;
}

// -------------- face detection -> automatic reaction --------------
let faceModel = null;
async function loadFaceModel() {
  if (!faceModel) faceModel = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
  return faceModel;
}
let faceTickRunning = false;
async function startFaceTriggers() {
  await loadFaceModel();
  const v = document.createElement("video"); v.autoplay=true; v.playsInline=true; v.muted=true;
  v.srcObject = new MediaStream([ localStream.getVideoTracks()[0] ]);
  await v.play();

  const canvas = document.createElement("canvas"); canvas.width=640; canvas.height=480;
  const ctx = canvas.getContext("2d");
  faceTickRunning = true;
  async function tick(){
    if (!faceTickRunning) return;
    const preds = await faceModel.estimateFaces({input: v});
    if (preds && preds.length) {
      const p = preds[0];
      // simple mouth open detection: distance between top and bottom lip
      const topLip = p.scaledMesh[13]; // approximate indices
      const bottomLip = p.scaledMesh[14];
      const dy = Math.hypot(topLip[0]-bottomLip[0], topLip[1]-bottomLip[1]);
      if (dy > 12) {
        sendReaction('😂'); // auto reaction on big mouth open
      }
    }
    setTimeout(tick, 700); // throttle
  }
  tick();
}
function stopFaceTriggers(){ faceTickRunning=false; }

// ---------------- speech recognition (browser) ----------------
let speechRec = null;
function startSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    console.warn("SpeechRecognition not supported");
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRec = new SpeechRecognition();
  speechRec.continuous = true;
  speechRec.interimResults = true;
  speechRec.lang = 'en-US';
  speechRec.onresult = (ev) => {
    const text = Array.from(ev.results).map(r => r[0].transcript).join('');
    captionsEl.textContent = text;
    socket.emit("transcript", { roomId, text, interim: ev.results[ev.results.length-1].isFinal ? false : true });
  };
  speechRec.onend = ()=> { if (captionsOn) speechRec.start(); }
  speechRec.start();
}
function stopSpeechRecognition() {
  if (speechRec) { speechRec.onend = null; speechRec.stop(); speechRec = null; }
  captionsEl.textContent = "";
}

// ------------- background music mixing -------------
let audioCtx = null;
let musicElement = null;
function startMusic(url) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (musicPlaying) return;
  musicElement = new Audio(url);
  musicElement.crossOrigin = 'anonymous';
  const musicNode = audioCtx.createMediaElementSource(musicElement);
  const micSrc = audioCtx.createMediaStreamSource(localStream);
  const dest = audioCtx.createMediaStreamDestination();

  // optional gain nodes
  const musicGain = audioCtx.createGain(); musicGain.gain.value = 0.3;
  const micGain = audioCtx.createGain(); micGain.gain.value = 1.0;

  musicNode.connect(musicGain).connect(dest);
  micSrc.connect(micGain).connect(dest);

  const mixedTrack = dest.stream.getAudioTracks()[0];
  // replace sender audio track for all peerConnections
  peers.forEach(p=>{
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'audio');
      if (sender && mixedTrack) sender.replaceTrack(mixedTrack);
    }
  });

  musicElement.loop = true;
  musicElement.play();
  musicPlaying = true;
  musicBtn.textContent = "Music On";
}
function stopMusic() {
  if (musicElement) { musicElement.pause(); musicElement.src=""; musicElement = null; }
  // restore original mic track
  peers.forEach(p => {
    if (p.pc) {
      const sender = p.pc.getSenders().find(s => s.track && s.track.kind === 'audio');
      if (sender) sender.replaceTrack(localStream.getAudioTracks()[0]);
    }
  });
  musicPlaying = false;
  musicBtn.textContent = "Music Off";
}

// ------------- recording (MediaRecorder) -------------
async function startRecording() {
  recordedChunks = [];
  // record processed stream if exists else localStream
  const toRecord = localProcessedStream || localStream;
  recorder = new MediaRecorder(toRecord, { mimeType: 'video/webm; codecs=vp8,opus' });
  recorder.ondataavailable = e => { if (e.data && e.data.size) recordedChunks.push(e.data); };
  recorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type:'video/webm' });
    // presign upload
    const filename = `call-${Date.now()}.webm`;
    const resp = await fetch('/presign', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ filename, contentType: 'video/webm' }) });
    const data = await resp.json();
    if (data.url) {
      await fetch(data.url, { method:'PUT', headers: { 'Content-Type': 'video/webm' }, body: blob });
      alert('Recording uploaded to S3 key: ' + data.key);
    } else {
      alert('Presign failed');
    }
  };
  recorder.start(1000);
  recordBtn.textContent = "Stop Recording";
}
function stopRecording() {
  if (recorder && recorder.state !== 'inactive') recorder.stop();
  recordBtn.textContent = "Record";
}

// ------------- call end report -------------
async function gatherReportAndSend() {
  const report = { roomId, displayName, callStart, callEnd: Date.now(), reactions: reactionCounts, peers: {} };
  for (const [id, p] of peers.entries()) {
    if (!p.pc) continue;
    try {
      const stats = await p.pc.getStats();
      const summary = {};
      stats.forEach(s=>{
        if (s.type === 'outbound-rtp' && s.kind === 'video') { summary.bytesSent = s.bytesSent; summary.packetsSent = s.packetsSent; }
        if (s.type === 'inbound-rtp' && s.kind === 'video') { summary.bytesReceived = s.bytesReceived; summary.packetsLost = s.packetsLost; }
      });
      report.peers[id] = summary;
    } catch(e){ console.warn('pc.getStats error', e); }
  }
  await fetch('/report', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(report) });
}

// ------------- controls wiring -------------
muteBtn.onclick = () => {
  audioEnabled = !audioEnabled;
  localStream.getAudioTracks().forEach(t => t.enabled = audioEnabled);
  muteBtn.textContent = audioEnabled ? "Mute" : "Unmute";
};
camBtn.onclick = () => {
  videoEnabled = !videoEnabled;
  localStream.getVideoTracks().forEach(t => t.enabled = videoEnabled);
  camBtn.textContent = videoEnabled ? "Stop Video" : "Start Video";
};
bgBtn.onclick = async () => {
  if (!bgActive) {
    // if user loaded bg file, read and use it
    const file = bgFileInput.files[0];
    let url = null;
    if (file) url = URL.createObjectURL(file);
    await startBackgroundReplace(url);
    bgBtn.textContent = "Background: On";
    bgActive = true;
  } else {
    stopBackgroundReplace();
    bgBtn.textContent = "Background: Off";
    bgActive = false;
  }
};
filterBtn.onclick = () => {
  if (!filterStream) {
    startCanvasFilter('blur(3px) saturate(1.2)');
    filterBtn.textContent = "Filter On";
  } else {
    stopCanvasFilter();
    filterBtn.textContent = "Filter";
  }
};
transBtn.onclick = () => {
  captionsOn = !captionsOn;
  if (captionsOn) { startSpeechRecognition(); transBtn.textContent = "Captions On"; }
  else { stopSpeechRecognition(); transBtn.textContent = "Captions Off"; }
};
startMusicBtn.onclick = () => {
  const url = musicUrlInput.value.trim();
  if (!musicPlaying) {
    if (!url) return alert('enter music url');
    startMusic(url);
  } else stopMusic();
};
musicBtn.onclick = () => {
  if (musicPlaying) stopMusic(); else {
    const url = musicUrlInput.value.trim();
    if (!url) return alert('enter music url');
    startMusic(url);
  }
};
recordBtn.onclick = () => {
  if (!recorder || recorder.state === 'inactive') startRecording();
  else stopRecording();
};
leaveBtn.onclick = async () => {
  // gather report
  await gatherReportAndSend();
  // close pcs
  for (const [id, p] of peers) {
    if (p.pc) p.pc.close();
    removeTile(id);
  }
  socket.disconnect();
  location.href = "/";
};

// chat form
document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('chatInput').value.trim();
  if (!text) return;
  socket.emit('chat', { roomId, message: text });
  appendChat("You", text, true);
  document.getElementById('chatInput').value = "";
});

// reaction buttons (global functions)
window.sendReaction = sendReaction;

// face-trigger start (auto)
startFaceTriggers(); // run in background, will emit reactions when threshold met


(async () => {
  await initLocal();
})();
