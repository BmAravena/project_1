import React, { useState } from 'react';
import { loginUser } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("¡Form was submitted correctly!"); 
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 w-full">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 w-fit mx-auto">
            FASTAPI + REACT
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-sm text-slate-400">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Email o Usuario</label>
            <input 
              type="text" 
              placeholder="tucorreo@ejemplo.com" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Contraseña</label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition duration-200 active:scale-[0.99]"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
      
      {/* Footer minimalista opcional */}
      <footer className="mt-8 text-xs text-slate-500 text-center">
        Sistema Backend FastAPI & Frontend TypeScript • Tailwind v4
      </footer>
    </div>
  );
}