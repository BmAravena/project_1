// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.access_token);

      // Decodificamos el rol rápidamente para saber a dónde mandarlo
      const base64Url = data.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      
      if (decoded.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      setError('Credenciales inválidas o error de conexión con FastAPI');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <h2>Iniciar Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Correo electrónico" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}