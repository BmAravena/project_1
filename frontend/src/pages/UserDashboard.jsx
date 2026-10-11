// frontend/src/pages/UserDashboard.jsx
import React from 'react';

export default function UserDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Usuario 👤</h1>
      <p>Bienvenido a tu vista personal.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}