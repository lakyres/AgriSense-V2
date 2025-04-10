import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyBInwh0z9sgAkARlcVxIDK8IrUcgvzw9vE",
  authDomain: "agrisense-24467.firebaseapp.com",
  databaseURL: "https://agrisense-24467-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrisense-24467",
  storageBucket: "agrisense-24467.firebasestorage.app",
  messagingSenderId: "999179273743",
  appId: "1:999179273743:web:601ffe36f4e0108553057a"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);           // Firestore
export const auth = getAuth(app);              // Auth
export const realtimeDb = getDatabase(app);    // ✅ Realtime DB
