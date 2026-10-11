// frontend/src/pages/UserDashboard.jsx
import React from 'react';

export default function UserDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Dashboard 👤</h1>
      <p>Welcome to your personal view.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}