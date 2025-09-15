// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ఎన్విరాన్‌మెంట్ వేరియబుల్స్ నుండి కాన్ఫిగరేషన్‌ను సురక్షితంగా లోడ్ చేయండి
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app); // అథెంటికేషన్ కోసం

// db మరియు auth రెండింటినీ ఎక్స్‌పోర్ట్ చేయండి
export { db, auth };