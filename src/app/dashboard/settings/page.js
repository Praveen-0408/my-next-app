"use client";

import { useState, useEffect } from "react";

export default function Settings() {
  const [user, setUser] = useState({
    fullName: "Vishnu Kumar",
    email: "vishnu@example.com",
    phone: "+91 9876543210",
  });
  const [password, setPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = useState("Light");

  useEffect(() => {
    // Ensure values like Date/Time are set only on the client
    setUser((prev) => ({
      ...prev,
      lastLogin: new Date().toLocaleString(), // This avoids hydration mismatch
    }));
  }, []);

  const handleProfileUpdate = () => {
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    alert("Password changed successfully!");
    setPassword("");
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <h3>Profile Information</h3>
      <label>Full Name:</label>
      <input
        type="text"
        value={user.fullName}
        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
      />

      <label>Email:</label>
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <label>Phone:</label>
      <input
        type="text"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />

      <button onClick={handleProfileUpdate}>Update Profile</button>

      <h3>Security Settings</h3>
      <label>Change Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={handleChangePassword}>Change Password</button>

      <label>
        <input
          type="checkbox"
          checked={twoFA}
          onChange={() => setTwoFA(!twoFA)}
        />
        Enable Two-Factor Authentication (2FA)
      </label>

      <h3>Notification Preferences</h3>
      <label>
        <input
          type="checkbox"
          checked={notifications.email}
          onChange={() =>
            setNotifications({ ...notifications, email: !notifications.email })
          }
        />
        Email Notifications
      </label>

      <label>
        <input
          type="checkbox"
          checked={notifications.sms}
          onChange={() =>
            setNotifications({ ...notifications, sms: !notifications.sms })
          }
        />
        SMS Notifications
      </label>

      <label>
        <input
          type="checkbox"
          checked={notifications.push}
          onChange={() =>
            setNotifications({ ...notifications, push: !notifications.push })
          }
        />
        Push Notifications
      </label>

      <h3>Theme Settings</h3>
      <label>Choose Theme:</label>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="Light">Light Mode</option>
        <option value="Dark">Dark Mode</option>
      </select>

      <style jsx>{`
        .settings-container {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h2, h3 {
          color: #333;
          margin-bottom: 10px;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          background: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}
