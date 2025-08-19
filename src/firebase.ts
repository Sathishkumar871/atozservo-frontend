import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  

const firebaseConfig = {
  apiKey: "AIzaSyBnm5zoiv9qWj6tKYY1NaxDKQjtR-RgVz4",
  authDomain: "atozservo.firebaseapp.com",
  projectId: "atozservo",
  storageBucket: "atozservo.firebasestorage.app",
  messagingSenderId: "858738863668",
  appId: "1:858738863668:web:f1db96e30aa74f293d2461",
  measurementId: "G-M919N1EGSK",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);  // ✅ Auth instance

export { db, auth };
