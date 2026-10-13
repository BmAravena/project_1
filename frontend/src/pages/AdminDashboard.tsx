import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'detail' | 'create'>('list');
  const [searchId, setSearchId] = useState('');
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  // Estados para crear usuario alineados con Pydantic (UserCreate)
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  useEffect(() => {
    if (activeTab === 'list') {
      api.get('/api/v1/users/')
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error al cargar usuarios:", error));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      await api.delete(`/api/v1/users/${id}`);
      setUsers(users.filter((user: any) => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setSearchError('');
    setSearchedUser(null);

    try {
      const response = await api.get(`/api/v1/users/${searchId}`);
      setSearchedUser(response.data);
    } catch (error: any) {
      console.error("Error al buscar usuario:", error);
      if (error.response && error.response.status === 404) {
        setSearchError("Usuario no encontrado.");
      } else {
        setSearchError("Ocurrió un error al realizar la búsqueda.");
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    try {
      // Petición apuntando al prefijo correcto /api/v1/users/
      await api.post('/api/v1/users/', {
        email: newEmail,
        full_name: newFullName.trim() ? newFullName : null,
        hashed_password: newPassword,
        role: newRole,
        is_active: true
      });

      setCreateSuccess('¡Usuario creado exitosamente!');
      setNewEmail('');
      setNewFullName('');
      setNewPassword('');
      setNewRole('user');

      setTimeout(() => {
        setActiveTab('list');
        setCreateSuccess('');
      }, 1500);

    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          const errorMessages = detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(' | ');
          setCreateError(errorMessages);
        } else if (typeof detail === 'object') {
          setCreateError(JSON.stringify(detail));
        } else {
          setCreateError(detail);
        }
      } else {
        setCreateError("Ocurrió un error al registrar el usuario.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      {/* Navbar Superior */}
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

      {/* Contenido Principal */}
      <main className="flex-1 w-full p-6 md:p-8 flex flex-col gap-6">
        
        {/* Pestañas de Navegación */}
        <div className="flex flex-wrap gap-3 bg-slate-900 border border-slate-700/60 p-2.5 rounded-2xl shadow-md w-fit">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            📋 Listar Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('detail')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'detail' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            🔍 Buscar / Ver Usuario (por ID)
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            ➕ Registrar Nuevo Usuario
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            ➕ Get tasks
          </button>
        </div>

        {/* VISTA 1: LISTAR USUARIOS */}
        {activeTab === 'list' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-700/60 flex justify-between items-center bg-slate-900/70">
                <h2 className="text-lg font-bold text-white">Gestión de Usuarios</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700/60">
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">Nombre / Email</th>
                      <th className="p-4 font-medium">Rol</th>
                      <th className="p-4 font-medium text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">No hay usuarios registrados o cargando...</td>
                      </tr>
                    ) : (
                      users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-slate-700/20 transition">
                          <td className="p-4 text-slate-400 font-mono">{user.id}</td>
                          <td className="p-4">
                            <div className="font-medium text-white">{user.email}</div>
                            {user.full_name && <div className="text-xs text-slate-400">{user.full_name}</div>}
                          </td>
                          <td className="p-4 text-blue-400 font-semibold">{user.role || 'user'}</td>
                          <td className="p-4 flex justify-center gap-2">
                            <button 
                              onClick={() => handleDelete(user.id)} 
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-500/30 transition"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: BUSCAR USUARIO POR ID */}
        {activeTab === 'detail' && (
          <div className="bg-slate-900 border border-slate-700/60 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Buscar Usuario por ID</h2>
              <p className="text-slate-400 text-sm mt-1">Consulta los detalles específicos de un usuario mediante su identificador único.</p>
            </div>

            <form onSubmit={handleSearchUser} className="flex gap-3">
              <input 
                type="number" 
                placeholder="Ingresa el ID del usuario..." 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow transition">
                Buscar
              </button>
            </form>

            {searchError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl text-center">
                {searchError}
              </div>
            )}

            {searchedUser && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col gap-4 mt-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">¡Usuario encontrado exitosamente!</span>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">ID:</span> <span className="text-white font-mono">{searchedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span> <span className="text-white">{searchedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Nombre:</span> <span className="text-white">{searchedUser.full_name || 'No especificado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Rol:</span> <span className="text-blue-400 font-semibold">{searchedUser.role}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: CREAR USUARIO */}
        {activeTab === 'create' && (
          <div className="bg-slate-900 border border-slate-700/60 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Crear Nuevo Usuario</h2>
              <p className="text-slate-400 text-sm mt-1">Añade un nuevo usuario directamente desde el panel.</p>
            </div>

            {createError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl text-center font-medium">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3.5 rounded-xl text-center font-medium">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="usuario@ejemplo.com" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Nombre Completo (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ej. Juan Pérez" 
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Contraseña</label>
                  <span className="text-[10px] text-slate-400">Entre 8 y 30 caracteres</span>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  maxLength={30}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Rol del Sistema</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User (Estándar)</option>
                  <option value="admin">Admin (Administrador)</option>
                </select>
              </div>

              <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3.5 rounded-xl shadow-lg transition">
                Guardar y Crear Usuario
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}