// frontend/src/pages/AdminDashboard.jsx
import React from 'react';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Administración 🛡️</h1>
      <p>Bienvenido, administrador. Aquí tienes control total del sistema.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}