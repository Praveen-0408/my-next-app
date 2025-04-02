"use client";

import React, { useState } from "react";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore"; // Import missing functions
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const auth = getAuth();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Fix: use user.uid instead of uid
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        balance: 0, // Default balance
        role: "user", // Role for user management
        createdAt: new Date().toISOString(), // Optional: Store timestamp
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
          "Soybeans": 0
        },
      });

      setFormData({ name: "", email: "", phone: "", password: "" });
      alert("User created successfully!");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Create User Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
