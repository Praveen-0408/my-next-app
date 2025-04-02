"use client";

// pages/settings.js
import { useState } from 'react';
import Layout from '@/components/layout';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Settings updated successfully!');
  };

  return (
    <Layout title="Settings">
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Enable Email Notifications
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="theme" style={{ display: 'block', marginBottom: '5px' }}>
            Theme:
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Save Settings
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>
          {message}
        </p>
      )}
    </Layout>
  );
}