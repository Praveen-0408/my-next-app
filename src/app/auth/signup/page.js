"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, RecaptchaVerifier, signInWithPhoneNumber, sendEmailVerification } from "@/firebase/config";
import "./auth.css";  

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      setTimeout(() => {
        if (document.getElementById("recaptcha-container")) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => console.log("reCAPTCHA Verified!"),
          });
        }
      }, 1000);
    }
  }, []);

  // ✅ Step 1: Send Email Verification
  const sendEmailVerificationLink = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      alert("Verification email sent! Please check your inbox.");

      // Check if email is verified every 3 seconds
      const checkEmailVerification = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(checkEmailVerification);
          setIsEmailVerified(true);
          alert("Email verified successfully!");
        }
      }, 3000);

    } catch (error) {
      console.error("Email Verification Error:", error);
      alert("Failed to send email verification. Try again.");
    }
  };

  // ✅ Step 2: Send OTP to Phone Number
  const sendOtp = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  // ✅ Step 3: Verify OTP and Complete Signup
  const verifyOtp = async () => {
    try {
      if (!confirmationResult) {
        alert("Please request an OTP first.");
        return;
      }
      const result = await confirmationResult.confirm(otp);
      console.log("User signed in:", result.user);

      if (!isEmailVerified) {
        alert("Please verify your email before completing signup.");
        return;
      }

      // Store user in MongoDB after email verification
      const response = await fetch("/api/db-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email, phone: phoneNumber, password }),
      });

      if (response.ok) {
        alert("Signup successful!");
        router.push("/dashboard");
      } else {
        alert("Signup failed!");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      
      <input type="text" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      
      <button onClick={sendEmailVerificationLink} disabled={isEmailVerified}>
        {isEmailVerified ? "Email Verified ✅" : "Send Email Verification"}
      </button>
      
      <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      
      <button onClick={sendOtp} disabled={!isEmailVerified}>Send OTP</button>

      {isOtpSent && (
        <>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP & Signup</button>
        </>
      )}

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
