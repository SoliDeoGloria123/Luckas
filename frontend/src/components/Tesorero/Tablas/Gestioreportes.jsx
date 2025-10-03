import React, { useState } from "react";
import { useEffect } from "react";
import { reporteService } from '../../../services/reporteService';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'

const Gestionreportes = () => {

    // Estado para estadísticas y reportes guardados
    const [stats, setStats] = useState({
        usuarios: 0,
        reservas: 0,
        inscripciones: 0,
        eventos: 0,
        solicitudes: 0,
        cabanas: 0,
        fechaGeneracion: null
    });
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [nuevoReporte, setNuevoReporte] = useState({ nombre: '', descripcion: '', tipo: '', filtros: {}, datos: {} });

    useEffect(() => {
        // Obtener estadísticas del dashboard
        reporteService.getDashboard().then(res => {
            if (res.success && res.data) {
                setStats({
                    usuarios: res.data.resumen.totalUsuarios,
                    reservas: res.data.resumen.totalReservas,
                    inscripciones: res.data.resumen.totalInscripciones,
                    eventos: res.data.resumen.totalEventos,
                    solicitudes: res.data.resumen.totalSolicitudes,
                    cabanas: res.data.resumen.totalCabanas,
                    fechaGeneracion: res.data.fechaGeneracion
                });
            }
        });
        // Obtener reportes guardados
        fetch('http://localhost:3000/api/reporte/listar')
            .then(r => r.json())
            .then(res => {
                if (res.success && Array.isArray(res.data)) {
                    setReportes(res.data);
                }
                setLoading(false);
            })
            .catch(e => { setError(e.message); setLoading(false); });
    }, []);

    // Filtrar reportes por búsqueda y filtros
    const reportesFiltrados = reportes.filter(r => {
        const matchSearch = r.nombre?.toLowerCase().includes(search.toLowerCase());
        const matchTipo = tipoFiltro ? r.tipo === tipoFiltro : true;
        const matchEstado = estadoFiltro ? (r.estado ? r.estado === estadoFiltro : false) : true;
        return matchSearch && matchTipo && matchEstado;
    });

    // Acciones de botones
    const handleExportPDF = (reporte) => {
        reporteService.exportToPDF(reporte.tipo, reporte.filtros);
    };
    const handleExportExcel = (reporte) => {
        reporteService.exportToExcel(reporte.tipo, reporte.filtros);
    };
    const handleGuardarReporte = async () => {
        // Ejemplo: guardar el dashboard actual
        try {
            await reporteService.guardarReporte({
                nombre: `Reporte Dashboard ${new Date().toLocaleDateString()}`,
                descripcion: 'Reporte generado desde el dashboard',
                tipo: 'dashboard',
                filtros: {},
                datos: stats
            });
            window.location.reload();
        } catch (e) {
            alert('Error al guardar el reporte: ' + e.message);
        }
    };
    const handleNuevoReporte = () => {
        setShowModal(true);
    };

    const handleModalChange = e => {
        const { name, value } = e.target;
        setNuevoReporte(r => ({ ...r, [name]: value }));
    };

    const handleCrearReporte = async () => {
        try {
            await reporteService.guardarReporte({
                ...nuevoReporte,
                datos: stats
            });
            setShowModal(false);
            window.location.reload();
        } catch (e) {
            alert('Error al crear el reporte: ' + e.message);
        }
    };
    return (
        <>
        {showModal && (
            <div className="modal-reporte-bg">
                <div className="modal-reporte">
                    <h2>Nuevo Reporte</h2>
                    <label>Nombre</label>
                    <input name="nombre" value={nuevoReporte.nombre} onChange={handleModalChange} />
                    <label>Descripción</label>
                    <input name="descripcion" value={nuevoReporte.descripcion} onChange={handleModalChange} />
                    <label>Tipo</label>
                    <select name="tipo" value={nuevoReporte.tipo} onChange={handleModalChange}>
                        <option value="">Selecciona tipo</option>
                        <option value="financiero">Financiero</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="eventos">Eventos</option>
                        <option value="reservas">Reservas</option>
                        <option value="dashboard">Dashboard</option>
                    </select>
                    <div style={{ marginTop: 16 }}>
                        <button className="btn-primary-reporte" onClick={handleCrearReporte}>Crear</button>
                        <button className="btn-secondary-reporte" onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )}
        <Header/>
        <main className="main-content-tesorero">
            <div className="section-header-reporte">
                <h1>Sistema de Reportes</h1>
                <p>Generar informes del sistema</p>
                <div className="header-actions-reporte">
                    <select className="report-selector-reporte">
                        <option value="dashboard">Dashboard General</option>
                        <option value="financiero">Reportes Financieros</option>
                        <option value="usuarios">Reportes de Usuarios</option>
                        <option value="eventos">Reportes de Eventos</option>
                    </select>
                    <button className="btn-secondary-reporte" onClick={() => handleExportPDF({ tipo: 'dashboard', filtros: {} })}>
                        <i className="fas fa-file-pdf"></i>
                        Exportar PDF
                    </button>
                    <button className="btn-secondary-reporte" onClick={() => handleExportExcel({ tipo: 'dashboard', filtros: {} })}>
                        <i className="fas fa-file-excel"></i>
                        Exportar Excel
                    </button>
                    <button className="btn-primary-reporte" onClick={handleGuardarReporte}>
                        <i className="fas fa-save"></i>
                        Guardar Reporte
                    </button>
                </div>
            </div>

            <div className="stats-grid-reporte report-stats">
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Usuarios Totales</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.usuarios}</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Reservas Totales</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.reservas}</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Inscripciones Totales</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.inscripciones}</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Eventos Activos</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.eventos}</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Solicitudes Pendientes</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.solicitudes}</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Cabañas Disponibles</h4>
                    </div>
                    <div className="stat-number-reporte">{stats.cabanas}</div>
                </div>
            </div>

            <div className="report-info-reporte">
                <div className="report-timestamp-reporte">
                    <i className="fas fa-clock"></i>
                    <span>Fecha de generación: {stats.fechaGeneracion ? new Date(stats.fechaGeneracion).toLocaleString() : '--'}</span>
                </div>
            </div>
            {/*Tabla de reportes*/}
            <div className="reports-table-container-reporte">
                <div className="table-header-reporte">
                    <h3>Reportes Guardados</h3>
                    <button className="btn-primary-reporte" id="newReportBtn" onClick={handleNuevoReporte}>
                        <i className="fas fa-plus"></i>
                        Nuevo Reporte
                    </button>
                </div>

                <div className="table-filters-reporte">
                    <div className="search-container-reporte">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar reportes..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
                        <option value="">Todos los tipos</option>
                        <option value="financiero">Financiero</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="eventos">Eventos</option>
                        <option value="reservas">Reservas</option>
                    </select>
                    <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
                        <option value="">Todos los estados</option>
                        <option value="generado">Generado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="archivado">Archivado</option>
                    </select>
                </div>

                <div className="table-wrapper-reporte">
                    <table className="reports-table-reporte">
                        <thead>
                            <tr>
                                <th>Nombre del Reporte</th>
                                <th>Tipo</th>
                                <th>Fecha Creación</th>
                                <th>Estado</th>
                                <th>Tamaño</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6}>Cargando...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6}>Error: {error}</td></tr>
                            ) : reportesFiltrados.length === 0 ? (
                                <tr><td colSpan={6}>No hay reportes guardados</td></tr>
                            ) : (
                                reportesFiltrados.map((r, idx) => (
                                    <tr key={r._id || idx}>
                                        <td>
                                            <div className="report-name-reporte">
                                                <i className={`fas ${r.tipo === 'financiero' ? 'fa-file-alt' : r.tipo === 'usuarios' ? 'fa-users' : r.tipo === 'eventos' ? 'fa-calendar-alt' : 'fa-file'}`}></i>
                                                <span>{r.nombre}</span>
                                            </div>
                                        </td>
                                        <td><span className={`badge-reporte badge-${r.tipo === 'financiero' ? 'blue' : r.tipo === 'usuarios' ? 'purple' : r.tipo === 'eventos' ? 'orange' : 'gray'}-reporte`}>{r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)}</span></td>
                                        <td>{r.fechaGeneracion ? new Date(r.fechaGeneracion).toLocaleString() : '--'}</td>
                                        <td><span className={`badge-reporte badge-${r.estado === 'generado' ? 'green' : r.estado === 'pendiente' ? 'yellow' : 'gray'}-reporte`}>{r.estado ? r.estado.charAt(0).toUpperCase() + r.estado.slice(1) : 'Desconocido'}</span></td>
                                        <td>{r.tamano || '-'}</td>
                                        <td>
                                            <div className="action-buttons-reporte">
                                                <button className="btn-icon-reporte" title="Ver" onClick={() => alert('Funcionalidad de ver próximamente')}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn-icon-reporte" title="Descargar" onClick={() => handleExportPDF(r)}>
                                                    <i className="fas fa-download"></i>
                                                </button>
                                                <button className="btn-icon-reporte" title="Editar" onClick={() => alert('Funcionalidad de editar próximamente')}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    )

}

export default Gestionreportes;
