import React, { useEffect, useState } from 'react';
import api from '../services/api';

type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  owner_id: number;
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'createTask' | 'profile'>('tasks');

  // Estados para listar y buscar tareas propias
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para crear tareas
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [taskCreateError, setTaskCreateError] = useState('');
  const [taskCreateSuccess, setTaskCreateSuccess] = useState('');

  const loadTasks = async () => {
    setTasksLoading(true);
    setTasksError('');
    try {
      // El backend devuelve únicamente las tareas del usuario autenticado
      const response = await api.get('/api/v1/tasks/');
      setTasks(response.data);
    } catch (error: any) {
      console.error('Error al cargar tareas:', error);
      setTasksError('No se pudieron cargar tus tareas. Intenta nuevamente.');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskCreateError('');
    setTaskCreateSuccess('');

    try {
      // No se envía owner_id: el backend asigna la tarea al usuario autenticado
      await api.post('/api/v1/tasks/', {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() ? newTaskDescription : null,
      });

      setTaskCreateSuccess('¡Tarea creada exitosamente!');
      setNewTaskTitle('');
      setNewTaskDescription('');
      await loadTasks();

      setTimeout(() => {
        setActiveTab('tasks');
        setTaskCreateSuccess('');
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear tarea:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          setTaskCreateError(detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(' | '));
        } else if (typeof detail === 'object') {
          setTaskCreateError(JSON.stringify(detail));
        } else {
          setTaskCreateError(detail);
        }
      } else {
        setTaskCreateError('Ocurrió un error al crear la tarea.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // "replace" removes the dashboard from history, so the back button
    // cannot return to the page that was open before logging out.
    window.location.replace('/login');
  };

  // Búsqueda local sobre las tareas que ya devolvió el backend (solo las propias)
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTasks = normalizedSearch
    ? tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(normalizedSearch) ||
          (task.description || '').toLowerCase().includes(normalizedSearch) ||
          String(task.id) === normalizedSearch
        );
      })
    : tasks;

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

        {/* Pestañas de Navegación */}
        <div className="flex flex-wrap gap-3 bg-slate-900 border border-slate-700/60 p-2.5 rounded-2xl shadow-md w-fit">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            ✅ Mis Tareas
          </button>
          <button
            onClick={() => setActiveTab('createTask')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'createTask' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            ➕ Nueva Tarea
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'profile' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            👤 Mi Perfil
          </button>
        </div>

        {/* VISTA 1: MIS TAREAS (LISTAR + BUSCAR) */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/60 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-slate-900/70">
              <div>
                <h2 className="text-lg font-bold text-white">Mis Tareas</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Solo se muestran las tareas que pertenecen a tu usuario.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 bg-slate-950 border border-slate-700 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={loadTasks}
                  disabled={tasksLoading}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
                >
                  {tasksLoading ? 'Cargando...' : '🔄 Recargar'}
                </button>
              </div>
            </div>

            {tasksError && (
              <div className="m-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl text-center font-medium">
                {tasksError}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700/60">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Título</th>
                    <th className="p-4 font-medium">Descripción</th>
                    <th className="p-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        {tasksLoading
                          ? 'Cargando tareas...'
                          : normalizedSearch
                            ? 'No se encontraron tareas que coincidan con tu búsqueda.'
                            : 'Aún no tienes tareas. Crea una nueva desde la pestaña "Nueva Tarea".'}
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-700/20 transition">
                        <td className="p-4 text-slate-400 font-mono">{task.id}</td>
                        <td className="p-4 font-medium text-white">{task.title}</td>
                        <td className="p-4 text-slate-300 max-w-xs truncate">{task.description || '—'}</td>
                        <td className="p-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${task.completed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                            {task.completed ? 'Completada' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-slate-700/60 text-xs text-slate-400">
              Mostrando {filteredTasks.length} de {tasks.length} tarea(s).
            </div>
          </div>
        )}

        {/* VISTA 2: CREAR TAREA */}
        {activeTab === 'createTask' && (
          <div className="bg-slate-900 border border-slate-700/60 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Crear Nueva Tarea</h2>
              <p className="text-slate-400 text-sm mt-1">La tarea se asignará automáticamente a tu usuario.</p>
            </div>

            {taskCreateError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl text-center font-medium">
                {taskCreateError}
              </div>
            )}

            {taskCreateSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3.5 rounded-xl text-center font-medium">
                {taskCreateSuccess}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Título</label>
                <input
                  type="text"
                  placeholder="Ej. Revisar reporte mensual"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Descripción (Opcional)</label>
                <textarea
                  placeholder="Detalles de la tarea..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={4}
                  className="bg-slate-950 border border-slate-700 text-white text-sm p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button type="submit" className="mt-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold p-3.5 rounded-xl shadow-lg transition">
                Guardar y Crear Tarea
              </button>
            </form>
          </div>
        )}

        {/* VISTA 3: PERFIL Y ACCIONES */}
        {activeTab === 'profile' && (
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
        )}
      </main>
    </div>
  );
}
