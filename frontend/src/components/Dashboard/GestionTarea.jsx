import React, { useState, useEffect } from "react";
import { tareaService } from "../../services/tareaService";
import { userService } from "../../services/userService";
import TablaTareas from "./Tablas/TareaTabla";
import TareaModal from "./Modales/TareaModal";
import StatsCard from "./Shared/StatsCard";
import SearchAndFilters from "./Shared/SearchAndFilters";
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
  const [error, setError] = useState("");

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
      setError("Error al obtener tareas: " + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError("Error al obtener usuarios: " + err.message);
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
      setError("Error al cambiar estado: " + err.message);
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
    prevPage
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
        <div className="seccion-usuarios">
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
          <SearchAndFilters 
            searchPlaceholder="Buscar Tareas..."
            searchValue={busqueda}
            onSearchChange={(e) => setBusqueda(e.target.value)}
            filters={[
              {
                value: filtroEstado,
                onChange: (e) => setFiltroEstado(e.target.value),
                options: [
                  { value: 'todos', label: 'Todos los Estados' },
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'en_progreso', label: 'En Progreso' },
                  { value: 'completada', label: 'Completada' },
                  { value: 'cancelada', label: 'Cancelada' }
                ]
              },
              {
                value: filtroPrioridad,
                onChange: (e) => setFiltroPrioridad(e.target.value),
                options: [
                  { value: 'todas', label: 'Todas las Prioridades' },
                  { value: 'baja', label: 'Baja' },
                  { value: 'media', label: 'Media' },
                  { value: 'alta', label: 'Alta' },
                  { value: 'urgente', label: 'Urgente' }
                ]
              }
            ]}
          />
          {error && <div className="error-message">{error}</div>}
          <TablaTareas
            tareas={tareasPaginadas}
            onEditar={canEdit && !readOnly ? abrirModalEditar : null}
            onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarTarea : null}
            onCambiarEstado={canEdit && !readOnly ? cambiarEstadoTarea : null}
          />
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={prevPage}
            onNext={nextPage}
          />
        </div>
      </div>
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
