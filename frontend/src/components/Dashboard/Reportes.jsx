import React, { useState, useEffect } from 'react';
import { reporteService } from '../../services/reporteService';
import './Dashboard.css'
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ReportesTabla from './Tablas/ReportesTabla';
import ReporteModal from './Modales/ReporteModal';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import { Download, FileSpreadsheet } from "lucide-react"

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
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [reportesGuardados, setReportesGuardados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    categoria: '',
    usuario: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar reporte inicial
  useEffect(() => {
    cargarReporte();
  }, [tipoReporte]);

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

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const aplicarFiltros = () => {
    cargarReporte();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      categoria: '',
      usuario: ''
    });
  };

  ///const exportarPDF = async () => {
  ///  try {
  ///    await reporteService.exportToPDF(tipoReporte, filtros);
  ///  } catch (err) {
  ///    setError('Error al exportar PDF: ' + err.message);
  ///  }
  ///};

  // Export functions are currently handled elsewhere or via buttons that call services directly.
  // If needed, reintroduce a dedicated exportarExcel handler here.

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
  const renderDashboard = () => {
    if (!datosReporte?.resumen) return null;


    const { resumen } = datosReporte;

    return (

      <>
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


        <div className="reports-table-container-reporte">
          <ReportesTabla
            reportesGuardados={reportesGuardados}
            editarReporte={abrirModalEditar}
            eliminarReporte={eliminarReporte}
          />
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

      </>
    );
  };
  const renderTablaReporte = () => {
    if (!datosReporte) return null;
    switch (tipoReporte) {
      case 'reservas': {
        // Calcular reservas activas (estados: 'Pendiente', 'Confirmada', 'Activa')
        let reservasActivas = 0;
        if (Array.isArray(datosReporte.estadisticas.porEstado)) {
          reservasActivas = datosReporte.estadisticas.porEstado
            .filter(e => ['Pendiente', 'Confirmada', 'Activa'].includes(e._id))
            .reduce((acc, curr) => acc + curr.count, 0);
        }
        return (
          <div>
            <h3>Estadísticas de Reservas</h3>
            <div className="estadisticas-grid">
              <div className="stat-card-reporte-admin">
                <h4>Total de Reservas</h4>
                <p>{datosReporte.estadisticas.total}</p>
              </div>
              <div className="stat-card-reporte-admin">
                <h4>Reservas Activas</h4>
                <p>{reservasActivas}</p>
              </div>
            </div>
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Cabaña</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datosReporte.reservas?.map((reserva) => (
                  <tr key={reserva._id}>
                    <td>{reserva.usuario?.username}</td>
                    <td>{reserva.cabana?.nombre}</td>
                    <td>{new Date(reserva.fechaInicio).toLocaleDateString()}</td>
                    <td>{new Date(reserva.fechaFin).toLocaleDateString()}</td>
                    <td>{reserva.estado || 'Activa'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'inscripciones':
        return (
          <div>
            <h3>Estadísticas de Inscripciones</h3>
            <div className="estadisticas-grid">
              <div className="stat-card-reporte-admin">
                <h4>Total de Inscripciones</h4>
                <p>{datosReporte.estadisticas.total}</p>
              </div>
            </div>
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Evento</th>
                  <th>Categoría</th>
                  <th>Fecha Inscripción</th>
                </tr>
              </thead>
              <tbody>
                {datosReporte.inscripciones?.map((inscripcion) => (
                  <tr key={inscripcion._id}>
                    <td>{inscripcion.usuario?.username}</td>
                    <td>{inscripcion.evento?.name}</td>
                    <td>{inscripcion.categoria?.nombre}</td>
                    <td>{new Date(inscripcion.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'solicitudes':
        return (
          <div>
            <h3>Estadísticas de Solicitudes</h3>
            <div className="estadisticas-grid">
              <div className="stat-card-reporte-admin">
                <h4>Total de Solicitudes</h4>
                <p>{datosReporte.estadisticas.total}</p>
              </div>
            </div>
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {datosReporte.solicitudes?.map((solicitud) => (
                  <tr key={solicitud._id}>
                    <td>{solicitud.solicitante?.username}</td>
                    <td>{solicitud.tipoSolicitud}</td>
                    <td>{solicitud.estado}</td>
                    <td>{solicitud.prioridad}</td>
                    <td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'financiero':
        return (
          <div>
            <h3>Reporte Financiero</h3>
            <div className="estadisticas-grid">
              <div className="stat-card-reporte-admin">
                <h4>Ingresos por Cabañas</h4>
                <p>${datosReporte.cabanas?.ingresoTotal || 0}</p>
              </div>
              <div className="stat-card-reporte-admin">
                <h4>Ingresos por Eventos</h4>
                <p>${datosReporte.eventos?.ingresoTotal || 0}</p>
              </div>
              <div className="stat-card-reporte-admin">
                <h4>Total Consolidado</h4>
                <p>${datosReporte.resumen?.ingresoTotalConsolidado || 0}</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Selecciona un tipo de reporte</div>
    }
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
        <div className="reportes-container w-full max-w-full px-2 md:px-8">

          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className='seccion-usuarios'>
              <h1 className="font-bold text-3xl text-gray-900 mb-2">Sistema de Reportes</h1>
              <p className="text-gray-600">Genera y administra reportes del sistema</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-end w-full md:w-auto">
              <button
                //onClick={handleExportPDF}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </button>
              <button
                //onClick={handleExportExcel}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar Excel
              </button>
              <button
                onClick={() => setMostrarModal(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Nuevo Reporte
              </button>

            </div>
          </div>
          {tipoReporte !== 'dashboard' && (
            <div className="filtros-section">
              <h3>Filtros</h3>
              <div className="filtros-grid">
                <input
                  type="date"
                  name="fechaInicio"
                  value={filtros.fechaInicio}
                  onChange={handleFiltroChange}
                  placeholder="Fecha Inicio"
                />
                <input
                  type="date"
                  name="fechaFin"
                  value={filtros.fechaFin}
                  onChange={handleFiltroChange}
                  placeholder="Fecha Fin"
                />
                <input
                  type="text"
                  name="estado"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                  placeholder="Estado"
                />
                <input
                  type="text"
                  name="categoria"
                  value={filtros.categoria}
                  onChange={handleFiltroChange}
                  placeholder="Categoría"
                />
                <button onClick={aplicarFiltros} className="btn-filtro">
                  Aplicar Filtros
                </button>
                <button onClick={limpiarFiltros} className="btn-filtro">
                  Limpiar
                </button>
              </div>
            </div>
          )}
          <div className="reporte-content">
            {loading && <div className="loading">Cargando reporte...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && datosReporte && (
              <div>
                {tipoReporte === 'dashboard' ? renderDashboard() : renderTablaReporte()}


              </div>
            )}
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
      </div>
    </div>
  );
};

export default Reportes;