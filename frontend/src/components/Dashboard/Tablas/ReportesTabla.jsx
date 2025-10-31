import { useState, useMemo } from "react"
import {
  Users,
  Bed,
  UserPlus,
  Calendar,
  FileText,
  Home,
  Search,
  TrendingUp,
  PieChartIcon,
  BarChart3,
  X,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil
} from "lucide-react"
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



const REPORT_TYPES = [
  { value: "usuarios", label: "Usuarios", icon: Users },
  { value: "inscripciones", label: "Inscripciones", icon: UserPlus },
  { value: "reservas", label: "Reservas", icon: Bed },
  { value: "eventos", label: "Eventos", icon: Calendar },
  { value: "solicitudes", label: "Solicitudes", icon: FileText },
  { value: "programas", label: "Programas Académicos", icon: BarChart3 },
  { value: "certificaciones", label: "Certificaciones", icon: FileText },
  { value: "tareas", label: "Tareas", icon: FileText },
  { value: "cabanas", label: "Cabañas", icon: Home },
  { value: "notificaciones", label: "Notificaciones", icon: FileText },
]
const generateChartData = (activeReport) => {
  if (!activeReport || !activeReport.datos) return { trend: [], distribution: [] };
  const est = activeReport.datos.estadisticas || {};

  // Si no hay estadísticas pre-calculadas, intentar generar desde los datos directos
  if (!est || Object.keys(est).length === 0) {
    return generateChartsFromRawData(activeReport);
  }

  // Distribución - buscar cualquier tipo de distribución disponible
  let distribution = [];
  if (est.porRol) {
    distribution = est.porRol.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porEstado) {
    distribution = est.porEstado.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porCategoria) {
    distribution = est.porCategoria.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porEvento) {
    distribution = est.porEvento.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porReferencia) {
    distribution = est.porReferencia.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porTipoReferencia) {
    distribution = est.porTipoReferencia.map(e => ({ name: e._id, value: e.count }));
  } else if (est.porTipo) {
    distribution = est.porTipo.map(e => ({ name: e._id, value: e.count }));
  }

  // Tendencia - buscar cualquier tipo de tendencia temporal disponible
  let trend = [];
  if (est.registrosPorMes) {
    trend = est.registrosPorMes.map(e => ({
      mes: e._id.mes ? `${e._id.mes}/${e._id.año}` : e._id,
      total: e.count
    }));
  } else if (est.registrosPorFecha) {
    trend = est.registrosPorFecha.map(e => ({
      mes: e._id,
      total: e.count
    }));
  }
  return { trend, distribution };
};

