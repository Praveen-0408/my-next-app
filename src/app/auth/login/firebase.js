// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAY7gKxpLmLqVAqQCCMoFUxw1gl8J4Gw-Q",
  authDomain: "forexapp-e9d76.firebaseapp.com",
  projectId: "forexapp-e9d76",
  storageBucket: "forexapp-e9d76.appspot.com", // Fix incorrect storageBucket
  messagingSenderId: "2302288079",
  appId: "1:2302288079:web:c15889c58d5acf9d8fd7ba",
  measurementId: "G-VCQ2854BES",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db, app };
