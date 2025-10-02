import { useState, useEffect } from "react"
import { Search, Plus, X, Calendar, User, AlertCircle, CheckCircle, Clock, Edit2, Trash2 } from "lucide-react"
import Header from "../../Seminarista/Shared/Header";
import Footer from "../../footer/Footer";
import { tareaService } from '../../../services/tareaService';
import { userService } from '../../../services/userService';

const TareasManagement = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterPrioridad, setFilterPrioridad] = useState("todas")
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [tareas, setTareas] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "Media",
    asignadoA: "",
    asignadoARol: "seminarista",
    fechaLimite: "",
  })

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError("Error al obtener usuarios: " + err.message);
    }
  };

  const obtenerTareas = async () => {
    try {
      const response = await tareaService.getAll();
      setTareas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Error al obtener tareas: " + err.message);
    }
  };

  // Fetch tasks and users
  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const estadoColors = {
    en_progreso: "bg-blue-100 text-blue-700 border-blue-200",
    pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
    completada: "bg-green-100 text-green-700 border-green-200",
    cancelada: "bg-red-100 text-red-700 border-red-200",
  }

  const prioridadColors = {
    Alta: "bg-red-100 text-red-700 border-red-200",
    Media: "bg-orange-100 text-orange-700 border-orange-200",
    Baja: "bg-gray-100 text-gray-700 border-gray-200",
  }

  const traducirEstado = (estado) => {
    const traducciones = {
      pendiente: "Pendiente",
      en_progreso: "En Progreso",
      completada: "Completada",
      cancelada: "Cancelada"
    };
    return traducciones[estado] || estado;
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setFormData({
      titulo: "",
      descripcion: "",
      estado: "pendiente",
      prioridad: "Media",
      asignadoA: "",
      asignadoARol: "seminarista",
      fechaLimite: "",
    })
    setShowModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      titulo: task.titulo,
      descripcion: task.descripcion,
      estado: task.estado,
      prioridad: task.prioridad,
      asignadoA: task.asignadoA,
      asignadoARol: task.asignadoARol,
      fechaLimite: task.fechaLimite,
    })
    setShowModal(true)
  }

  const handleSaveTask = async () => {
    if (!formData.titulo || !formData.asignadoA || !formData.fechaLimite) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    try {
      // Obtener el usuario actual del token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      // Preparar los datos de la tarea
      const tareaData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        estado: formData.estado,
        prioridad: formData.prioridad,
        asignadoA: formData.asignadoA,
        asignadoPor: JSON.parse(atob(token.split('.')[1])).userId, // Obtener userId del token
        fechaLimite: formData.fechaLimite
      };

      console.log('Datos a enviar:', tareaData);

      if (editingTask) {
        // Actualizar tarea existente
        await tareaService.update(editingTask._id, tareaData);
        alert('Tarea actualizada exitosamente');
      } else {
        // Crear nueva tarea
        await tareaService.create(tareaData);
        alert('Tarea creada exitosamente');
      }

      // Recargar las tareas
      await obtenerTareas();
      
      setShowModal(false);
      setEditingTask(null);
      
      // Resetear el formulario
      setFormData({
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        prioridad: "Media",
        asignadoA: "",
        asignadoARol: "seminarista",
        fechaLimite: "",
      });

    } catch (error) {
      console.error('Error al guardar tarea:', error);
      alert('Error al guardar la tarea: ' + error.message);
    }
  }


  /*const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "todos" || task.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "todas" || task.prioridad === filterPrioridad
    return matchesSearch && matchesEstado && matchesPrioridad
  })*/

  const stats = {
    total: tareas.length,
    enProgreso: tareas.filter((t) => t.estado === "en_progreso").length,
    pendientes: tareas.filter((t) => t.estado === "pendiente").length,
    completadas: tareas.filter((t) => t.estado === "completada").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h2>
              <p className="text-gray-600 mt-1">Asignar y supervisar tareas del sistema</p>
            </div>
            <button
              onClick={handleNewTask}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus size={20} />
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tareas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendientes}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">En Progreso</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.enProgreso}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completadas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>

            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas las Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Tasks Table - Responsive */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Asignado A
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                    Fecha Límite
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tareas.map((tarea) => (
                  <tr key={tarea.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{tarea.titulo}</div>
                      <div className="text-xs text-gray-500 lg:hidden mt-1">{tarea.descripcion}</div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{tarea.descripcion}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${estadoColors[tarea.estado]}`}
                      >
                        {traducirEstado(tarea.estado)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${prioridadColors[tarea.prioridad]}`}
                      >
                        {tarea.prioridad}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{tarea.asignadoA?.nombre}</div>
                          <div className="text-xs text-gray-500">{tarea.asignadoA?.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTask(tarea)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tareas.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No se encontraron tareas</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Create/Edit Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingTask ? "Editar Tarea" : "Nueva Tarea"}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa el título de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe la tarea en detalle"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asignar a <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.asignadoA}
                  onChange={(e) => setFormData({ ...formData, asignadoA: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un seminarista</option>
                  {usuarios
                    .filter(usuario => usuario.role === 'seminarista')
                    .map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha Límite <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fechaLimite}
                  onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTask}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                {editingTask ? "Guardar Cambios" : "Crear Tarea"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )

};

export default TareasManagement;
