"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config"; // ✅ Ensure correct Firebase import
import "./auth.css";
import Link from "next/link";

export default function Login() {  // ✅ Ensure this is a default export
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to check valid email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Firebase sign-in with email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore using UID
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found in Firestore. Contact support.");
      }

      const userData = userSnap.data();
      console.log("User Role:", userData.role); // ✅ Debugging
      // ✅ Store the role in localStorage (or sessionStorage)
      localStorage.setItem("userRole", userData.role);

      // Redirect based on role
      if (userData.role === "admin") {
        alert("Admin Login Successful!");
        router.push("/adminpanel");
      } else {
        alert("User Login Successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      
      <form id="login-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        
        <button 
          type="button" 
          className="btn" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don&apos;t have an account? <Link href="/auth/signup">Sign Up</Link>
      </p>
    </div>
  );
};