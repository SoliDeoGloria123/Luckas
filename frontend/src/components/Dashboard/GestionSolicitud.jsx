import { useState, useEffect } from "react";
import { solicitudService } from "../../services/solicirudService";
import { categorizacionService } from "../../services/categorizacionService";
import { eventService } from "../../services/eventService";
import { cabanaService } from "../../services/cabanaService";
import { reservaService } from "../../services/reservaService";
import { programasAcademicosService } from "../../services/programasAcademicosService";
import TablaUnificadaSolicitudes from "./Tablas/SolicitudTabla";
import SolicitudModal from "./Modales/SolicitudModal";
import useBusqueda from "./Busqueda/useBusqueda";
import { Search } from 'lucide-react';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import PropTypes from 'prop-types';


const GestionSolicitud = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [modoEdicionSolicitud, setModoEdicionSolicitud] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const {
    busqueda: busquedaSolicitudes,
    setBusqueda: setBusquedaSolicitudes,
    datosFiltrados: solicitudesFiltradas
  } = useBusqueda(
    solicitudes,
    [
      "solicitante.nombre",
      "solicitante.apellido",
      "solicitante.numeroDocumento", // Agregar búsqueda por cédula
      "correo",
      "tipoSolicitud",
      "categoria.nombre",
      "categoria"
    ]
  );
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    solicitante: "",
    titulo: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "",
    categoria: "",
    descripcion: "",
    estado: "Nueva",
    prioridad: "Media",
    responsable: "",
    observaciones: ""
  });
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [estadisticas, setEstadisticas] = useState({ totalSolicitudes: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 });
  
  // Estados para referencias dinámicas
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [programasAcademicos, setProgramasAcademicos] = useState([]);


  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
      obtenerEstadiscas();
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      mostrarAlerta("Error", "Error al obtener solicitudes");
    }
  };

  // Obtener categorías de la base de datos
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
      console.error(" ERROR obteniendo categorías:", error);
      setCategorias([]);
    }
  };

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

  useEffect(() => {
    obtenerSolicitudes();
    obtenerCategorias();
  }, []);

  // Crear solicitud
  const crearSolicitud = async () => {
    try {
      await solicitudService.create(nuevaSolicitud);
      mostrarAlerta("¡Éxito!", "Solicitud creada exitosamente");
      setMostrarModal(false);
      setNuevaSolicitud({
        solicitante: "",
        titulo: "",
        correo: "",
        telefono: "",
        tipoSolicitud: "",
        categoria: "",
        descripcion: "",
        estado: "Nueva",
        prioridad: "Media",
        responsable: "",
        observaciones: ""
      });
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear la solicitud: ${error.message}`);
    }
  };

  // Actualizar solicitud
  const actualizarSolicitud = async () => {
    try {
      const resultado = await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      if (resultado.success) {
        mostrarAlerta("¡Éxito!", "Solicitud actualizada exitosamente");
        setMostrarModal(false);
        setSolicitudSeleccionada(null);
        setModoEdicionSolicitud(false);
        obtenerSolicitudes();
      } else {
        mostrarAlerta("Error", resultado.message || "Error al actualizar la solicitud");
      }
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
      mostrarAlerta("Error", `Error: ${error.message}`);
    }
  };

  // Eliminar solicitud
  const eliminarSolicitud = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await solicitudService.delete(id);
      mostrarAlerta("¡Éxito!", "Solicitud eliminada exitosamente");
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`);
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

  // Abrir modal para crear solicitud
  const abrirModalCrearSolicitud = () => {
    setModoEdicionSolicitud(false);
    setNuevaSolicitud({
      solicitante: "",
      titulo: "",
      correo: "",
      telefono: "",
      tipoSolicitud: "",
      categoria: "",
      descripcion: "",
      estado: "Nueva",
      prioridad: "Media",
      responsable: "",
      observaciones: ""
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar solicitud
  const abrirModalEditarSolicitud = (solicitud) => {
    setModoEdicionSolicitud(true);
    setSolicitudSeleccionada({ ...solicitud });
    setMostrarModal(true);

  };

  // Paginación para solicitudes filtradas (aplicar filtros adicionales: categoria, estado)
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const solicitudesFiltradasPorFiltros = solicitudesFiltradas.filter((s) => {
    // Filtrar por categoría (comparar id o campo)
    const catId = s.categoria && (s.categoria._id || s.categoria);
    const cumpleCategoria = filtroCategoria === 'todos' || String(catId) === String(filtroCategoria);

    // Filtrar por estado (modelo usa campo 'estado')
    const cumpleEstado = filtroEstado === 'todos' || String(s.estado) === String(filtroEstado);

    return cumpleCategoria && cumpleEstado;
  });

  const totalPaginas = Math.ceil(solicitudesFiltradasPorFiltros.length / registrosPorPagina);
  const solicitudesPaginadas = solicitudesFiltradasPorFiltros.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Resetear página al cambiar búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaSolicitudes]);

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
              <h1>Gestión de Solicitudes</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            <button className="btn-admin btn-primary-admin" onClick={abrirModalCrearSolicitud}>
              + Nuevo Solicitud
            </button>
          </div>
          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin users">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.totalSolicitudes}</h3>
                <p>Total Solicitudes</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.pendientes}</h3>
                <p>Pendientes</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.aprobadas}</h3>
                <p>Aprobadas</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.altaPrioridad}</h3>
                <p>Alta Prioridad</p>
              </div>
            </div>
          </div>


          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar solicitudes..."
                  value={busquedaSolicitudes}
                  onChange={(e) => { setBusquedaSolicitudes(e.target.value); setPaginaActual(1); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroCategoria}
                  onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todas las categorías</option>
                  {Array.isArray(categorias) && categorias.map((cat) => (
                    <option key={cat._id || cat.id || cat.codigo} value={cat._id || cat.id || cat.codigo}>
                      {cat.nombre || cat.label || cat.codigo}
                    </option>
                  ))}
                </select>
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
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
          </div>
          <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
            <TablaUnificadaSolicitudes
              datosUnificados={{ solicitudes: solicitudesPaginadas, inscripciones: [], reservas: [] }}
              abrirModalEditarSolicitud={(canEdit && !readOnly) ? abrirModalEditarSolicitud : null}
              eliminarSolicitud={(canDelete && !modoTesorero && !readOnly) ? eliminarSolicitud : null}
            />
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
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <SolicitudModal
          mostrar={mostrarModal}
          modoEdicion={modoEdicionSolicitud}
          solicitudSeleccionada={solicitudSeleccionada}
          setSolicitudSeleccionada={setSolicitudSeleccionada}
          nuevaSolicitud={nuevaSolicitud}
          setNuevaSolicitud={setNuevaSolicitud}
          onClose={() => setMostrarModal(false)}
          onSubmit={modoEdicionSolicitud ? actualizarSolicitud : crearSolicitud}
          categorias={categorias}
          eventos={eventos}
          cabanas={cabanas}
          reservas={reservas}
          programasAcademicos={programasAcademicos}
          obtenerReferencias={obtenerReferencias}
        />

      </div>
    </div>
  );
};

export default GestionSolicitud;

// Validación de props con PropTypes

GestionSolicitud.propTypes = {
  usuario: PropTypes.object,
  onCerrarSesion: PropTypes.func,
  modoTesorero: PropTypes.bool,
  userRole: PropTypes.string,
  readOnly: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
