import React, { useState, useEffect } from "react";
import { reporteService } from '../../../services/reporteService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import '../Gestion.css';

const Gestionreportes = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentItem, setCurrentItem] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('dashboard');
    const [reportData, setReportData] = useState(null);

    // Cargar datos del dashboard al montar el componente
    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            setLoading(true);
            const data = await reporteService.getDashboard();
            setDashboardData(data);
            setReportData(data);
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
            mostrarAlerta('Error', 'No se pudieron cargar los datos del dashboard', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cambiar tipo de reporte
    const handleReportTypeChange = async (type) => {
        setReportType(type);
        setLoading(true);
        
        try {
            let data;
            switch (type) {
                case 'dashboard':
                    data = await reporteService.getDashboard();
                    break;
                case 'usuarios':
                    data = await reporteService.getUsuarios();
                    break;
                case 'reservas':
                    data = await reporteService.getReservas();
                    break;
                case 'inscripciones':
                    data = await reporteService.getInscripciones();
                    break;
                case 'eventos':
                    data = await reporteService.getEventos();
                    break;
                case 'financiero':
                    data = await reporteService.getFinanciero();
                    break;
                default:
                    data = await reporteService.getDashboard();
            }
            setReportData(data);
        } catch (error) {
            console.error('Error al cargar reporte:', error);
            mostrarAlerta('Error', 'No se pudo cargar el reporte', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setCurrentItem(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit');
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleSubmit = (data) => {
        if (modalMode === 'create') {
            // Lógica para crear
        } else {
            // Lógica para editar
        }
    };

    // Exportar a PDF
    const exportarPDF = async () => {
        try {
            mostrarAlerta('Info', 'Exportando reporte a PDF...', 'info');
            // Aquí se implementaría la lógica de exportación a PDF
            // Por ahora solo mostramos el mensaje
            setTimeout(() => {
                mostrarAlerta('Éxito', 'Reporte exportado exitosamente', 'success');
            }, 2000);
        } catch (error) {
            mostrarAlerta('Error', 'Error al exportar reporte', 'error');
        }
    };

    // Exportar a Excel
    const exportarExcel = async () => {
        try {
            mostrarAlerta('Info', 'Exportando reporte a Excel...', 'info');
            // Aquí se implementaría la lógica de exportación a Excel
            setTimeout(() => {
                mostrarAlerta('Éxito', 'Reporte exportado exitosamente', 'success');
            }, 2000);
        } catch (error) {
            mostrarAlerta('Error', 'Error al exportar reporte', 'error');
        }
    };

    // Guardar reporte
    const guardarReporte = async () => {
        try {
            const reporteData = {
                tipo: reportType,
                nombre: `Reporte ${reportType} - ${new Date().toLocaleDateString()}`,
                datos: reportData,
                fechaCreacion: new Date()
            };
            
            // Aquí se guardaría el reporte usando el servicio
            mostrarAlerta('Éxito', 'Reporte guardado exitosamente', 'success');
        } catch (error) {
            mostrarAlerta('Error', 'Error al guardar reporte', 'error');
        }
    };
    return (
        <>
        <Header/>
        <main className="main-content-tesorero">
            <div className="section-header-reporte">
                <h1>Sistema de Reportes</h1>
                <p>Generar informes del sistema</p>
                <div className="header-actions-reporte">
                    <select 
                        className="report-selector-reporte"
                        value={reportType}
                        onChange={(e) => handleReportTypeChange(e.target.value)}
                    >
                        <option value="dashboard">Dashboard General</option>
                        <option value="financiero">Reportes Financieros</option>
                        <option value="usuarios">Reportes de Usuarios</option>
                        <option value="eventos">Reportes de Eventos</option>
                        <option value="reservas">Reportes de Reservas</option>
                        <option value="inscripciones">Reportes de Inscripciones</option>
                    </select>
                    <button className="btn-secondary-reporte" onClick={exportarPDF}>
                        <i className="fas fa-file-pdf"></i>
                        Exportar PDF
                    </button>
                    <button className="btn-secondary-reporte" onClick={exportarExcel}>
                        <i className="fas fa-file-excel"></i>
                        Exportar Excel
                    </button>
                    <button className="btn-primary-reporte" onClick={guardarReporte}>
                        <i className="fas fa-save"></i>
                        Guardar Reporte
                    </button>
                </div>
            </div>


            <div className="stats-grid-reporte report-stats">
                {loading ? (
                    <div className="loading-container">
                        <p>Cargando datos...</p>
                    </div>
                ) : dashboardData?.resumen ? (
                    <>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Usuarios Totales</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.totalUsuarios || 0}</div>
                        </div>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Reservas Totales</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.totalReservas || 0}</div>
                        </div>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Inscripciones Totales</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.totalInscripciones || 0}</div>
                        </div>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Eventos Activos</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.eventosProximos || 0}</div>
                        </div>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Solicitudes Pendientes</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.solicitudesPendientes || 0}</div>
                        </div>
                        <div className="stat-card-reporte">
                            <div className="stat-header-reporte">
                                <h4>Cabañas Disponibles</h4>
                            </div>
                            <div className="stat-number-reporte">{dashboardData.resumen.totalCabanas || 0}</div>
                        </div>
                    </>
                ) : (
                    <div className="error-container">
                        <p>Error al cargar los datos</p>
                    </div>
                )}
            </div>

            <div className="report-info-reporte">
                <div className="report-timestamp-reporte">
                    <i className="fas fa-clock"></i>
                    <span>Fecha de generación: {new Date().toLocaleString('es-ES')}</span>
                </div>
                <div className="report-type-info">
                    <i className="fas fa-chart-bar"></i>
                    <span>Tipo de reporte: {reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span>
                </div>
            </div>
            {/*Tabla de resportes*/}
            <div class="reports-table-container-reporte">
                <div class="table-header-reporte">
                    <h3>Reportes Guardados</h3>
                    <button class="btn-primary-reporte" id="newReportBtn">
                        <i class="fas fa-plus"></i>
                        Nuevo Reporte
                    </button>
                </div>

                <div class="table-filters-reporte">
                    <div class="search-container-reporte">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Buscar reportes..." id="reportSearch"/>
                    </div>
                    <select >
                        <option value="">Todos los tipos</option>
                        <option value="financiero">Financiero</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="eventos">Eventos</option>
                        <option value="reservas">Reservas</option>
                    </select>
                    <select >
                        <option value="">Todos los estados</option>
                        <option value="generado">Generado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="archivado">Archivado</option>
                    </select>
                </div>

                <div class="table-wrapper-reporte">
                    <table class="reports-table-reporte">
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
                        <tbody id="reportsTableBody">
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-file-alt"></i>
                                        <span>Reporte Financiero Enero 2025</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-blue-reporte">Financiero</span></td>
                                <td>15/01/2025 14:30</td>
                                <td><span class="badge-reporte badge-green-reporte">Generado</span></td>
                                <td>2.4 MB</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Descargar">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-users"></i>
                                        <span>Reporte de Usuarios Activos</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-purple-reporte">Usuarios</span></td>
                                <td>10/01/2025 09:15</td>
                                <td><span class="badge-reporte badge-green-reporte">Generado</span></td>
                                <td>1.8 MB</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Descargar">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>Reporte de Eventos Diciembre</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-orange-reporte">Eventos</span></td>
                                <td>05/01/2025 16:45</td>
                                <td><span class="badge-reporte badge-yellow-reporte">Pendiente</span></td>
                                <td>-</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Generar">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
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
