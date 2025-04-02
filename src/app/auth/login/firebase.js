// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBnTsG05fdVfR_2Z3fDrETHolnBi_Hi_jM",
  authDomain: "forex-43581.firebaseapp.com",
  projectId: "forex-43581",
  storageBucket: "forex-43581.firebasestorage.app",
  messagingSenderId: "408517009635",
  appId: "1:408517009635:web:1b6d376278db9aba3925d6",
  measurementId: "G-2JZ8V7QHH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Set up reCAPTCHA verifier
const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA solved", response);
      },
    });
  }
};

export { auth, RecaptchaVerifier, signInWithPhoneNumber, googleProvider, signInWithPopup, sendEmailVerification };