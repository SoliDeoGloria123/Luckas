import React, { useEffect, useState } from 'react';
import SolicitudModal from '../../Dashboard/Modales/SolicitudModal';
import { solicitudService } from '../../../services/solicirudService';
import { categorizacionService } from '../../../services/categorizacionService';
import { eventService } from "../../../services/eventService";
import { cabanaService } from "../../../services/cabanaService";
import { reservaService } from "../../../services/reservaService";
import { programasAcademicosService } from "../../../services/programasAcademicosService";
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"

// Helpers para filtros
const pasaFiltroPorCategoria = (solicitud, filterCategoria) => {
  if (!filterCategoria || filterCategoria === 'todos') return true;
  
  const cat = solicitud.categoria?._id || solicitud.categoria?.nombre || solicitud.categoria;
  if (!cat) return false;
  
  return String(cat) === String(filterCategoria) || 
         String((solicitud.categoria?.nombre || '')).toLowerCase() === String(filterCategoria).toLowerCase();
};

const pasaFiltroPorEstado = (solicitud, filterEstado) => {
  if (!filterEstado || filterEstado === 'todos') return true;
  return (solicitud.estado || '').toLowerCase() === String(filterEstado).toLowerCase();
};

const pasaFiltroPorBusqueda = (solicitud, searchTerm) => {
  if (!searchTerm) return true;
  
  const q = searchTerm.trim().toLowerCase();
  if (!q) return true;
  
  const nombreSolic = (
    solicitud.solicitante?.nombre
      ? `${solicitud.solicitante.nombre} ${solicitud.solicitante.apellido || ''}`
      : solicitud.solicitante?.username || solicitud.solicitante?.correo || ''
  ).toLowerCase();

  const campos = [
    nombreSolic,
    (solicitud.tipoSolicitud || '').toLowerCase(),
    (solicitud.descripcion || '').toLowerCase(),
    (solicitud.modeloReferencia || '').toLowerCase(),
    (solicitud.categoria?.nombre || '').toLowerCase(),
    (solicitud.solicitante?.numeroDocumento || '').toLowerCase()
  ];

  return campos.some(campo => campo.includes(q));
};

