import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";  // Import Firebase Storage
import { getFirestore } from "firebase/firestore"; // Firestore (optional)
import { getAuth } from "firebase/auth";  // Firebase Auth (optional)
import { getDatabase } from "firebase/database";  // Realtime DB (optional)

const firebaseConfig = {
  apiKey: "AIzaSyBeycnmrse8ZLV-D9zFBEQS3jL-rRMaKAw",
  authDomain: "agrisense-6a089.firebaseapp.com",
  databaseURL: "https://agrisense-6a089-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrisense-6a089",
  storageBucket: "agrisense-6a089.firebasestorage.app",
  messagingSenderId: "205438912985",
  appId: "1:205438912985:web:3413fa85c0c1f5531bf1c8",
  measurementId: "G-KV99XF08SZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Storage initialization
export const storage = getStorage(app);  // Get the Firebase Storage instance

// Initialize Firebase services as needed (optional)
export const db = getFirestore(app);  // Firestore
export const auth = getAuth(app);     // Auth
export const realtimeDb = getDatabase(app);  // Realtime Database (optional)
