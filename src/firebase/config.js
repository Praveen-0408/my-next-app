// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, getDocs, onSnapshot,deleteDoc, getDoc, query, where, orderBy, updateDoc, collection, addDoc, serverTimestamp, runTransaction } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAY7gKxpLmLqVAqQCCMoFUxw1gl8J4Gw-Q",
  authDomain: "forexapp-e9d76.firebaseapp.com",
  projectId: "forexapp-e9d76",
  storageBucket: "forexapp-e9d76.firebasestorage.app",
  messagingSenderId: "2302288079",
  appId: "1:2302288079:web:c15889c58d5acf9d8fd7ba",
  measurementId: "G-VCQ2854BES"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

// Set reCAPTCHA verifier
const setRecaptchaVerifier = () => {
  return new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA Verified!");
    },
    "expired-callback": () => {
      console.log("reCAPTCHA Expired. Please try again.");
    },
  });
};

export { app, auth, db, doc, onSnapshot, getDocs,deleteDoc, query, getDoc, where, orderBy, updateDoc, collection, addDoc, serverTimestamp, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, sendEmailVerification, runTransaction };