const Gestionsolicitud = () => {

  const [solicitudes, setSolicitudes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [programasAcademicos, setProgramasAcademicos] = useState([]);

  // Filtros y buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    usuarioId: '',
    tipo: '',
    descripcion: '',
    estado: 'pendiente',
    fechaSolicitud: new Date().toISOString().split('T')[0],
    fechaRespuesta: '',
    respuesta: '',
    prioridad: 'Media'
  });
  const [estadisticas, setEstadisticas] = useState({ totalSolicitudes: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 });


  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
      obtenerEstadiscas();
    } catch (error) {
      mostrarAlerta("Error", `Error al obtener solicitudes: ${error.message}`, 'error');
    }
  };
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  // Obtener categorías para el modal
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      let lista = [];
      if (res) {
        if (Array.isArray(res)) lista = res;
        else if (res.data && Array.isArray(res.data)) lista = res.data;
        else if (res.data) lista = res.data;
      }
      setCategorias(lista || []);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // Obtener eventos
  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      console.log('Eventos obtenidos:', data);
      let listaEventos = [];
      if (!data) listaEventos = [];
      else if (Array.isArray(data)) listaEventos = data;
      else if (data.data && Array.isArray(data.data)) listaEventos = data.data;
      setEventos(listaEventos);
    } catch (error) {
      console.error('Error obteniendo eventos:', error);
      setEventos([]);
    }
  };

  // Obtener cabañas
  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      console.log('Cabañas obtenidas:', data);
      let listaCabanas = [];
      if (!data) listaCabanas = [];
      else if (Array.isArray(data)) listaCabanas = data;
      else if (data.data && Array.isArray(data.data)) listaCabanas = data.data;
      setCabanas(listaCabanas);
    } catch (error) {
      console.error('Error obteniendo cabañas:', error);
      setCabanas([]);
    }
  };

  // Obtener reservas
  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      let listaReservas = [];
      if (!data) listaReservas = [];
      else if (Array.isArray(data)) listaReservas = data;
      else if (data.data && Array.isArray(data.data)) listaReservas = data.data;
      setReservas(listaReservas);
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      setReservas([]);
    }
  };

  // Obtener programas académicos
  const obtenerProgramasAcademicos = async () => {
    try {
      // El servicio expone `getAllProgramas`.
      const data = await programasAcademicosService.getAllProgramas();
      let listaProgramas = [];
      if (!data) listaProgramas = [];
      else if (Array.isArray(data)) listaProgramas = data;
      else if (data.data && Array.isArray(data.data)) listaProgramas = data.data;
      setProgramasAcademicos(listaProgramas);
    } catch (error) {
      console.error('Error obteniendo programas académicos:', error);
      setProgramasAcademicos([]);
    }
  };

  // Obtener referencias según el modelo
  const obtenerReferencias = async (modelo) => {
    switch (modelo) {
      case 'Eventos':
        await obtenerEventos();
        break;
      case 'Cabana':
        await obtenerCabanas();
        break;
      case 'Reserva':
        await obtenerReservas();
        break;
      case 'ProgramaAcademico':
        await obtenerProgramasAcademicos();
        break;
      default:
        break;
    }
  };


  const handleCreate = () => {
    setModoEdicion(false);
    setSolicitudSeleccionada(null);
    setNuevaSolicitud({
      usuarioId: '',
      tipo: '',
      descripcion: '',
      estado: 'pendiente',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      fechaRespuesta: '',
      respuesta: '',
      prioridad: 'Media'
    });
    setMostrarModal(true);
  };

  const handleEdit = (solicitud) => {
    setModoEdicion(true);
    setSolicitudSeleccionada(solicitud);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearSolicitud = async () => {
    try {
      await solicitudService.create(nuevaSolicitud);
      mostrarAlerta("¡EXITO!", "Solicitud creada exitosamente");
      setMostrarModal(false);
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };

  const actualizarSolicitud = async () => {
    try {
      await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      mostrarAlerta("¡EXITO!", "Solicitud actualizada exitosamente");
      setMostrarModal(false);
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };
  const obtenerEstadiscas = async () => {
    try {
      const stats = await solicitudService.getEstadisticasGenerales();
      setEstadisticas(stats?.data || stats);
    }
    catch (error) {
      console.error(`Error al obtener estadísticas: `, error);
    }
  };

  // Filtros aplicados sobre solicitudes
  const solicitudesFiltradas = (solicitudes || []).filter((soli) => {
    return pasaFiltroPorCategoria(soli, filterCategoria) &&
           pasaFiltroPorEstado(soli, filterEstado) &&
           pasaFiltroPorBusqueda(soli, searchTerm);
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(solicitudesFiltradas.length / registrosPorPagina) || 1;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambian los resultados filtrados
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filterCategoria, filterEstado, solicitudes.length]);

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
              <h1>Gestión de Solicitudes</h1>
              <p>dministra y procesa todas las solicitudes del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Solicitud
          </button>
        </div>

        <div className="stats-grid-solicitudes">
          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.totalSolicitudes}</div>
              <div className="stat-label-solicitudes">Total Solicitudes</div>
            </div>
            <div className="stat-icon-solicitudes purple">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.pendientes}</div>
              <div className="stat-label-solicitudes">Pendientes</div>
            </div>
            <div className="stat-icon-solicitudes orange">
              <i className="fas fa-clock"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.aprobadas}</div>
              <div className="stat-label-solicitudes">Aprobadas</div>
            </div>
            <div className="stat-icon-solicitudes green">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.altaPrioridad}</div>
              <div className="stat-label-solicitudes">Alta Prioridad</div>
            </div>
            <div className="stat-icon-solicitudes red">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar Solicitudes..."
                id="userSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              {(categorias || []).map((c) => (
                <option key={c._id || c.nombre} value={c._id || c.nombre}>
                  {c.nombre || c._id}
                </option>
              ))}
            </select>
            <select
              id="statusFilter"
              className="filter-select"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="Nueva">Nueva</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
              <option value="Completada">Completada</option>
              <option value="Pendiente Info">Pendiente Info</option>
            </select>
          </div>
         
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr>


                    <th>Nombre Solicitante</th>
                    <th>Cédula</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Tipo Solicitud</th>
                    <th>Categoría</th>
                    <th>Origen</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Fecha de Solicitud</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {(solicitudesPaginadas || []).map((soli) => (
                    <tr key={soli._id}>
                      <td >
                        {soli.solicitante?.nombre && soli.solicitante?.apellido
                          ? `${soli.solicitante.nombre} ${soli.solicitante.apellido}`
                          : soli.solicitante?.username || soli.solicitante?.nombre || soli.solicitante?.correo || "N/A"}
                      </td>
                      <td >
                        {soli.solicitante?.numeroDocumento || "N/A"}
                      </td>
                      <td>{soli.solicitante?.correo || "N/A"}</td>
                      <td>{soli.solicitante?.telefono || "N/A"}</td>
                      <td>
                        {(() => {
                          const roleVal = soli.solicitante?.role || 'N/A';
                          const baseClass = `role-badge-tesorero role-tesorero-${roleVal}`;
                          const externoStyle = roleVal === 'externo' ? { backgroundColor: '#e6f7ff', color: '#0f4fc1' } : {};
                          return (
                            <span className={baseClass} style={externoStyle}>
                              {roleVal}
                            </span>
                          );
                        })()}
                      </td>
                      <td>{soli.tipoSolicitud || "N/A"}</td>
                      <td>{soli.categoria?.nombre || soli.categoria?._id || "N/A"}</td>
                      <td>{soli.modeloReferencia || "N/A"}</td>
                      <td>
                        <span className={`badge-tesorero badge-tesorero-${soli.estado}`}>

                          {soli.estado || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-tesorero priority-tesorero-${soli.prioridad}`}>
                          {soli.prioridad || "N/A"}
                        </span>

                      </td>
                      <td>{new Date(soli.fechaSolicitud).toLocaleDateString()}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {soli.responsable?.nombre && soli.responsable?.apellido
                              ? `${soli.responsable.nombre} ${soli.responsable.apellido}`
                              : soli.responsable?.username || soli.responsable?.nombre || "N/A"}
                          </span>
                          {soli.responsable?.role && (
                            <span className={`text-xs role-badge-tesorero role-tesorero-${soli.responsable.role} mt-1`}>
                              {soli.responsable.role}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(soli)}>
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
          <SolicitudModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            solicitudSeleccionada={solicitudSeleccionada}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
            nuevaSolicitud={nuevaSolicitud}
            setNuevaSolicitud={setNuevaSolicitud}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarSolicitud : crearSolicitud}
            categorias={categorias}
            eventos={eventos}
            cabanas={cabanas}
            reservas={reservas}
            programasAcademicos={programasAcademicos}
            obtenerReferencias={obtenerReferencias}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestionsolicitud;