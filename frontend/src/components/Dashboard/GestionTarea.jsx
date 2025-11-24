import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import { tareaService } from "../../services/tareaService";
import { userService } from "../../services/userService";
import TablaTareas from "./Tablas/TareaTabla";
import TareaModal from "./Modales/TareaModal";
import StatsCard from "./Shared/StatsCard";
import Pagination from "./Shared/Pagination";
import { usePagination } from "./hooks/usePagination";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import PropTypes from 'prop-types';

const GestionTarea = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "Media",
    asignadoA: "",
    asignadoPor: "",
    fechaLimite: "",
    comentarios: []
  });


  // Fetch tasks and users
  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const obtenerTareas = async () => {
    try {
      const response = await tareaService.getAll();
      setTareas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      mostrarAlerta('Error', 'Error al obtener tareas: ' + (err?.message || err));
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      mostrarAlerta('Error', 'Error al obtener usuarios: ' + (err?.message || err));
    }
  };

  // CRUD operations
  const crearTarea = async () => {
    if (!nuevaTarea.descripcion || nuevaTarea.descripcion.trim() === "") {
      mostrarAlerta("Error", "La descripción es obligatoria");
      return;
    }
    try {
      await tareaService.create({ ...nuevaTarea, prioridad: "Media" });
      mostrarAlerta("¡Éxito!", "Tarea creada exitosamente");
      setMostrarModal(false);
      setNuevaTarea({
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        prioridad: "Media",
        asignadoA: "",
        asignadoPor: "",
        fechaLimite: "",
        comentarios: []
      });
      obtenerTareas();
    } catch (err) {
      mostrarAlerta("Error", "Error al crear la tarea: " + err.message);
    }
  };

  const actualizarTarea = async () => {
    try {
      await tareaService.update(tareaSeleccionada._id, tareaSeleccionada);
      mostrarAlerta("¡Éxito!", "Tarea actualizada exitosamente");
      setMostrarModal(false);
      setTareaSeleccionada(null);
      setModoEdicion(false);
      obtenerTareas();
    } catch (err) {
      mostrarAlerta("Error", "Error al actualizar tarea: " + err.message);
    }
  };

  const eliminarTarea = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await tareaService.delete(id);
      mostrarAlerta("¡Éxito!", "Tarea eliminada exitosamente");
      obtenerTareas();
    } catch (err) {
      mostrarAlerta("Error", "Error al eliminar tarea: " + err.message);
    }
  };

  const cambiarEstadoTarea = async (id, nuevoEstado) => {
    try {
      await tareaService.cambiarEstado(id, nuevoEstado);
      obtenerTareas();
    } catch (err) {
      mostrarAlerta('Error', 'Error al cambiar estado: ' + (err?.message || err));
    }
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaTarea({
      titulo: "",
      descripcion: "",
      estado: "pendiente",
      prioridad: "media",
      asignadoA: "",
      asignadoPor: "",
      fechaLimite: "",
      comentarios: []
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (tarea) => {
    setModoEdicion(true);
    setTareaSeleccionada({
      ...tarea,
      fechaLimite: tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString().split('T')[0] : ""
    });
    setMostrarModal(true);
  };

  // Search and filter
  const tareasFiltradas = tareas.filter(t => {
    const matchesSearch = !busqueda ||
      `${t.titulo} ${t.descripcion} ${t.estado} ${t.prioridad}`.toLowerCase().includes(busqueda.toLowerCase());

    const matchesEstado = filtroEstado === 'todos' || t.estado === filtroEstado;
    const matchesPrioridad = filtroPrioridad === 'todas' || t.prioridad?.toLowerCase() === filtroPrioridad;

    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  // Usar hook de paginación
  const {
    currentPage,
    totalPages,
    paginatedData: tareasPaginadas,
    nextPage,
    prevPage,
    resetToFirstPage
  } = usePagination(tareasFiltradas, 10);

  // Calcular estadísticas dinámicas
  const statsData = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    enProgreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length
  };

  const statsCards = [
    { icon: 'fa-tasks', value: statsData.total, label: 'Total Tareas', type: 'users' },
    { icon: 'fa-clock', value: statsData.pendientes, label: 'Pendientes', type: 'new' },
    { icon: 'fa-spinner', value: statsData.enProgreso, label: 'En Progreso', type: 'active' },
    { icon: 'fa-check-circle', value: statsData.completadas, label: 'Completadas', type: 'admins' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Sidebar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        <Header
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          seccionActiva={seccionActiva}
        />
        <div className="space-y-7 fade-in-up p-9">
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1>Gestión de Tareas</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            {canCreate && !readOnly && (
              <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                + Nueva Tarea
              </button>
            )}
          </div>
          <div className="dashboard-grid-reporte-admin">
            {statsCards.map((card, index) => (
              <StatsCard
                key={`task-stat-${card.label}-${index}`}
                icon={card.icon}
                value={card.value}
                label={card.label}
                type={card.type}
              />
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); resetToFirstPage(); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroPrioridad}
                  onChange={(e) => { setFiltroPrioridad(e.target.value); resetToFirstPage(); }}
                >
                  <option value="todas">Todas las Prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); resetToFirstPage(); }}
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
            <TablaTareas
              tareas={tareasPaginadas}
              onEditar={canEdit && !readOnly ? abrirModalEditar : null}
              onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarTarea : null}
              onCambiarEstado={canEdit && !readOnly ? cambiarEstadoTarea : null}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={prevPage}
            onNext={nextPage}
          />
        </div>
      </div>
      <TareaModal
        mostrar={mostrarModal}
        modoEdicion={modoEdicion}
        tareaSeleccionada={tareaSeleccionada}
        setTareaSeleccionada={setTareaSeleccionada}
        nuevaTarea={nuevaTarea}
        setNuevaTarea={setNuevaTarea}
        onClose={() => setMostrarModal(false)}
        onSubmit={modoEdicion ? actualizarTarea : crearTarea}
        usuarios={usuarios}
      />
    </div>
  );
};

export default GestionTarea;

// Validación de props con PropTypes

GestionTarea.propTypes = {
  readOnly: PropTypes.bool,
  modoTesorero: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
