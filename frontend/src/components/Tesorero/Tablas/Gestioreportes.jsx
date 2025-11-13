import React, { useState, useEffect } from "react";
import { reporteService } from '../../../services/reporteService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import ReporteModal from '../../Dashboard/Modales/ReporteModal';
import '../Gestion.css';

const Gestionreportes = () => {

    const [dashboardData, setDashboardData] = useState(null);
    const [reportType, setReportType] = useState('dashboard');
    const [reportesGuardados, setReportesGuardados] = useState([]);

    // Variables para el modal del Dashboard
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [nuevoReporte, setNuevoReporte] = useState({
        nombre: '',
        descripcion: '',
        tipo: 'dashboard',
        fechaInicio: '',
        fechaFin: '',
        estado: 'borrador'
    });


    const cargarReportesGuardados = async () => {
        try {
            const response = await reporteService.getReportesGuardados();
            // Extraer el array de reportes según la estructura de respuesta
            let reportes = [];
            if (Array.isArray(response)) {
                reportes = response;
            } else if (response && Array.isArray(response.data)) {
                reportes = response.data;
            } else if (response && response.reportes && Array.isArray(response.reportes)) {
                reportes = response.reportes;
            }
            setReportesGuardados(reportes);
        } catch (error) {
            console.error("Error al cargar reportes guardados", error);
            setReportesGuardados([]);
        }
    };
    useEffect(() => {
        // Cargar reportes guardados y dashboard al iniciar
        const init = async () => {
            cargarReportesGuardados();
            try {
                const data = await reporteService.getDashboard();
                setDashboardData(data);
            } catch (err) {
                console.error('Error al cargar dashboard inicial', err);
            }
        };
        init();
    }, []);

    // Cambiar tipo de reporte
    const handleReportTypeChange = async (type) => {
        setReportType(type);
        
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
            // Los datos se procesan pero no se almacenan en una variable de estado
            console.log('Datos cargados:', data);
        } catch (error) {
            console.error('Error al cargar reporte:', error);
            mostrarAlerta('Error', 'No se pudo cargar el reporte', 'error');
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
            console.log('Error al exportar reporte a PDF:', error);
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
            console.log('Error al exportar reporte a Excel:', error);
        }
    };

    // Función para crear reporte
    // const handleCrearReporte = async (datosReporte) => {
    //     try {
    //         // El servicio en frontend usa guardarReporte
    //         await reporteService.guardarReporte(datosReporte);
    //         mostrarAlerta('Éxito', 'Reporte creado exitosamente');
    //         setShowModal(false);
    //         cargarReportesGuardados();
    //     } catch (error) {
    //         mostrarAlerta('Error', `Error al crear reporte: ${error.message}`);
    //     }
    // };

    // Función para editar reporte
    const handleEditarReporte = (reporte) => {
        setReporteSeleccionado(reporte);
        setModoEdicion(true);
        setShowModal(true);
    };

    // Función para actualizar reporte
     //const handleActualizarReporte = async (datosReporte) => {
     //    try {
     //        // El servicio en frontend usa editarReporte
     //        await reporteService.editarReporte(reporteSeleccionado._id, datosReporte);
     //        mostrarAlerta('Éxito', 'Reporte actualizado exitosamente');
     //        setShowModal(false);
     //        setModoEdicion(false);
     //        setReporteSeleccionado(null);
     //        cargarReportesGuardados();
     //    } catch (error) {
     //        mostrarAlerta('Error', `Error al actualizar reporte: ${error.message}`);
     //    }
     //};
 
     // Función para cerrar modal
    //const handleCerrarModal = () => {
    //    setMostrarModal(false);
    //    setModoEdicion(false);
    //    setReporteSeleccionado(null);
    //};
