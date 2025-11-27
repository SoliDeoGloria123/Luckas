import React, { useState, useEffect } from "react";
import { reporteService } from '../../../services/reporteService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import ReporteModal from '../../Dashboard/Modales/ReporteModal';
import '../Gestion.css';

const Gestionreportes = () => {

    const [dashboardData, setDashboardData] = useState(null);

    // Mantener referencia para evitar warning de variable no usada
    useEffect(() => {
        // dashboardData puede ser útil para debugging o futuros usos
        // no-op intencional para satisfacer linter cuando no se usa directamente
    }, [dashboardData]);
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
    const [estadisticas, setEstadisticas] = useState({ totalUsuarios: 0, totalReservas: 0, totalInscripciones: 0, totalSolicitudes: 0, totalEventos: 0, totalTareas: 0, totalCabanas: 0 });


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
            obtenerestadisticas();
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
        setMostrarModal(true);
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
    const crearReporte = async (payload) => {
        try {
            if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
            const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevoReporte;
            await reporteService.guardarReporte(body);
            mostrarAlerta("¡Éxito!", "Reporte creado exitosamente", 'success');
            setMostrarModal(false);
            cargarReportesGuardados();
        } catch (error) {
            mostrarAlerta("ERROR", `Error al crear reporte: ${error.message}`, 'error');
        }
    };

    const actualizarReporte = async (payload) => {
        try {
            if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
            const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevoReporte;
            const id = (body && body._id) ? body._id : (reporteSeleccionado && reporteSeleccionado._id);
            if (!id) {
                mostrarAlerta('ERROR', 'No se encontró el ID del reporte a actualizar', 'error');
                return;
            }
            await reporteService.editarReporte(id, body);
            mostrarAlerta("¡Éxito!", "Reporte actualizado exitosamente", 'success');
            setMostrarModal(false);
            cargarReportesGuardados();
            setModoEdicion(false);
            setReporteSeleccionado(null);
        } catch (error) {
            mostrarAlerta("ERROR", `Error al actualizar reporte: ${error.message}`, 'error');
        }
    };

    //obtener las estadisticas 
    const obtenerestadisticas = async () => {
        try {
            const resp = await reporteService.estadisticasreportes();
            const payload = resp && resp.data ? resp.data : resp;
            setEstadisticas(payload || {});
        } catch (error) {
            console.error("ERROR", `Error al obtener estadísticas: ${error.message}`, 'error');
        }
    }


    // Construir la sección de estadísticas siempre (usar 0 por defecto si no hay datos)

    const statsContent = (
        <>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Usuarios Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalUsuarios || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Reservas Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalReservas || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Inscripciones Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalInscripciones || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Eventos Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalEventos || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Solicitudes Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalSolicitudes || 0}</div>
            </div>
            <div className="stat-card-reporte">
                <div className="stat-header-reporte">
                    <h4>Cabañas Totales</h4>
                </div>
                <div className="stat-number-reporte">{estadisticas.totalCabanas || 0}</div>
            </div>
        </>
    );

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
                            <h1>Sistema de Reportes</h1>
                            <p>Generar informes del sistema</p>
                        </div>
                    </div>

                    <button className="btn-primary-tesorero" id="newReportBtn" onClick={handleCreate}>
                        <i className="fas fa-plus"></i> {' '}
                        Nuevo Reporte
                    </button>
                </div>
                <div className="stats-grid-reporte report-stats">
                    {statsContent}
                </div>

                {/*Tabla de resportes*/}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6    ">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-gray-900">Reportes Generados</h3>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Buscar reportes..."
                                //value={searchQuery}
                                //onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <select
                            //value={filterType}
                            //onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                        >
                            <option value="todos">Todos los tipos</option>
                            <option value="dashboard">Dashboard</option>
                            <option value="usuarios">Usuarios</option>
                            <option value="inscripciones">Inscripciones</option>
                        </select>
                        <select
                            //value={filterStatus}
                            //onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="completado">Completado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="error">Error</option>
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
                    datosIniciales={reporteSeleccionado}
                    modoEdicion={modoEdicion}
                    onClose={() => setMostrarModal(false)}
                    onSubmit={(payload) => modoEdicion ? actualizarReporte(payload) : crearReporte(payload)}
                />
            )}
        </>
    );

};

export default Gestionreportes;