// Función auxiliar para generar gráficas desde datos directos cuando no hay estadísticas
const generateChartsFromRawData = (activeReport) => {
  const datos = activeReport.datos;
  let dataArray = [];


  // Identificar el array de datos según el tipo de reporte
  const tipoReporte = activeReport.tipo || activeReport.type;

  if (datos.usuarios) {
    dataArray = datos.usuarios;
  } else if (datos.inscripciones) {
    dataArray = datos.inscripciones;
  } else if (datos.reservas) {
    dataArray = datos.reservas;
  } else if (datos.eventos) {
    dataArray = datos.eventos;
  } else if (datos.solicitudes) {
    dataArray = datos.solicitudes;
  } else if (Array.isArray(datos)) {
    dataArray = datos;
   
  }

  if (!dataArray || dataArray.length === 0) {

    return { trend: [], distribution: [] };
  }


  // Generar distribución basada en el tipo de reporte
  let distribution = [];

  if (tipoReporte === 'usuarios') {
    // Distribución por rol
    const roleCount = {};
    dataArray.forEach(user => {
      const role = user.rol || user.role || user.roles?.[0] || 'Sin rol';
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    distribution = Object.entries(roleCount).map(([name, value]) => ({ name, value }));
  
  } else if (tipoReporte === 'eventos') {
    // Distribución por estado activo/inactivo
    const statusCount = { 'Activos': 0, 'Inactivos': 0 };
    dataArray.forEach(evento => {
      if (evento.active || evento.activo) {
        statusCount['Activos'] += 1;
      } else {
        statusCount['Inactivos'] += 1;
      }
    });
    distribution = Object.entries(statusCount)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
   
  } else if (tipoReporte === 'reservas') {
    // Distribución por estado
    const statusCount = {};
    dataArray.forEach(reserva => {
      const status = reserva.estado || reserva.status || 'Sin estado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    distribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    
  } else if (tipoReporte === 'inscripciones') {
    // Distribución por referencia (programa o evento)
    const programCount = {};
    dataArray.forEach(inscripcion => {
      const programa = inscripcion.referencia?.name || inscripcion.referencia?.nombre || inscripcion.programa || inscripcion.evento?.name || inscripcion.evento?.nombre || 'Sin referencia';
      programCount[programa] = (programCount[programa] || 0) + 1;
    });
    distribution = Object.entries(programCount).map(([name, value]) => ({ name, value }));
  
  } else if (tipoReporte === 'solicitudes') {
    // Distribución por estado
    const statusCount = {};
    dataArray.forEach(solicitud => {
      const status = solicitud.estado || 'Sin estado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    distribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  } else if (tipoReporte === 'cabañas' || tipoReporte === 'cabanas') {
    // Distribución por disponibilidad
    const statusCount = {};
    dataArray.forEach(cabana => {
      const status = cabana.disponible ? 'Disponibles' : 'No disponibles';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    distribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    
  } else if (tipoReporte === 'tareas') {
    // Distribución por estado
    const statusCount = {};
    dataArray.forEach(tarea => {
      const status = tarea.estado || tarea.completada ? 'Completadas' : 'Pendientes';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    distribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
   
  } else if (tipoReporte === 'programas') {
    // Distribución por estado activo/inactivo
    const statusCount = { 'Activos': 0, 'Inactivos': 0 };
    dataArray.forEach(programa => {
      if (programa.activo) {
        statusCount['Activos'] += 1;
      } else {
        statusCount['Inactivos'] += 1;
      }
    });
    distribution = Object.entries(statusCount)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  
  }

  // Generar tendencia basada en fechas
  let trend = [];
  const monthCount = {};

  dataArray.forEach(item => {
    let date = null;

    // Intentar diferentes campos de fecha según el tipo de datos
    if (item.fechaEvento) date = new Date(item.fechaEvento);
    else if (item.createdAt) date = new Date(item.createdAt);
    else if (item.fechaRegistro) date = new Date(item.fechaRegistro);
    else if (item.fecha) date = new Date(item.fecha);
    else if (item.fechaInicio) date = new Date(item.fechaInicio);

    if (date && !isNaN(date.getTime())) {
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
    }
  });

  trend = Object.entries(monthCount)
    .sort(([a], [b]) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      return aYear - bYear || aMonth - bMonth;
    })
    .map(([mes, total]) => ({ mes, total }));



  return { trend, distribution };
};

const TablaReportes = ({ reportesGuardados, editarReporte, eliminarReporte }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [reportFilters, setReportFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    search: "",
  })
  const [savedReports, setSavedReports] = useState()
  const [activeReport, setActiveReport] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [alertaDatos, setAlertaDatos] = useState("")
  const itemsPerPage = 5

  const filteredData = useMemo(() => {
    if (!activeReport) return [];


    let data = [];
    if (activeReport.datos) {
      if (activeReport.datos.reservas) {
        data = activeReport.datos.reservas;
      } else if (activeReport.datos.inscripciones) {
        data = activeReport.datos.inscripciones;
      } else if (activeReport.datos.usuarios) {
        data = activeReport.datos.usuarios;
      } else if (activeReport.datos.eventos) {
        data = activeReport.datos.eventos;
      } else if (activeReport.datos.solicitudes) {
        data = activeReport.datos.solicitudes;
      } else if (activeReport.datos.cabanas) {
        data = activeReport.datos.cabanas;
      } else if (activeReport.datos.tareas) {
        data = activeReport.datos.tareas;
      } else if (activeReport.datos.certificaciones) {
        data = activeReport.datos.certificaciones;
      } else if (activeReport.datos.notificaciones) {
        data = activeReport.datos.notificaciones;
      } else if (Array.isArray(activeReport.datos)) {
        data = activeReport.datos;
      }
    }

    return data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [activeReport, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleCreateReport = () => {
    if (!selectedReportType) return

    const newReport = {
      id: savedReports.length + 1,
      name: `Reporte de ${REPORT_TYPES.find((t) => t.value === selectedReportType)?.label}`,
      type: selectedReportType,
      description: `Reporte generado automáticamente`,
      filters: reportFilters,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Admin",
    }

    setSavedReports([...savedReports, newReport])
    setActiveReport(newReport)
    setShowCreateModal(false)
    setSelectedReportType("")
    setReportFilters({ dateFrom: "", dateTo: "", status: "", search: "" })
  }

  const handleExportPDF = () => {
    alert("Exportando a PDF...")
  }

  const handleExportExcel = () => {
    alert("Exportando a Excel...")
  }

  const COLORS = ["#2563eb", "#8b5cf6", "#059669", "#f59e0b", "#ef4444"]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">{/* Sidebar removido temporalmente */}



        <main className="p-6">

          {activeReport && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{activeReport.name}</h2>
                  <p className="text-sm text-gray-600">{activeReport.description}</p>
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
                          {Object.keys(paginatedData[0] || {}).map((key) => (
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
                        {paginatedData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIdx) => (
                              <td key={cellIdx} className="px-4 py-3 text-sm text-gray-900">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Tarjetas responsive para móvil */}
                    <div className="md:hidden">
                      {paginatedData.map((row, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow p-3 mb-2 border">
                          {Object.entries(row).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 text-sm">
                              <span className="font-semibold text-gray-700">{key}:</span>
                              <span className="text-gray-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
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
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Trend Chart */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Tendencia</h3>
                  </div>
                  {generateChartData(activeReport).trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={generateChartData(activeReport).trend}>
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
                  {generateChartData(activeReport).distribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={generateChartData(activeReport).distribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {generateChartData(activeReport).distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          )}

          {/* Saved Reports Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-xl text-gray-900">Reportes Generados</h2>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">


              {reportesGuardados.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const ReportIcon = REPORT_TYPES.find((t) => t.value === report.type)?.icon || FileText
                        return (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <ReportIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        )
                      })()}
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.nombre}</h3>
                        <p className="text-xs text-gray-500">{report.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">{report.description}</p>
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
                      <Eye className="inline h-4 w-4 mr-1" />
                      Ver Reporte
                    </button>
                    <button
                      onClick={() => {editarReporte(report);}}
                      className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4 text-gray-600 hover:text-yellow-600" />
                    </button>
                    <button
                      onClick={() => eliminarReporte && eliminarReporte(report._id || report.id)}
                      className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                  {/* Alerta de datos */}
                  {alertaDatos && activeReport && activeReport.id === report.id && (
                    <div className="mt-3 p-2 rounded bg-yellow-100 text-yellow-800 text-sm">
                      {alertaDatos}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-2xl text-gray-900">Crear Nuevo Reporte</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Report Type Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Reporte</label>
                <div className="grid gap-3 md:grid-cols-2">
                  {REPORT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedReportType(type.value)}
                        className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${selectedReportType === type.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedReportType === type.value ? "bg-blue-600" : "bg-gray-100"
                            }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${selectedReportType === type.value ? "text-white" : "text-gray-600"}`}
                          />
                        </div>
                        <span className="font-medium text-gray-900">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Filters */}
              {selectedReportType && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Filtros</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
                      <input
                        type="date"
                        value={reportFilters.dateFrom}
                        onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
                      <input
                        type="date"
                        value={reportFilters.dateTo}
                        onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                      <select
                        value={reportFilters.status}
                        onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Todos</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="pendiente">Pendiente</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={!selectedReportType}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default TablaReportes;
