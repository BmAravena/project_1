import React from 'react';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard 🛡️</h1>
      <p>Welcome, administrator. Here you have full control of the system.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}