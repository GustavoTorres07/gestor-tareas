import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Building2, LogOut, FileText, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Search, Users, Settings, LayoutList, AlertTriangle } from 'lucide-react';
import { useTasks } from './hooks/useTasks';

function App() {
  // --- ESTADOS DE SESIÓN Y ROLES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const isAdmin = activeUser?.email?.toLowerCase() === 'admin@gob.ar';

  // --- HOOK PERSONALIZADO ---
  const { tasks, users, taskStates, loading, error, fetchAllData, saveItem, deleteItem } = useTasks();

  // --- ESTADOS DE UI ---
  const [activeTab, setActiveTab] = useState('tareas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- ESTADOS DEL MODAL (Formulario Crear/Editar) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '', isEdit: false, editId: null });
  const [formData, setFormData] = useState({});

  // ==========================================
  // EFECTOS Y LOGIN
  // ==========================================
  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Buscamos en la base de datos directamente al intentar ingresar
      const response = await axios.get('https://localhost:44390/api/Users');
      const foundUser = response.data.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
      
      if (foundUser || emailInput.toLowerCase() === 'admin@gob.ar') {
        setActiveUser(foundUser || { nombre: 'Administrador General', email: emailInput, id: 1 });
        setIsAuthenticated(true);
      } else {
        Swal.fire({ icon: 'error', title: 'Acceso Denegado', text: 'Credenciales no autorizadas en el sistema.', confirmButtonColor: '#1e293b' });
      }
    } catch (err) {
       Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'No se pudo conectar con el servidor para validar su identidad.', confirmButtonColor: '#1e293b' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('tareas');
    setEmailInput('');
  };

  // ==========================================
  // LÓGICA DE TAREAS (Filtros Seguros y Paginación)
  // ==========================================
  const processedTasks = tasks.filter(task => {
    // 1. Buscador seguro (protegemos por si titulo o descripcion vienen nulos de la BD)
    const tituloSeguro = task.titulo ? task.titulo.toLowerCase() : '';
    const descSegura = task.descripcion ? task.descripcion.toLowerCase() : '';
    const busquedaSegura = searchQuery.toLowerCase();
    
    const matchesSearch = tituloSeguro.includes(busquedaSegura) || descSegura.includes(busquedaSegura);
    
    // 2. Filtro seguro (usamos String() para evitar el error 'Cannot read properties of undefined')
    const matchesStatus = statusFilter === 'Todos' || String(task.idEstado) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const currentTasks = processedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInlineStatusChange = async (taskId, newStatusId) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    try {
      await saveItem('Tasks', { ...taskToUpdate, idEstado: parseInt(newStatusId) }, taskId);
      Swal.fire({ icon: 'success', title: 'Estado actualizado', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  // ==========================================
  // LÓGICA DE FORMULARIOS (CREAR / EDITAR)
  // ==========================================
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

    setModalConfig({ 
      type, 
      title: isEdit ? `Modificar ${type}` : `Alta de ${type}`, 
      isEdit, 
      editId: editItem?.id || null 
    });
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
    const confirm = await Swal.fire({ title: '¿Eliminar registro?', text: 'Esta acción es irreversible.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar' });
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

  // ==========================================
  // VISTA: LOGIN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 border-t-4 border-slate-800 shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center mb-6 text-slate-800">
            <Building2 size={48} className="mb-2" />
            <h1 className="text-xl font-bold uppercase tracking-widest text-center">Gestión Institucional</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase">Portal de Acceso</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required className="w-full p-3 border border-slate-300 outline-none focus:border-slate-800 text-sm" placeholder="Correo electrónico oficial" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
            <button type="submit" className="w-full bg-slate-800 text-white font-bold uppercase py-3 hover:bg-slate-900 transition-colors text-sm shadow-md">Ingresar al Sistema</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer transition-colors">
              ¿Tienes algún problema? Contactarse con el área de soporte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA: DASHBOARD PRINCIPAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <h1 className="text-lg font-bold tracking-widest uppercase hidden md:block">Sistema de Gestión Central</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">{activeUser?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 uppercase text-xs ml-2 border-l border-slate-700 pl-4 transition-colors"><LogOut size={16} /> Salir</button>
          </div>
        </div>
      </header>

      {/* MANEJO DE ERRORES */}
      {error && (
        <div className="max-w-7xl mx-auto mt-4 px-4">
          <div className="bg-red-50 border-l-4 border-red-700 p-4 flex items-center gap-3 text-red-900 shadow-sm">
            <AlertTriangle size={20} /> <span className="font-bold text-sm uppercase">{error}</span>
          </div>
        </div>
      )}

      {/* TABS DE NAVEGACIÓN */}
      <div className="bg-white border-b border-slate-200 mt-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {[
            { id: 'tareas', label: 'Gestión de Tareas', icon: LayoutList },
            ...(isAdmin ? [
              { id: 'usuarios', label: 'Usuarios del Sistema', icon: Users },
              { id: 'estados', label: 'Estados de Tarea', icon: Settings }
            ] : [])
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 font-bold uppercase text-xs tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* ========================================== */}
        {/* PESTAÑA: TAREAS */}
        {/* ========================================== */}
        {activeTab === 'tareas' && (
          <div className="animate-in fade-in">
            {/* HERRAMIENTAS: Buscador, Filtros (Mini-Cards) y Botón */}
            <div className="bg-white p-4 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shadow-sm">
              <div className="flex flex-col xl:flex-row gap-4 w-full items-start xl:items-center">
                
                {/* BUSCADOR */}
                <div className="relative w-full xl:w-80">
                  <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" placeholder="Buscar por asunto..." className="w-full pl-10 p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
                </div>

                {/* FILTROS TIPO MINI-CARDS (CHIPS) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => { setStatusFilter('Todos'); setCurrentPage(1); }}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-all border ${statusFilter === 'Todos' ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
                  >
                    Todos
                  </button>
                  {taskStates.map(state => (
                    <button 
                      key={state.id}
                      onClick={() => { setStatusFilter(String(state.id)); setCurrentPage(1); }}
                      className={`px-4 py-2 text-xs font-bold uppercase transition-all border ${statusFilter === String(state.id) ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
                    >
                      {state.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => openModal('tarea')} className="bg-slate-800 text-white px-6 py-2.5 flex items-center gap-2 text-sm font-bold uppercase hover:bg-slate-900 whitespace-nowrap shadow-md transition-colors">
                <Plus size={16} /> Nuevo Registro
              </button>
            </div>

            {/* TABLA DE TAREAS */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-4 py-4 w-20">ID Ref.</th>
                    <th className="px-4 py-4">Asunto del Expediente</th>
                    <th className="px-4 py-4 w-48">Estado Actual</th>
                    <th className="px-4 py-4 w-32 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-10 text-slate-500 uppercase text-xs font-bold animate-pulse">Consultando base de datos central...</td></tr>
                  ) : currentTasks.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-10 text-slate-500">No se encontraron registros bajo los parámetros indicados.</td></tr>
                  ) : (
                    currentTasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-mono text-slate-500 text-xs">#{task.id}</td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-800">{task.titulo}</p>
                          <p className="text-slate-500 mt-1 text-xs line-clamp-2">{task.descripcion}</p>
                        </td>
                        <td className="px-4 py-4">
                          <select className="border border-slate-300 text-xs p-2 w-full bg-white outline-none cursor-pointer focus:border-slate-800 font-bold text-slate-700 shadow-sm" value={task.idEstado} onChange={(e) => handleInlineStatusChange(task.id, e.target.value)}>
                            {taskStates.map(state => <option key={state.id} value={state.id}>{state.nombre}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal('tarea', task)} className="text-slate-600 hover:bg-slate-200 p-2 border border-transparent hover:border-slate-300 transition-colors rounded" title="Modificar Registro"><Edit size={16} /></button>
                            <button onClick={() => handleDelete('tarea', task.id)} className="text-red-600 hover:bg-red-100 p-2 border border-transparent hover:border-red-200 transition-colors rounded" title="Eliminar Registro"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* PAGINACIÓN */}
              {!loading && processedTasks.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registros del {(currentPage-1)*itemsPerPage + 1} al {Math.min(currentPage*itemsPerPage, processedTasks.length)} de {processedTasks.length} totales</span>
                  <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-slate-300 bg-white disabled:opacity-50 hover:bg-slate-100 shadow-sm transition-colors"><ChevronLeft size={16} /></button>
                    <button disabled={currentPage >= Math.ceil(processedTasks.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-slate-300 bg-white disabled:opacity-50 hover:bg-slate-100 shadow-sm transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PESTAÑA: USUARIOS Y ESTADOS (Admin Only) */}
        {/* ========================================== */}
        {((activeTab === 'usuarios' || activeTab === 'estados') && isAdmin) && (
          <div className="animate-in fade-in bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold uppercase text-slate-800 tracking-wide">Directorio Oficial: {activeTab === 'usuarios' ? 'Personal' : 'Estados'}</h2>
              <button onClick={() => openModal(activeTab === 'usuarios' ? 'usuario' : 'estado')} className="bg-slate-800 text-white px-5 py-2.5 text-sm font-bold uppercase hover:bg-slate-900 flex items-center gap-2 shadow-md transition-colors"><Plus size={16} /> Registrar Nuevo</button>
            </div>
            
            <table className="w-full text-left text-sm border-t border-slate-200">
              <thead className="bg-slate-50 uppercase text-xs text-slate-600 border-b border-slate-200">
                <tr><th className="p-4">ID Ref.</th><th className="p-4">Datos de Identificación</th><th className="p-4 text-right">Acciones de Sistema</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'usuarios' ? users : taskStates).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500 text-xs">#{item.id}</td>
                    <td className="p-4 font-bold text-slate-800">{item.nombre} <span className="font-normal text-slate-500 ml-2 hidden sm:inline">{item.email ? `(${item.email})` : ''}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(activeTab === 'usuarios' ? 'usuario' : 'estado', item)} className="text-slate-600 p-2 hover:bg-slate-200 mr-2 rounded transition-colors"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(activeTab === 'usuarios' ? 'usuario' : 'estado', item.id)} className="text-red-600 p-2 hover:bg-red-100 rounded transition-colors"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL MULTIUSO (CREAR / EDITAR) */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white border-t-4 border-slate-800 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <FileText className="text-slate-700" size={24} />
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-800">{modalConfig.title}</h2>
            </div>
            
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
              
              {/* FORMULARIO: TAREAS */}
              {modalConfig.type === 'tarea' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asunto Oficial *</label>
                    <input required className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detalle del Expediente</label>
                    <textarea rows="4" className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm resize-none shadow-sm" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado Asignado</label>
                    <select className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm bg-white shadow-sm font-semibold" value={formData.idEstado} onChange={e => setFormData({...formData, idEstado: parseInt(e.target.value)})}>
                      {taskStates.map(state => <option key={state.id} value={state.id}>{state.nombre}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* FORMULARIO: USUARIO */}
              {modalConfig.type === 'usuario' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Personal *</label>
                    <input required className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico Institucional *</label>
                    <input required type="email" className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </>
              )}

              {/* FORMULARIO: ESTADO */}
              {modalConfig.type === 'estado' && (
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Denominación del Estado *</label>
                    <input required placeholder="Ej: En Revisión Técnica" className="w-full p-2.5 border border-slate-300 outline-none focus:border-slate-800 text-sm shadow-sm" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                </div>
              )}

              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 border border-slate-300 font-bold uppercase text-slate-600 hover:bg-slate-100 text-xs tracking-wider transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 p-3 bg-slate-800 font-bold uppercase text-white hover:bg-slate-900 text-xs tracking-wider shadow-md transition-colors">Confirmar Operación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;