"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config"; // Ensure Firebase is properly configured
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: "", balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid); // Fetch user data by UID
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch user data from Firestore using UID
  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId); // User UID must match Firestore document ID
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data()); // Store user data in state
      } else {
        console.log("No user data found for UID:", userId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Please log in to view your account.</p>;
  }

  return (
    <div style={{
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px', 
      background: '#f8f8f8', 
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>My Account</h2>
      
      <p><strong>Name:</strong> {userData.name || "N/A"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Balance:</strong> ${userData.balance?.toFixed(2) || "0.00"}</p>

      <button 
        onClick={() => auth.signOut()}
        style={{
          marginTop: '20px',
          padding: '10px',
          background: '#d9534f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Logout
      </button>
    </div>
  );
}
