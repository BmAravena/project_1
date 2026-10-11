import React, { useState } from 'react';
import { loginUser } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("¡El formulario fue enviado!"); // <--- Añade esto
    setError(null);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.access_token);

      // Decode the JWT to get the role and redirect accordingly
      const base64Url = data.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      
      if (decoded.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error("Error during login:", err);
      setError('Invalid credentials or connection error with FastAPI');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Email" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}