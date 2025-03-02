'use client';

import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, db } from '../login/firebase'; // Ensure correct path
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import './auth.css';

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => console.log('ReCAPTCHA verified'),
          'expired-callback': () => console.log('ReCAPTCHA expired'),
        });
        window.recaptchaVerifier.render();
      } catch (error) {
        console.error('ReCAPTCHA setup error:', error);
      }
    }
  }, []);

  const checkUserExists = async (formattedPhone) => {
    const userDoc = await getDoc(doc(db, 'users', formattedPhone));
    return userDoc.exists();
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    try {
      const userExists = await checkUserExists(formattedPhone);
      setUserExists(userExists);

      if (userExists) {
        alert('Already have an account. Please login.');
      }

      const appVerifier = window.recaptchaVerifier;
      const phoneConfirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(phoneConfirmation);
      setOtpSent(true);
      alert('OTP sent to your phone number.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !confirmationResult) {
      alert('Please enter the OTP received on your phone.');
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      const phone = result.user.phoneNumber;

      if (userExists) {
        alert('Phone number verified! Enter your password to log in.');
      } else {
        alert('Phone verified! Set a password to create your account.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleLoginOrSignup = async (e) => {
    e.preventDefault();
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    try {
      if (userExists) {
        const userDoc = await getDoc(doc(db, 'users', formattedPhone));
        if (userDoc.exists() && userDoc.data().password === password) {
          alert('Login successful!');
          router.push('/dashboard');
        } else {
          setError('Incorrect password. Please try again.');
        }
      } else {
        await setDoc(doc(db, 'users', formattedPhone), { phoneNumber: formattedPhone, password });
        alert('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Phone Number Authentication</h2>
      <form onSubmit={otpSent ? verifyOtp : sendOtp}>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {otpSent && (
          <div>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{otpSent ? 'Verify OTP' : 'Send OTP'}</button>
      </form>

      {otpSent && (
        <form onSubmit={handleLoginOrSignup}>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{userExists ? 'Login' : 'Create Account'}</button>
        </form>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
