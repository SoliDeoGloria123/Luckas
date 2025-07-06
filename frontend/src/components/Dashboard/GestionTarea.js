import React, { useState, useEffect } from "react";
import { tareaService } from "../../services/tareaService";
import { userService } from "../../services/userService";
import TablaTareas from "./Tablas/TareaTabla";
import TareaModal from "./Modales/TareaModal";

const GestionTarea = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "media",
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
      const data = await tareaService.getAll();
      setTareas(Array.isArray(data) ? data : []);
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
    try {
      await tareaService.create(nuevaTarea);
      setMostrarModal(false);
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
      obtenerTareas();
    } catch (err) {
      setError("Error al crear la tarea: " + err.message);
    }
  };

  const actualizarTarea = async () => {
    try {
      await tareaService.update(tareaSeleccionada._id, tareaSeleccionada);
      setMostrarModal(false);
      setTareaSeleccionada(null);
      setModoEdicion(false);
      obtenerTareas();
    } catch (err) {
      setError("Error al actualizar tarea: " + err.message);
    }
  };

  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;
    try {
      await tareaService.delete(id);
      obtenerTareas();
    } catch (err) {
      setError("Error al eliminar tarea: " + err.message);
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

  // Search filter
  const tareasFiltradas = tareas.filter(t => {
    const texto = `${t.titulo} ${t.descripcion} ${t.estado} ${t.prioridad}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="seccion-usuarios">
      <div className="seccion-header">
        <h2>Gestión de Tareas</h2>
        {canCreate && !readOnly && (
          <button className="btn-primary" onClick={abrirModalCrear}>
            ➕ Nueva Tarea
          </button>
        )}
      </div>
      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔍 Buscar Tarea..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <TablaTareas
        tareas={tareasFiltradas}
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
    </div>
  );
};

export default GestionTarea;
