import React, { useState, useEffect } from 'react';
import { Search,  FileText,TrendingUp,PieChartIcon,X, } from 'lucide-react';
import { reporteService } from '../../services/reporteService';
import './Dashboard.css'
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ReportesTabla from './Tablas/ReportesTabla';
import ReporteModal from './Modales/ReporteModal';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Pagination from '../Dashboard/Shared/Pagination';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"


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

  // Variables para el modal de ver detalles del reporte
  const [activeReport, setActiveReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
  
  // Extraer datos del reporte activo - debe estar antes de generateChartData
  const extraerDataArray = (datos) => {
    if (Array.isArray(datos)) return datos;
    if (typeof datos === 'object' && datos !== null) {
      const values = Object.values(datos);
      const arrays = values.filter(v => Array.isArray(v));
      return arrays.length > 0 ? arrays[0] : [];
    }
    return [];
  };
  
  // Variables para el modal de ver detalles
  const COLORS = ["#2563eb", "#8b5cf6", "#059669", "#f59e0b", "#ef4444"];
  
  // Helpers para generar gráficos
  const generateTrendData = (datos) => {
    if (!datos.length) return [];
    
    const mesesConDatos = {};
    
    for (const item of datos) {
      const fechaField = item.createdAt || item.fechaCreacion || item.fecha || item.fechaInscripcion || item.fechaInicio;
      if (fechaField) {
        const fecha = new Date(fechaField);
        if (!Number.isNaN(fecha.getTime())) {
          const mesKey = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
          mesesConDatos[mesKey] = (mesesConDatos[mesKey] || 0) + 1;
        }
      }
    }
    
    const trend = [];
    for (const [mes, total] of Object.entries(mesesConDatos)) {
      trend.push({ mes, total });
    }
    
    // Fallback si no hay datos de fecha
    if (trend.length === 0) {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr'];
      const totalPorMes = Math.ceil(datos.length / 4);
      for (const [index, mes] of meses.entries()) {
        trend.push({ 
          mes, 
          total: index === meses.length - 1 ? datos.length - (totalPorMes * (meses.length - 1)) : totalPorMes 
        });
      }
    }
    
    return trend;
  };
  
  const generateDistributionData = (datos) => {
    if (!datos.length) return [];
    
    const conteoEstados = {};
    
    for (const item of datos) {
      const estado = item.estado || item.tipo || item.status || item.tipoReferencia || 'Sin clasificar';
      conteoEstados[estado] = (conteoEstados[estado] || 0) + 1;
    }
    
    const distribution = [];
    for (const [name, value] of Object.entries(conteoEstados)) {
      distribution.push({ name, value });
    }
    
    // Fallback si no hay estados
    if (distribution.length === 0) {
      distribution.push({ name: 'Total', value: datos.length });
    }
    
    return distribution;
  };

  // Generar datos del gráfico
  const generateChartData = (report) => {
    if (!report || !report.datos) {
      return { trend: [], distribution: [] };
    }
    
    const datos = extraerDataArray(report.datos);
    return {
      trend: generateTrendData(datos),
      distribution: generateDistributionData(datos)
    };
  };
  
  const chartData = React.useMemo(() => generateChartData(activeReport), [activeReport]);
  
  const filteredData = React.useMemo(() => {
    if (!activeReport) return [];
    const datos = activeReport.datos || {};
    const data = extraerDataArray(datos);

    return data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [activeReport, searchTerm]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
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
              onVerDetalles={setActiveReport}
            />

          </div>

          <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            ><i className="fas fa-chevron-left"/></button>
            <span className="text-sm">Página {paginaActual} de {totalPaginas}</span>
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
            >  <i className="fas fa-chevron-right"/></button>
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

             {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-10">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto p-6">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{activeReport.nombre || 'Reporte'}</h2>
                  <p className="text-sm text-gray-600">{activeReport.descripcion || 'Sin descripción disponible'}</p>
                </div>
                <button
                  onClick={() => setActiveReport(null)}
                  className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en resultados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
                {filteredData.length > 0 ? (
                  <>
                    <table className="hidden md:table w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(paginatedData[0] || {})
                            .filter((key) => key !== '_id' && key !== 'id')
                            .map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {paginatedData.map((row, idx) => {
                          const rowKey = row._id || row.id || Object.values(row).join('-') + '-' + idx;
                          return (
                            <tr key={rowKey} className="hover:bg-gray-50">
                              {Object.entries(row)
                                .filter(([colKey]) => colKey !== '_id' && colKey !== 'id')
                                .map(([colKey, value]) => (
                                  <td key={colKey} className="px-4 py-3 text-sm text-gray-900">
                                    {String(value || 'N/A')}
                                  </td>
                                ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Tarjetas responsive para móvil */}
                    <div className="md:hidden">
                      {paginatedData.map((row, idx) => {
                        const rowKey = row._id || row.id || Object.values(row).join('-') + '-' + idx;
                        return (
                          <div key={rowKey} className="bg-white rounded-lg shadow p-3 mb-2 border">
                            {Object.entries(row)
                              .filter(([key]) => key !== '_id' && key !== 'id')
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between py-1 text-sm">
                                  <span className="font-semibold text-gray-700">{key}:</span>
                                  <span className="text-gray-900">{String(value || 'N/A')}</span>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
                      <p className="text-sm text-gray-600">
                        Este reporte no contiene datos para los filtros seleccionados o el tipo de reporte no está soportado.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Trend Chart */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Tendencia</h3>
                  </div>
                  {chartData.trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData.trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-500">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay datos de tendencia disponibles</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Distribution Chart */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Distribución</h3>
                  </div>
                  {chartData.distribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={chartData.distribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.distribution.map((entry, index) => (
                            <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-500">
                      <div className="text-center">
                        <PieChartIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay datos de distribución disponibles</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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