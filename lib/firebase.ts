import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

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

export const auth = getAuth(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
