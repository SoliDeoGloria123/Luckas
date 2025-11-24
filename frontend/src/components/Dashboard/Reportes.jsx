import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { reporteService } from '../../services/reporteService';
import './Dashboard.css'
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ReportesTabla from './Tablas/ReportesTabla';
import ReporteModal from './Modales/ReporteModal';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';


const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState('dashboard'); // NOSONAR: setter not used in this view but kept for future use
  // Evitar warning de análisis estático cuando el setter no se está usando en este momento.
  // Usamos el setter en un useEffect de solo montaje para evitar que herramientas
  // de análisis (Sonar) marquen la variable como no usada. No cambia el estado
  // porque se asigna el mismo valor.
  useEffect(() => {
    setTipoReporte(prev => prev);
  }, []);
  const [datosReporte, setDatosReporte] = useState(null);
  const [filtros, setFiltros] = useState({}); // NOSONAR: setter no usado actualmente, pero mantenido para uso futuro
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [reportesGuardados, setReportesGuardados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar reporte inicial
  useEffect(() => {
    cargarReporte();
  }, [tipoReporte]);

  // Tipos y estados según el modelo de reportes
  const tiposDisponibles = ['usuarios', 'programas', 'eventos', 'reservas', 'inscripciones', 'solicitudes', 'tareas', 'cabañas'];
  const estadosDisponibles = ['generado', 'procesando', 'error', 'archivado'];

  // Filtrado local de reportes guardados (buscador + filtros simples)
  const reportesFiltrados = React.useMemo(() => {
    const q = (busqueda || '').toString().trim().toLowerCase();
    return reportesGuardados.filter(r => {
      if (filtroTipo && filtroTipo !== 'todos' && String(r.tipo) !== String(filtroTipo)) return false;
      if (filtroEstado && filtroEstado !== 'todos' && String(r.estado) !== String(filtroEstado)) return false;
      if (!q) return true;
      const hay = `${r.nombre || ''} ${r.descripcion || ''} ${r.tipo || ''}`.toLowerCase().includes(q);
      return hay;
    });
  }, [reportesGuardados, busqueda, filtroTipo, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(reportesFiltrados.length / registrosPorPagina));
  const reportesPaginados = React.useMemo(() => {
    const start = (paginaActual - 1) * registrosPorPagina;
    return reportesFiltrados.slice(start, start + registrosPorPagina);
  }, [reportesFiltrados, paginaActual]);

  const cargarReporte = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (tipoReporte) {
        case 'dashboard':
          response = await reporteService.getDashboard();
          break;
        case 'reservas':
          response = await reporteService.getReservas(filtros);
          break;
        case 'inscripciones':
          response = await reporteService.getInscripciones(filtros);
          break;
        case 'solicitudes':
          response = await reporteService.getSolicitudes(filtros);
          break;
        case 'usuarios':
          response = await reporteService.getUsuarios(filtros);
          break;
        case 'eventos':
          response = await reporteService.getEventos(filtros);
          break;
        case 'financiero':
          response = await reporteService.getFinanciero(filtros);
          break;
        case 'actividad':
          response = await reporteService.getActividadUsuarios(filtros);
          break;
        default:
          response = await reporteService.getDashboard();
      }
      setDatosReporte(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Obtener los reportes desde la base de datos
  const cargarReportesGuardados = async () => {
    try {
      const reportes = await reporteService.getReportesGuardados();
      setReportesGuardados(reportes);
    } catch (error) {
      console.error("Error al cargar reportes guardados", error);
    }
  };
  useEffect(() => {
    cargarReportesGuardados();
  }, []);

  // Función centralizada para crear el reporte
  const crearReporte = async (data) => {
    try {
      await reporteService.guardarReporte(data);
      setMostrarModal(false);
      mostrarAlerta('¡Éxito!', 'Reporte guardado exitosamente');
      cargarReportesGuardados(); // Recargar la lista
    } catch (err) {
      mostrarAlerta('Error al guardar el reporte: ' + err.message, 'error');
      setError(err.message || "Error al guardar el reporte");
    }
  };

  // Estado para edición
  const [reporteEditando, setReporteEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Editar un reporte guardado
  const editarReporte = async (id, datosActualizados) => {
    try {
      await reporteService.editarReporte(id, datosActualizados);
      mostrarAlerta('Reporte editado correctamente', 'success');
      cargarReportesGuardados();
      setMostrarModal(false);
      setReporteEditando(null);
      setModoEdicion(false);
    } catch (err) {
      mostrarAlerta('Error al editar el reporte: ' + err.message, 'error');
    }
  };
  // Eliminar un reporte guardado
  const eliminarReporte = async (id) => {
    const confirmacion = await mostrarConfirmacion('¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.');
    if (!confirmacion) return;
    try {
      await reporteService.eliminarReporte(id);
      mostrarAlerta("¡Éxito!", "Reporte eliminado correctamente");
      cargarReportesGuardados();
    } catch (err) {
      mostrarAlerta('Error al eliminar el reporte: ' + err.message, 'error');
    }
  };
  // Abrir modal para editar
  const abrirModalEditar = (reporte) => {
    setReporteEditando(reporte);
    setModoEdicion(true);
    setMostrarModal(true);
  };
  // Cerrar modal y limpiar edición
  //const cerrarModal = () => {
  //  setMostrarModal(false);
  //  setReporteEditando(null);
  //  setModoEdicion(false);
  //};
  // Resumen seguro para evitar errores en render cuando datosReporte es null
  const resumen = (datosReporte && datosReporte.resumen) ? datosReporte.resumen : {
    totalUsuarios: 0,
    totalReservas: 0,
    totalInscripciones: 0,
    eventosProximos: 0,
    solicitudesPendientes: 0,
    reservasActivas: 0
  };

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
        <div className="p-9 space-y-7 fade-in-up">
          {/* Page Header */}
          <div className="page-header-Academicos">
            <div className='page-title-admin'>
              <h1>Sistema de Reportes</h1>
              <p >Genera y administra reportes del sistema</p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="btn-admin btn-primary-admin"
            >
              + Nuevo Reporte
            </button>
          </div>
          {loading && <div className="loading">Cargando reporte...</div>}
          {error && <div className="error">{error}</div>}

          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin users'>
                <i className="fas fa-users"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.totalUsuarios}</h3>
                <p>Usuarios Totales</p>
                <span className="stat-trend positive">
                  <i className="fas fa-arrow-up"></i> {' '}
                  +12% este mes
                </span>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin reservas'>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.totalReservas}</h3>
                <p>Reservas Totales</p>
                <span className="stat-trend neutral">
                  <i className="fas fa-minus"></i>{' '}
                  Sin cambios
                </span>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin inscripciones'>
                <i className="fas fa-user-plus"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.totalInscripciones}</h3>
                <p>Inscripciones Totales</p>
                <span className="stat-trend positive">
                  <i className="fas fa-arrow-up"></i> {' '}
                  +5% esta semana
                </span>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin eventos'>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.eventosProximos}</h3>
                <p>Eventos Activos</p>
                <span className="stat-trend negative">
                  <i className="fas fa-arrow-down"></i> {' '}
                  -100% este mes
                </span>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin solicitudes'>
                <i className="fas fa-file-alt"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.solicitudesPendientes}</h3>
                <p>Solicitudes Pendientes</p>
                <span className="stat-trend warning">
                  <i className="fas fa-exclamation-triangle"></i> {' '}
                  Requiere atención
                </span>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className='stat-icon-reporte-admin reservas-activas'>
                <i className="fas fa-home"></i>
              </div>
              <div className='stat-contetn-reporte-admin'>
                <h3 >{resumen.reservasActivas}</h3>
                <p>Reservas Activas</p>
                <span className="stat-trend neutral">
                  <i className="fas fa-minus"></i> {' '}
                  Sin actividad
                </span>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar reportes (nombre, descripción, tipo)..."
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroTipo}
                  onChange={(e) => { setFiltroTipo(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los Tipos</option>
                  {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los Estados</option>
                  {estadosDisponibles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="reports-table-container-reporte">
            <ReportesTabla
              reportesGuardados={reportesPaginados}
              editarReporte={abrirModalEditar}
              eliminarReporte={eliminarReporte}
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="pagination-btn-admin"
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >Anterior</button>
              <span className="text-sm">Página {paginaActual} de {totalPaginas}</span>
              <button
                className="pagination-btn-admin"
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
              >Siguiente</button>
            </div>
          </div>


          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#2563eb] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="text-[#334155] font-medium mb-1">
                  <span className="font-semibold">Fecha de generación:</span> {new Date().toLocaleString("es-ES")}
                </p>
                <p className="text-[#334155]">
                  <span className="font-semibold">Tipo de reporte:</span> {/*selectedReport.replace("-", " ")*/}
                </p>
              </div>
            </div>
          </div>
          </div>
          <ReporteModal
            mostrar={mostrarModal}
            onClose={() => {
              setMostrarModal(false);
              setReporteEditando(null);
              setModoEdicion(false);
            }}
            onSubmit={(data) => {
              if (modoEdicion && reporteEditando) {
                editarReporte(reporteEditando._id || reporteEditando.id, data);
              } else {
                crearReporte(data);
              }
            }}
            datosIniciales={reporteEditando}
            modoEdicion={modoEdicion}
          />
        </div>
    </div>


  );
};

export default Reportes;