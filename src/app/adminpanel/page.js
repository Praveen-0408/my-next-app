"use client";

import "./auth.css";
import React, { useState } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateAllUsersPortfolio = async () => {
    setLoading(true);
    setMessage("");

    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      usersSnapshot.forEach(async (userDoc) => {
        const userRef = doc(db, "users", userDoc.id);

        await updateDoc(userRef, {
          portfolio: {
            "USD/INR": 0,
            "Spot Gold": 0,
            "Spot Silver": 0,
            "Future Gold": 0,
            "Future Silver": 0,
            "Future Copper": 0,
            "Crude Oil": 0,
            "Natural Gas": 0,
            "Platinum": 0,
            "Palladium": 0,
            "Brent Crude Oil": 0,
            "Wheat": 0,
            "Corn": 0,
            "Soybeans": 0,
          },
        });
      });

      setMessage("Portfolio updated for all users!");
    } catch (error) {
      setMessage("Error updating portfolio.");
      console.error("Update error:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Welcome to the Admin Panel</h2>
      <p>Use the sidebar to navigate to different sections.</p>

      <button onClick={updateAllUsersPortfolio} disabled={loading}>
        {loading ? "Updating..." : "Update All Users Portfolio"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
