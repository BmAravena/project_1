import React from 'react';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      {/* Navbar Superior de Ancho Completo */}
      <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex justify-between items-center shadow-lg w-full">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/30">
            ADMIN PANEL
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white">Panel de Administración</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido Principal de Ancho Completo */}
      <main className="flex-1 w-full p-6 md:p-8 grid grid-cols-1 gap-6">
        {/* Título de Sección */}
        <div className="pb-4 border-b border-slate-700/60">
          <h2 className="text-2xl font-bold text-white">Resumen Global</h2>
          <p className="text-slate-400 text-sm mt-1">Métricas clave y actividad del sistema a nivel global.</p>
        </div>

        {/* Tarjetas de Estadísticas de Ancho Completo (grid flexible) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-600/80 transition group">
            <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300">Usuarios Totales</span>
            <span className="text-3xl font-extrabold text-white mt-2">1,245</span>
            <span className="text-xs text-emerald-400 mt-2 font-medium">↑ 12% este mes</span>
          </div>
          <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-600/80 transition group">
            <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300">Conexiones Activas</span>
            <span className="text-3xl font-extrabold text-white mt-2">328</span>
            <span className="text-xs text-blue-400 mt-2 font-medium">Estable</span>
          </div>
          <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-600/80 transition group">
            <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300">Estado del Sistema</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-2">99.9%</span>
            <span className="text-xs text-slate-400 mt-2">Operando sin fallos</span>
          </div>
           <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-600/80 transition group lg:hidden xl:flex">
            <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300">Alertas Críticas</span>
            <span className="text-3xl font-extrabold text-white mt-2">2</span>
            <span className="text-xs text-red-400 mt-2 font-medium">Atención requerida</span>
          </div>
        </div>

        {/* Sección de Tabla / Gestión de Ancho Completo */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-700/60 flex justify-between items-center bg-slate-900/70">
            <h2 className="text-lg font-bold text-white">Actividad Reciente</h2>
            <div className="flex gap-2">
                 <input type="search" placeholder="Buscar usuario..." className="bg-slate-800 border border-slate-700 text-white text-sm px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"/>
                 <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-blue-500/20 transition duration-150">
                   Exportar
                 </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-full">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700/60">
                  <th className="p-5 font-medium">Usuario</th>
                  <th className="p-5 font-medium">Rol</th>
                  <th className="p-5 font-medium">Estado</th>
                  <th className="p-5 font-medium">Último Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                <tr className="hover:bg-slate-700/20 transition cursor-pointer">
                  <td className="p-5 font-medium text-white flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center font-bold">B</div> benjamin.millanao</td>
                  <td className="p-5 text-blue-400">Admin</td>
                  <td className="p-5"><span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">Activo</span></td>
                  <td className="p-5 text-slate-400">Hace 5 minutos</td>
                </tr>
                <tr className="hover:bg-slate-700/20 transition cursor-pointer">
                  <td className="p-5 font-medium text-white flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center font-bold">D</div> dev_user_01</td>
                  <td className="p-5 text-slate-300">Usuario</td>
                  <td className="p-5"><span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">Activo</span></td>
                  <td className="p-5 text-slate-400">Hace 2 horas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}