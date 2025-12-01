import React, { useState, useEffect, useMemo } from "react";
import { FileText, X, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
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
} from "recharts";
import { MobileCard } from '../../Dashboard/Tablas/commonComponents';
import { extraerDataArray, generateChartData } from '../../Dashboard/Tablas/reportHelpers';
import Pagination from '../../Dashboard/Shared/Pagination';
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

    // Estados para visualización de reporte
    const [activeReport, setActiveReport] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    // Estados para filtros y buscador en la sección de listados (no confundir con búsqueda dentro del modal)
    const [searchQuery, setSearchQuery] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [alertaDatos, setAlertaDatos] = useState("");
    const itemsPerPage = 5;
    const COLORS = ["#2563eb", "#8b5cf6", "#059669", "#f59e0b", "#ef4444"];

    // Memoizar chartData para evitar cálculos repetidos
    const chartData = useMemo(() => generateChartData(activeReport), [activeReport]);

    // Tipos y estados disponibles para los selects (derivados de los reportes cargados)
    const tiposDisponibles = useMemo(() => {
        const s = new Set();
        for (const r of reportesGuardados) {
            const t = r && (r.tipo || r.type);
            if (t) s.add(t);
        }
        return s;
    }, [reportesGuardados]);

    const estadosDisponibles = useMemo(() => {
        const s = new Set();
        for (const r of reportesGuardados) {
            const e = r && (r.estado || r.status);
            if (e) s.add(e);
        }
        return s;
    }, [reportesGuardados]);

    // Reportes filtrados por buscador y selects de tipo/estado
    const filteredReportes = useMemo(() => {
        const q = (searchQuery || '').toLowerCase().trim();
        return reportesGuardados.filter((r) => {
            if (!r) return false;
            const tipo = (r.tipo || r.type || '').toString();
            const estado = (r.estado || r.status || '').toString();

            if (filtroTipo && filtroTipo !== 'todos' && tipo !== filtroTipo) return false;
            if (filtroEstado && filtroEstado !== 'todos' && estado !== filtroEstado) return false;

            if (!q) return true;
            const nombre = (r.nombre || '').toString().toLowerCase();
            const descripcion = (r.descripcion || r.description || '').toString().toLowerCase();
            return nombre.includes(q) || descripcion.includes(q);
        });
    }, [reportesGuardados, filtroTipo, filtroEstado, searchQuery]);

    const filteredData = useMemo(() => {
        if (!activeReport) return [];
        const datos = activeReport.datos || {};
        const data = extraerDataArray(datos);

        return data.filter((item) =>
            Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeReport, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


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



    // Función para editar reporte
    const handleEditarReporte = (reporte) => {
        setReporteSeleccionado(reporte);
        setModoEdicion(true);
        setMostrarModal(true);
    };


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
            mostrarAlerta("Error", `Error al crear reporte: ${error.message}`, 'error');
        }
    };

    const actualizarReporte = async (payload) => {
        try {
            if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
            const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevoReporte;
            const id = (body && body._id) ? body._id : (reporteSeleccionado && reporteSeleccionado._id);
            if (!id) {
                mostrarAlerta('Error', 'No se encontró el ID del reporte a actualizar', 'error');
                return;
            }
            await reporteService.editarReporte(id, body);
            mostrarAlerta("¡Éxito!", "Reporte actualizado exitosamente", 'success');
            setMostrarModal(false);
            cargarReportesGuardados();
            setModoEdicion(false);
            setReporteSeleccionado(null);
        } catch (error) {
            mostrarAlerta("Error", `Error al actualizar reporte: ${error.message}`, 'error');
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
                <div className="filters-section-tesorero">
                    <div className="search-filters-tesorero">
                        <div className="search-input-container-tesorero">
                            <div className="search-input-container-tesorero">
                                <i className="fas fa-search" />
                                <input
                                    type="text"
                                    placeholder="Buscar reportes..."
                                    id="userSearch"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                            </div>
                        </div>
                        <select
                             className="filter-select"
                            value={filtroTipo}
                            onChange={(e) => { setFiltroTipo(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="todos">Todos los Tipos</option>
                            {Array.from(tiposDisponibles).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select
                            className="filter-select"
                            value={filtroEstado}
                            onChange={(e) => { setFiltroEstado(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="todos">Todos los Estados</option>
                            {Array.from(estadosDisponibles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                
                </div>
                {/*Tabla de resportes*/}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6    ">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-gray-900">Reportes Generados</h3>
                    </div>


                    {/* Reports Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReportes.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-500">No hay reportes guardados</p>
                            </div>
                        ) : (
                            filteredReportes.map((report) => (
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
                                            onClick={() => {
                                                // Validar si el reporte tiene datos reales o error
                                                let alerta = "";
                                                if (report.datos) {
                                                    if (typeof report.datos === "object" && report.datos.mensaje === "Tipo de reporte no soportado") {
                                                        alerta = "Este reporte no se pudo generar: Tipo de reporte no soportado.";
                                                    } else if (
                                                        (Array.isArray(report.datos) && report.datos.length === 0) ||
                                                        (typeof report.datos === "object" && Object.keys(report.datos).length === 0)
                                                    ) {
                                                        alerta = "No existen datos para los filtros seleccionados.";
                                                    }
                                                } else {
                                                    alerta = "No existen datos para los filtros seleccionados.";
                                                }
                                                setAlertaDatos(alerta);
                                                setActiveReport(report);
                                                setCurrentPage(1);
                                                setSearchTerm("");
                                            }}
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

                    {/* Data Table Modal / Section */}
                    {activeReport && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-10">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{activeReport.nombre}</h2>
                                        <p className="text-sm text-gray-500">{activeReport.descripcion}</p>
                                    </div>
                                    <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="h-6 w-6 text-gray-500" />
                                    </button>
                                </div>

                                {/* Alerta de datos */}
                                {alertaDatos && (
                                    <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-sm">
                                        {alertaDatos}
                                    </div>
                                )}

                                {/* Search */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar en resultados..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Charts */}
                                <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
                                    {filteredData.length > 0 ? (
                                        <>
                                            <table className="hidden md:table w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {Object.keys(paginatedData[0] || {})
                                                            .filter(key => key !== '_id' && key !== '__v' && key !== 'usuario')
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
                                                            <tr key={rowKey} className="hover:bg-gray-50 transition-colors">
                                                                {Object.keys(row)
                                                                    .filter(key => key !== '_id' && key !== '__v' && key !== 'usuario')
                                                                    .map((key, cellIdx) => (
                                                                        <td key={`${rowKey}-${cellIdx}`} className="px-4 py-3 text-sm text-gray-900">
                                                                            {typeof row[key] === 'object' && row[key] !== null
                                                                                ? JSON.stringify(row[key])
                                                                                : String(row[key])}
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
                                                    return <MobileCard key={rowKey} row={row} idx={idx} />;
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
                                <div className="flex items-center justify-between">
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

                                <div className="grid gap-6 md:grid-cols-2 mb-6">
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
