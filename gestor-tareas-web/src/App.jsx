import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Building2, LogOut, FileText, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Search, Users, Settings, LayoutList, AlertTriangle, Eye, Calendar, RefreshCcw, ArrowUpDown } from 'lucide-react';
import { useTasks } from './hooks/useTasks';

function App() {
  // --- ESTADOS DE SESIÓN Y SEGURIDAD ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const isAdmin = activeUser?.email?.toLowerCase() === 'admin@gob.ar';

  // --- HOOK PERSONALIZADO ---
  const { tasks, users, taskStates, loading, error, fetchAllData, saveItem, deleteItem } = useTasks();

  // --- ESTADOS DE UI (Filtros, Orden y Paginación) ---
  const [activeTab, setActiveTab] = useState('tareas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- CONFIGURACIÓN DE ORDENAMIENTO ---
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // Restricción de calendario: Solo hasta el día de hoy
  const today = new Date().toISOString().split('T')[0];

  // --- ESTADOS DE MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '', isEdit: false, editId: null });
  const [formData, setFormData] = useState({});
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  // ==========================================
  // LÓGICA DE NEGOCIO (Login, Logout y Filtros)
  // ==========================================
  
  // Función centralizada para resetear la UI (Solución a tu problema)
  const resetUIState = () => {
    setSearchQuery('');
    setStatusFilter('Todos');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    setSortConfig({ key: 'id', direction: 'asc' });
    setActiveTab('tareas');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://localhost:44390/api/Users');
      const foundUser = response.data.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
      if (foundUser || emailInput.toLowerCase() === 'admin@gob.ar') {
        // Antes de entrar, nos aseguramos de que todo esté limpio
        resetUIState();
        setActiveUser(foundUser || { nombre: 'Administrador General', email: emailInput, id: 1 });
        setIsAuthenticated(true);
      } else {
        Swal.fire({ icon: 'error', title: 'Acceso Denegado', text: 'Credenciales no autorizadas.', confirmButtonColor: '#1e293b' });
      }
    } catch (err) {
       Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'No se pudo conectar con el servidor central.', confirmButtonColor: '#1e293b' });
    }
  };

  const handleLogout = () => {
    // Al salir, limpiamos los filtros para el próximo usuario
    resetUIState();
    setIsAuthenticated(false);
    setActiveUser(null);
    setEmailInput('');
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- PROCESAMIENTO DE DATOS (Filtro + Orden Inteligente) ---
  const processedTasks = [...tasks].filter(task => {
    const busqueda = searchQuery.toLowerCase();
    const titulo = task.titulo?.toLowerCase() || '';
    const desc = task.descripcion?.toLowerCase() || '';
    const est = task.estado?.toLowerCase() || '';
    const idS = String(task.id);
    
    const matchesSearch = idS.includes(busqueda) || titulo.includes(busqueda) || desc.includes(busqueda) || est.includes(busqueda);
    const estadoId = task.idEstado || task.estadoId || task.IdEstado;
    const matchesStatus = statusFilter === 'Todos' || String(estadoId) === statusFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const taskDate = task.fechaCreacion ? task.fechaCreacion.split('T')[0] : '';
      if (taskDate) {
        if (dateFrom && taskDate < dateFrom) matchesDate = false;
        if (dateTo && taskDate > dateTo) matchesDate = false;
      }
    }
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === 'fechaCreacion') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    }

    valA = valA ? String(valA).toLowerCase() : '';
    valB = valB ? String(valB).toLowerCase() : '';

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const currentTasks = processedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ==========================================
  // OPERACIONES CRUD
  // ==========================================
  const handleInlineStatusChange = async (taskId, newStatusId) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    try {
      await saveItem('Tasks', { ...taskToUpdate, idEstado: parseInt(newStatusId) }, taskId);
      Swal.fire({ icon: 'success', title: 'Estado actualizado', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const openModal = (type, editItem = null) => {
    const isEdit = !!editItem;
    let initialData = {};
    if (type === 'tarea') {
      initialData = isEdit ? { ...editItem } : { titulo: '', descripcion: '', idEstado: taskStates[0]?.id || 1, idUsuario: activeUser?.id || 1 };
    } else if (type === 'usuario') {
      initialData = isEdit ? { ...editItem } : { nombre: '', email: '' };
    } else if (type === 'estado') {
      initialData = isEdit ? { ...editItem } : { nombre: '' };
    }
    setModalConfig({ type, title: isEdit ? `Modificar ${type}` : `Alta de ${type}`, isEdit, editId: editItem?.id || null });
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const endpoints = { 'tarea': 'Tasks', 'usuario': 'Users', 'estado': 'TaskStates' };
      await saveItem(endpoints[modalConfig.type], formData, modalConfig.editId);
      Swal.fire({ icon: 'success', title: 'Operación exitosa', timer: 1500, showConfirmButton: false });
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const handleDelete = async (type, id) => {
    const confirm = await Swal.fire({ title: '¿Eliminar registro?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar' });
    if (confirm.isConfirmed) {
      try {
        const endpoints = { 'tarea': 'Tasks', 'usuario': 'Users', 'estado': 'TaskStates' };
        await deleteItem(endpoints[type], id);
        Swal.fire({ icon: 'success', title: 'Registro eliminado', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 border-t-4 border-slate-800 shadow-xl max-w-md w-full text-slate-800 text-center">
            <Building2 size={48} className="mx-auto mb-2" />
            <h1 className="text-xl font-bold uppercase tracking-widest">Gestión Institucional</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold mb-6">Portal de Acceso</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <label className="block text-xs font-bold text-slate-700 uppercase">Correo Electrónico Oficial</label>
            <input type="email" required className="w-full p-3 border border-slate-300 outline-none focus:border-slate-800 text-sm" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
            <button type="submit" className="w-full bg-slate-800 text-white font-bold uppercase py-3 hover:bg-slate-900 transition-colors text-sm shadow-md">Ingresar al Sistema</button>
          </form>
          <div className="mt-6 text-xs text-slate-400">
             <p>¿Problemas de acceso? Contacte con Soporte Técnico</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <h1 className="text-lg font-bold tracking-widest uppercase hidden md:block text-slate-100">Sistema de Gestión Central</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">{activeUser?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 uppercase text-xs ml-2 border-l border-slate-700 pl-4 transition-colors"><LogOut size={16} /> Salir</button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mt-4 px-4">
          <div className="bg-red-50 border-l-4 border-red-700 p-4 flex items-center gap-3 text-red-900 shadow-sm">
            <AlertTriangle size={20} /> <span className="font-bold text-sm uppercase">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-slate-200 mt-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {[
            { id: 'tareas', label: 'Gestión de Tareas', icon: LayoutList },
            ...(isAdmin ? [
              { id: 'usuarios', label: 'Usuarios', icon: Users },
              { id: 'estados', label: 'Estados', icon: Settings }
            ] : [])
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 font-bold uppercase text-xs tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === 'tareas' && (
          <div className="animate-in fade-in">
            <div className="bg-white p-4 border border-slate-200 flex flex-col xl:flex-row justify-between items-start gap-4 mb-6 shadow-sm">
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="relative w-full lg:w-96">
                    <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" placeholder="Búsqueda por ID, Asunto o Estado..." className="w-full pl-10 p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center border border-slate-300 bg-white px-2">
                      <Calendar size={16} className="text-slate-400 mr-2" />
                      <span className="text-xs text-slate-500 font-bold uppercase mr-2 hidden sm:inline">Desde</span>
                      <input type="date" max={today} className="p-2 outline-none text-sm text-slate-700 bg-transparent" value={dateFrom} onChange={(e) => {setDateFrom(e.target.value); setCurrentPage(1);}} />
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="flex items-center border border-slate-300 bg-white px-2">
                      <span className="text-xs text-slate-500 font-bold uppercase mr-2 hidden sm:inline">Hasta</span>
                      <input type="date" max={today} className="p-2 outline-none text-sm text-slate-700 bg-transparent" value={dateTo} onChange={(e) => {setDateTo(e.target.value); setCurrentPage(1);}} />
                    </div>
                    <button onClick={resetUIState} className="p-2.5 bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 transition-colors rounded shadow-sm" title="Limpiar Filtros">
                      <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase mr-2">Filtrar por Estado:</span>
                  <button onClick={() => { setStatusFilter('Todos'); setCurrentPage(1); }} className={`px-4 py-1.5 text-xs font-bold uppercase transition-all border ${statusFilter === 'Todos' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>Todos</button>
                  {taskStates.map(state => (
                    <button key={state.id} onClick={() => { setStatusFilter(String(state.id)); setCurrentPage(1); }} className={`px-4 py-1.5 text-xs font-bold uppercase transition-all border ${statusFilter === String(state.id) ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>{state.nombre}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => openModal('tarea')} className="bg-slate-800 text-white px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold uppercase hover:bg-slate-900 whitespace-nowrap shadow-md transition-colors w-full xl:w-auto h-fit mt-2 xl:mt-0">
                <Plus size={16} /> Nueva Tarea
              </button>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto rounded-sm">
              <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="bg-slate-100 uppercase text-xs font-bold text-slate-700">
                  <tr>
                    <th 
                      className={`px-4 py-4 w-24 cursor-pointer hover:bg-slate-200 transition-all relative border-b border-slate-300 ${sortConfig.key === 'id' ? 'text-blue-800' : ''}`} 
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center gap-2">ID <ArrowUpDown size={14} className={sortConfig.key === 'id' ? 'text-blue-600' : 'text-slate-400'} /></div>
                      {sortConfig.key === 'id' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-700"></div>}
                    </th>
                    <th 
                      className={`px-4 py-4 cursor-pointer hover:bg-slate-200 transition-all relative border-b border-slate-300 ${sortConfig.key === 'titulo' ? 'text-blue-800' : ''}`} 
                      onClick={() => requestSort('titulo')}
                    >
                      <div className="flex items-center gap-2">Asunto de la Tarea <ArrowUpDown size={14} className={sortConfig.key === 'titulo' ? 'text-blue-600' : 'text-slate-400'} /></div>
                      {sortConfig.key === 'titulo' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-700"></div>}
                    </th>
                    <th 
                      className={`px-4 py-4 w-48 cursor-pointer hover:bg-slate-200 transition-all relative border-b border-slate-300 ${sortConfig.key === 'fechaCreacion' ? 'text-blue-800' : ''}`} 
                      onClick={() => requestSort('fechaCreacion')}
                    >
                      <div className="flex items-center gap-2">Fecha de Alta <ArrowUpDown size={14} className={sortConfig.key === 'fechaCreacion' ? 'text-blue-600' : 'text-slate-400'} /></div>
                      {sortConfig.key === 'fechaCreacion' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-700"></div>}
                    </th>
                    <th className="px-4 py-4 w-48 border-b border-slate-300">Estado</th>
                    <th className="px-4 py-4 w-40 text-right border-b border-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-500 uppercase text-xs font-bold animate-pulse">Obteniendo datos...</td></tr>
                  ) : currentTasks.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-500 font-bold uppercase text-xs">No se encontraron registros.</td></tr>
                  ) : (
                    currentTasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-mono text-slate-500 font-bold border-b border-slate-100">#{task.id}</td>
                        <td className="px-4 py-4 font-bold text-slate-800 border-b border-slate-100">{task.titulo}</td>
                        <td className="px-4 py-4 text-slate-600 font-medium text-xs border-b border-slate-100">
                          {task.fechaCreacion ? new Date(task.fechaCreacion).toLocaleDateString('es-AR') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 border-b border-slate-100">
                          <select className="border border-slate-300 text-xs p-2 w-full bg-white outline-none cursor-pointer focus:border-slate-800 font-bold text-slate-700 shadow-sm" value={task.idEstado} onChange={(e) => handleInlineStatusChange(task.id, e.target.value)}>
                            {taskStates.map(state => <option key={state.id} value={state.id}>{state.nombre}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right border-b border-slate-100">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setViewingTask(task)} className="text-blue-700 hover:bg-blue-100 p-2 transition-colors rounded" title="Ver Detalle"><Eye size={18} /></button>
                            <button onClick={() => openModal('tarea', task)} className="text-slate-600 hover:bg-slate-200 p-2 transition-colors rounded" title="Modificar"><Edit size={16} /></button>
                            <button onClick={() => handleDelete('tarea', task.id)} className="text-red-600 hover:bg-red-100 p-2 transition-colors rounded" title="Eliminar"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="bg-slate-50 p-3 flex items-center justify-between border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mostrando {Math.min(currentPage*itemsPerPage, processedTasks.length)} de {processedTasks.length}</span>
                <div className="flex gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-slate-300 bg-white disabled:opacity-50 hover:bg-slate-100 shadow-sm"><ChevronLeft size={16} /></button>
                  <button disabled={currentPage >= Math.ceil(processedTasks.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-slate-300 bg-white disabled:opacity-50 hover:bg-slate-100 shadow-sm"><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑAS ADMIN --- */}
        {((activeTab === 'usuarios' || activeTab === 'estados') && isAdmin) && (
          <div className="animate-in fade-in bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold uppercase text-slate-800">Directorio: {activeTab === 'usuarios' ? 'Usuarios' : 'Estados'}</h2>
              <button onClick={() => openModal(activeTab === 'usuarios' ? 'usuario' : 'estado')} className="bg-slate-800 text-white px-5 py-2.5 text-sm font-bold uppercase hover:bg-slate-900 flex items-center gap-2 shadow-md transition-colors"><Plus size={16} /> Registrar Nuevo</button>
            </div>
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <thead className="bg-slate-50 uppercase text-xs font-bold text-slate-600">
                <tr>
                  <th className="p-4 border-b border-slate-200">ID</th>
                  <th className="p-4 border-b border-slate-200">Descripción</th>
                  <th className="p-4 text-right border-b border-slate-200">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'usuarios' ? users : taskStates).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500 font-bold border-b border-slate-50">#{item.id}</td>
                    <td className="p-4 font-bold text-slate-800 border-b border-slate-50">{item.nombre} <span className="font-normal text-slate-500 ml-2">{item.email ? `(${item.email})` : ''}</span></td>
                    <td className="p-4 text-right border-b border-slate-50">
                      <button onClick={() => openModal(activeTab === 'usuarios' ? 'usuario' : 'estado', item)} className="text-slate-600 p-2 hover:bg-slate-200 mr-2 rounded"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(activeTab === 'usuarios' ? 'usuario' : 'estado', item.id)} className="text-red-600 p-2 hover:bg-red-100 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL DE DETALLE (24HS) */}
      {viewingTask && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border-t-4 border-blue-800 w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3"><FileText className="text-blue-800" size={24} /><h2 className="text-lg font-bold uppercase tracking-wider text-slate-800">Detalle de la Tarea #{viewingTask.id}</h2></div>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Asunto</h3><p className="text-xl font-bold text-slate-900">{viewingTask.titulo}</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-slate-100 py-4">
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha de Alta</h3>
                  <p className="font-semibold text-slate-800 flex items-center gap-2"><Calendar size={14} className="text-slate-400" />
                    {viewingTask.fechaCreacion ? new Date(viewingTask.fechaCreacion).toLocaleString('es-AR', {hour12: false, day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'}) + " hs" : 'Sin fecha'}
                  </p>
                </div>
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estado</h3><span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">{viewingTask.estado || 'No especificado'}</span></div>
              </div>
              <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detalle de la Tarea</h3>
                <div className="bg-slate-50 border border-slate-200 p-4 min-h-[120px] text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {viewingTask.descripcion || <span className="italic text-slate-400">Sin descripción registrada</span>}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setViewingTask(null)} className="px-6 py-2.5 bg-slate-800 font-bold uppercase text-white hover:bg-slate-900 text-xs shadow-md">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ABM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border-t-4 border-slate-800 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 bg-slate-50 text-slate-800 flex items-center gap-3"><FileText size={24} /><h2 className="text-base font-bold uppercase tracking-wider">{modalConfig.title}</h2></div>
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
              {modalConfig.type === 'tarea' && (
                <>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asunto de la Tarea *</label>
                  <input required className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detalle de la Tarea</label>
                  <textarea rows="4" className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm resize-none shadow-sm" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado</label>
                  <select className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm bg-white font-semibold" value={formData.idEstado} onChange={e => setFormData({...formData, idEstado: parseInt(e.target.value)})}>
                    {taskStates.map(state => <option key={state.id} value={state.id}>{state.nombre}</option>)}
                  </select></div>
                </>
              )}
              {modalConfig.type === 'usuario' && (
                <>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo *</label>
                  <input required className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico Oficial *</label>
                  <input required type="email" className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                </>
              )}
              {modalConfig.type === 'estado' && (
                <div><label className="block text-xs font-bold text-slate-700 uppercase mb-1">Denominación del Estado *</label>
                <input required className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
              )}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 border border-slate-300 font-bold uppercase text-slate-600 hover:bg-slate-100 text-xs tracking-wider transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 p-3 bg-slate-800 font-bold uppercase text-white hover:bg-slate-900 text-xs shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;