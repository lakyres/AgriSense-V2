// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBInwh0z9sgAkARlcVxIDK8IrUcgvzw9vE",
  authDomain: "agrisense-24467.firebaseapp.com",
  projectId: "agrisense-24467",
  storageBucket: "agrisense-24467.appspot.com",
  messagingSenderId: "999179273743",
  appId: "1:999179273743:web:601fffe36f4e018553057a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
