// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Función auxiliar para leer el rol del token (la misma que vimos antes)
const getUserRoleFromToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
  } catch (error) {
    return null;
  }
};

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y no coincide, redirige al inicio
  if (allowedRole) {
    const userRole = getUserRoleFromToken(token);
    if (userRole !== allowedRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}