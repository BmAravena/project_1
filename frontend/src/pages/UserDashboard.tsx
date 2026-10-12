import React from 'react';

export default function UserDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      {/* Navbar Superior de Ancho Completo */}
      <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex justify-between items-center shadow-lg w-full">
        <div className="flex items-center gap-3">
          <span className="bg-purple-600/20 text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-500/30">
            DASHBOARD
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white">Mi Panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido Principal de Ancho Completo */}
      <main className="flex-1 w-full p-6 md:p-8 flex flex-col gap-8">
        {/* Bienvenida personalizada como Banner de Ancho Completo */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div>
            <h2 className="text-3xl font-extrabold text-white">¡Bienvenido de nuevo, Benjamín!</h2>
            <p className="text-slate-300 text-base mt-2 max-w-xl">Aquí tienes un resumen rápido de tu cuenta y acceso directo a tus configuraciones principales.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-700 p-4 rounded-2xl shadow">
               <div className="w-12 h-12 h-rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white">B</div>
               <div>
                   <p className="text-sm font-semibold text-white">benjamin</p>
                   <p className="text-xs text-slate-400">benjamin@fastapi.dev</p>
               </div>
          </div>
        </div>

        {/* Paneles de Información de Ancho Completo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Perfil */}
          <div className="bg-slate-900 border border-slate-700/60 p-8 rounded-3xl shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-4">
                 <h3 className="text-xl font-bold text-white">Información de Perfil</h3>
                 <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition">Editar</button>
            </div>
            <div className="flex flex-col gap-3 text-sm text-slate-200">
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400 font-medium">Nombre de Usuario</span>
                <span className="font-semibold text-white">benjamin</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400 font-medium">Estado de Autenticación</span>
                <span className="font-medium text-emerald-400">Token JWT Válido</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-medium">Rol asignado</span>
                <span className="font-semibold text-purple-400">User</span>
              </div>
               <div className="flex justify-between py-2 border-t border-slate-700/30 mt-1">
                <span className="text-slate-400 font-medium">Última IP</span>
                <span className="font-medium text-slate-300">192.168.1.1</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-slate-900 border border-slate-700/60 p-8 rounded-3xl shadow-2xl flex flex-col gap-5">
            <h3 className="text-xl font-bold text-white border-b border-slate-700/60 pb-4">Acciones y Seguridad</h3>
            <div className="flex flex-col gap-4">
              <button className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-700/70 text-white text-sm font-medium py-3.5 px-5 rounded-2xl transition duration-150 text-left flex justify-between items-center shadow group">
                <span className="group-hover:text-blue-400">Actualizar Contraseña</span>
                <span className="text-slate-500 group-hover:text-blue-400 transition">→</span>
              </button>
              <button className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-700/70 text-white text-sm font-medium py-3.5 px-5 rounded-2xl transition duration-150 text-left flex justify-between items-center shadow group">
                <span className="group-hover:text-blue-400">Verificar Conexión con FastAPI</span>
                <span className="text-slate-500 group-hover:text-blue-400 transition">→</span>
              </button>
               <button className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-3.5 px-5 rounded-2xl transition duration-150 text-left flex justify-between items-center shadow-md">
                <span>Eliminar Cuenta</span>
                <span>×</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}