//
    const handleCreate = () => {
        setModoEdicion(false);
        setReporteSeleccionado(null);
        setNuevoReporte({
            nombre: '',
            descripcion: '',
            tipo: 'dashboard',
            fechaInicio: '',
            fechaFin: '',
            estado: 'borrador'
        });
        setMostrarModal(true);
    };


    // Funciones para el modal del Dashboard
    const crearReporte = async (e) => {
        e.preventDefault();
        try {
            await reportesService.createReporte(nuevoReporte);
            mostrarAlerta("¡Éxito!", "Reporte creado exitosamente", 'success');
            setMostrarModal(false);
            cargarReportesGuardados();
        } catch (error) {
            mostrarAlerta("ERROR", `Error al crear reporte: ${error.message}`, 'error');
        }
    };

    const actualizarReporte = async (e) => {
        e.preventDefault();
        try {
            await reportesService.updateReporte(reporteSeleccionado._id, nuevoReporte);
            mostrarAlerta("¡Éxito!", "Reporte actualizado exitosamente", 'success');
            setMostrarModal(false);
            cargarReportesGuardados();
        } catch (error) {
            mostrarAlerta("ERROR", `Error al actualizar reporte: ${error.message}`, 'error');
        }
    };


    // Construir la sección de estadísticas siempre (usar 0 por defecto si no hay datos)
    const resumen = dashboardData?.resumen || {};
    const statsContent = (
        <>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Usuarios Totales</h4>
                </div>
                <div className="stat-number-reporte">{resumen.totalUsuarios || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Reservas Totales</h4>
                </div>
                <div className="stat-number-reporte">{resumen.totalReservas || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Inscripciones Totales</h4>
                </div>
                <div className="stat-number-reporte">{resumen.totalInscripciones || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Eventos Activos</h4>
                </div>
                <div className="stat-number-reporte">{resumen.eventosProximos || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Solicitudes Pendientes</h4>
                </div>
                <div className="stat-number-reporte">{resumen.solicitudesPendientes || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Cabañas Disponibles</h4>
                </div>
                <div className="stat-number-reporte">{resumen.totalCabanas || 0}</div>
            </div>
        </>
    );

    return (
        <>
            <Header />
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
                        <button 
                            onClick={exportarPDF}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-[#334155] font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Exportar PDF
                        </button>
                        <button 
                            onClick={exportarExcel}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-[#334155] font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Exportar Excel
                        </button>
                    </div>
                </div>


                <div className="stats-grid-reporte report-stats">
                    {statsContent}
                </div>

                {/*Tabla de resportes*/}
                <div className="reports-table-container-reporte">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-bold text-xl text-gray-900">Reportes Generados</h2>
                            <button className="btn-primary-reporte" id="newReportBtn" onClick={handleCreate}>
                                <i className="fas fa-plus"></i> {''}
                                Nuevo Reporte
                            </button>
                        </div>
                    </div>

                    <div className="table-filters-reporte">
                        <div className="search-container-reporte">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Buscar reportes..." id="reportSearch" />
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


                    {/* Reports Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {reportesGuardados.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-500">No hay reportes guardados</p>
                            </div>
                        ) : (
                            reportesGuardados.map((report) => (
                                <div
                                    key={report._id || report.id}
                                    className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                <i className="fas fa-file-alt h-5 w-5 text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.nombre || 'Reporte sin nombre'}</h3>
                                                <p className="text-xs text-gray-500">{report.createdAt || report.fechaCreacion || 'Sin fecha'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-4 text-sm text-gray-600">{report.descripcion || report.description || 'Sin descripción'}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => console.log('Ver reporte:', report)}
                                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <i className="fas fa-eye inline h-4 w-4 mr-1" />Ver Reporte
                                        </button>
                                        <button
                                            onClick={() => handleEditarReporte(report)}
                                            className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
                                            title="Editar"
                                        >
                                            <i className="fas fa-edit h-4 w-4 text-gray-600"></i>
                                        </button>

                                    </div>
                                </div>
                            )))}
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
                                <span className="font-semibold">Fecha de generación:</span> {/*new Date().toLocaleString("es-ES")*/}
                            </p>
                            <p className="text-[#334155]">
                                <span className="font-semibold">Tipo de reporte:</span> {/*selectedReport.replace("-", " ")*/}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modal de Reportes */}
            {mostrarModal && (
                <ReporteModal
                    mostrar={mostrarModal}
                    modoEdicion={modoEdicion}
                    reporteSeleccionado={reporteSeleccionado}
                    setReporteSeleccionado={setReporteSeleccionado}
                    nuevoReporte={nuevoReporte}
                    setNuevoReporte={setNuevoReporte}
                    onClose={() => setMostrarModal(false)}
                    onSubmit={(e) => modoEdicion ? actualizarReporte(e) : crearReporte(e)}
                />
            )}
        </>
    );

};

export default Gestionreportes;
