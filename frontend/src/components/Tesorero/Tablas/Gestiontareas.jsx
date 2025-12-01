import React, { useState, useEffect } from 'react';
import { tareaService } from "../../../services/tareaService";
import { userService } from "../../../services/userService";
import TareaModal from '../../Dashboard/Modales/TareaModal';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"


const Gestiontarea = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tareasFiltradas, setTareasFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('todas');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'Media',
    estado: 'pendiente',
    fechaVencimiento: '',
    asignadoA: '',
    asignadoPor: '',
    comentarios: []
  });
  const [estadisticas, setEstadisticas] = useState({ total: 0, pendientes: 0, enProgreso: 0, completadas: 0, canceladas: 0 });


  // Obtener tareas y usuarios
  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      const lista = Array.isArray(data.data) ? data.data : [];
      setTareas(lista);
      setTareasFiltradas(lista);
    } catch (err) {
      console.log("Error al obtener tareas: " + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
      obenerEstasdisticas();
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };
  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const obenerEstasdisticas = async () => {
    try {
      const data = await tareaService.estadisticasGenerales();
      setEstadisticas(data);
    } catch (err) {
      console.error("Error al obtener estadísticas: " + err.message);
    }
  };

  const extractText = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      return (val.nombre || val.username || val.role || JSON.stringify(val));
    }
    return String(val);
  };

  const applyFilters = (search = searchTerm, prioridad = filterPriority, estado = filterEstado, lista = tareas) => {
    const s = (search || '').toString().trim().toLowerCase();
    const arr = Array.isArray(lista) ? lista : [];
    const salida = arr.filter((t) => {
      if (prioridad && prioridad !== 'todas') {
        if (String((t.prioridad || '')).toLowerCase() !== String(prioridad).toLowerCase()) return false;
      }
      if (estado && estado !== 'todos') {
        if (String((t.estado || '')).toLowerCase() !== String(estado).toLowerCase()) return false;
      }

      if (!s) return true;

      const titulo = extractText(t.titulo).toLowerCase();
      const descripcion = extractText(t.descripcion).toLowerCase();
      const asignadoA = extractText(t.asignadoA?.nombre || t.asignadoA).toLowerCase();
      const asignadoPor = extractText(t.asignadoPor?.nombre || t.asignadoPor).toLowerCase();

      return (
        titulo.includes(s) ||
        descripcion.includes(s) ||
        asignadoA.includes(s) ||
        asignadoPor.includes(s) ||
        String(t.prioridad || '').toLowerCase().includes(s) ||
        String(t.estado || '').toLowerCase().includes(s)
      );
    });

    setTareasFiltradas(salida);
  };

  const handleCreate = () => {
    setModoEdicion(false);
    setTareaSeleccionada(null);
    setNuevaTarea({
      titulo: '',
      descripcion: '',
      prioridad: 'Media',
      estado: 'pendiente',
      fechaVencimiento: '',
      asignadoA: '',
      asignadoPor: '',
      comentarios: []
    });
    setMostrarModal(true);
  };

  const handleEdit = (item) => {
    // Normalizar valores para el modal
    // Normalizamos fechaLimite a yyyy-mm-dd si viene en formato ISO con hora
    let fechaNorm = '';
    if (item && item.fechaLimite) {
      if (typeof item.fechaLimite === 'string' && item.fechaLimite.includes('T')) {
        fechaNorm = item.fechaLimite.split('T')[0];
      } else {
        fechaNorm = item.fechaLimite;
      }
    }

    const normalizado = {
      ...item,
      prioridad: item.prioridad && ['Alta', 'Media', 'Baja'].includes(item.prioridad) ? item.prioridad : 'Media',
      estado: item.estado && ['pendiente', 'en_progreso', 'completada', 'cancelada'].includes(item.estado) ? item.estado : 'pendiente',
      comentarios: Array.isArray(item.comentarios) ? item.comentarios : [],
      asignadoA: item.asignadoA?._id || item.asignadoA || '',
      asignadoPor: item.asignadoPor?._id || item.asignadoPor || '',
      fechaLimite: fechaNorm || ''
    };
    // Mostrar la fecha normalizada en la consola para depuración
    console.debug('fechaLimite (solo fecha):', fechaNorm || '');
    setModoEdicion(true);
    setTareaSeleccionada(normalizado);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearTarea = async (payload) => {
    // Soporta recibir event (desde submit) o payload (objeto enviado por modal)
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaTarea;
      await tareaService.create(body);
      mostrarAlerta("¡Éxito!", "Tarea creada exitosamente");
      setMostrarModal(false);
      obtenerTareas();
    } catch (error) {
      mostrarAlerta("Error", "Error al procesar la tarea: " + error.message, 'error');
    }
  };

  const actualizarTarea = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : tareaSeleccionada;
      const id = (body && body._id) ? body._id : (tareaSeleccionada && tareaSeleccionada._id);
      if (!id) {
        mostrarAlerta('Error', 'No se encontró el ID de la tarea a actualizar');
        return;
      }
      await tareaService.update(id, body);
      mostrarAlerta("¡Éxito!", "Tarea actualizada exitosamente");
      setMostrarModal(false);
      obtenerTareas();
    } catch (error) {
      mostrarAlerta("Error", "Error al procesar la tarea: " + error.message, 'error');
    }
  };

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil((tareasFiltradas.length || 0) / registrosPorPagina) || 1;
  const tareasPaginadas = (tareasFiltradas || []).slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios o la lista filtrada
  useEffect(() => {
    setPaginaActual(1);
  }, [tareasFiltradas, searchTerm, filterPriority, filterEstado]);

  // Aplicar filtros cuando cambie la lista original o filtros
  useEffect(() => {
    applyFilters(searchTerm, filterPriority, filterEstado, tareas);
  }, [tareas, searchTerm, filterPriority, filterEstado]);


  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Tareas</h1>
              <p>Asignar y supervisar tareas del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus" />Nueva Tarea
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-tasks" />
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">{estadisticas.total}</div>
              <div className="stat-label-usuarios">Total Tareas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">{estadisticas.pendientes}</div>
              <div className="stat-label-usuarios">Pendientes</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue     ">
              <i className="fas fa-spinner"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">{estadisticas.enProgreso}</div>
              <div className="stat-label-usuarios">En Progreso</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">{estadisticas.completadas}</div>
              <div className="stat-label-usuarios">Completadas</div>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar tareas..."
                id="userSearch"
                value={searchTerm}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchTerm(v);
                  applyFilters(v, filterPriority, filterEstado, tareas);
                }}
              />
            </div>
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => {
                const v = e.target.value;
                setFilterPriority(v);
                applyFilters(searchTerm, v, filterEstado, tareas);
              }}
            >
              <option value="todas">Todas las Prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <select
              id="statusFilter"
              className="filter-select"
              value={filterEstado}
              onChange={(e) => {
                const v = e.target.value;
                setFilterEstado(v);
                applyFilters(searchTerm, filterPriority, v, tareas);
              }}
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]" >
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >TITULO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >DESCRIPCION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ESTADO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >PRIORIDAD</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO A </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO A ROL</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO POR</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGANADO POR ROL </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >FECHA LIMITE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >FECHA CREACION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ACCIONES</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {tareasPaginadas.map((tarea) => (
                    <tr key={tarea._id}>
                      <td>{tarea.titulo}</td>
                      <td>{tarea.descripcion}</td>
                      <td>
                        <span className={`badge-tesorero badge-tesorero-${tarea.estado} `}>
                          {tarea.estado}
                        </span>
                      </td>
                      <td>{tarea.prioridad}</td>
                      <td>{tarea.asignadoA?.nombre || "N/A"}</td>
                      <td>{tarea.asignadoA?.role || "N/A"}</td>
                      <td>{tarea.asignadoPor?.nombre || "N/A"}</td>
                      <td>{tarea.asignadoPor?.role || "N/A"}</td>
                      <td>{tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}</td>
                      <td>
                        {tarea.updatedAt ? new Date(tarea.updatedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(tarea)}>
                          <Edit className="h-4 w-4" />
                        </button>

                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>


        {mostrarModal && (
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
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestiontarea;