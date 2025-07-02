import React, { useState, useEffect } from 'react';
import { reporteService } from '../../services/reporteService';
import '../Dashboard/Dashboard.css'

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState('dashboard');
  const [datosReporte, setDatosReporte] = useState(null);
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

  const exportarPDF = async () => {
    try {
      await reporteService.exportToPDF(tipoReporte, filtros);
    } catch (err) {
      setError('Error al exportar PDF: ' + err.message);
    }
  };

  const exportarExcel = async () => {
    try {
      await reporteService.exportToExcel(tipoReporte, filtros);
    } catch (err) {
      setError('Error al exportar Excel: ' + err.message);
    }
  };

  const renderDashboard = () => {
    if (!datosReporte?.resumen) return null;
    
    const { resumen } = datosReporte;
    
    return (
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Usuarios Totales</h3>
          <p className="stat-number">{resumen.totalUsuarios}</p>
        </div>
        <div className="stat-card">
          <h3>Reservas Totales</h3>
          <p className="stat-number">{resumen.totalReservas}</p>
        </div>
        <div className="stat-card">
          <h3>Inscripciones Totales</h3>
          <p className="stat-number">{resumen.totalInscripciones}</p>
        </div>
        <div className="stat-card">
          <h3>Eventos Activos</h3>
          <p className="stat-number">{resumen.eventosProximos}</p>
        </div>
        <div className="stat-card">
          <h3>Solicitudes Pendientes</h3>
          <p className="stat-number">{resumen.solicitudesPendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Reservas Activas</h3>
          <p className="stat-number">{resumen.reservasActivas}</p>
        </div>
      </div>
    );
  };

  const renderTablaReporte = () => {
    if (!datosReporte) return null;

    switch (tipoReporte) {
      case 'reservas':
        return (
          <div>
            <h3>Estadísticas de Reservas</h3>
            <div className="estadisticas-grid">
              <div className="stat-card">
                <h4>Total de Reservas</h4>
                <p>{datosReporte.estadisticas.total}</p>
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

      case 'inscripciones':
        return (
          <div>
            <h3>Estadísticas de Inscripciones</h3>
            <div className="estadisticas-grid">
              <div className="stat-card">
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
              <div className="stat-card">
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
              <div className="stat-card">
                <h4>Ingresos por Cabañas</h4>
                <p>${datosReporte.cabanas?.ingresoTotal || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Ingresos por Eventos</h4>
                <p>${datosReporte.eventos?.ingresoTotal || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Total Consolidado</h4>
                <p>${datosReporte.resumen?.ingresoTotalConsolidado || 0}</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Selecciona un tipo de reporte</div>;
    }
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Sistema de Reportes</h2>
        <div className="reportes-controls">
          <select 
            value={tipoReporte} 
            onChange={(e) => setTipoReporte(e.target.value)}
            className="tipo-reporte-select"
          >
            <option value="dashboard">Dashboard General</option>
            <option value="reservas">Reporte de Reservas</option>
            <option value="inscripciones">Reporte de Inscripciones</option>
            <option value="solicitudes">Reporte de Solicitudes</option>
            <option value="usuarios">Reporte de Usuarios</option>
            <option value="eventos">Reporte de Eventos</option>
            <option value="financiero">Reporte Financiero</option>
            <option value="actividad">Actividad de Usuarios</option>
          </select>
          
          <button onClick={exportarPDF} className="btn-export">
            Exportar PDF
          </button>
          <button onClick={exportarExcel} className="btn-export">
            Exportar Excel
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
            
            <div className="reporte-footer">
              <p>Fecha de generación: {new Date(datosReporte.fechaGeneracion).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;