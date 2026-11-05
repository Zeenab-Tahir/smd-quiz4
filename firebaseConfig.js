import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDpfS4-KOdI5igKwfyrpVDKCJ1VFHQfSQY",
  authDomain: "smd3-6e348.firebaseapp.com",
  projectId: "smd3-6e348",
  storageBucket: "smd3-6e348.firebasestorage.app",
  messagingSenderId: "759271295020",
  appId: "1:759271295020:web:5a5a979726573d70de6989",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
