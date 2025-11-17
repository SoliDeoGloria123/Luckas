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
import PropTypes from "prop-types";
import { generateChartData, extraerDataArray } from './reportHelpers';
import { TableRow, MobileCard } from './commonComponents';
import Pagination from '../Shared/Pagination';
import SearchAndFilters from '../Shared/SearchAndFilters';
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
// Helpers y lógica de generación de datos han sido extraídos a `reportHelpers.js`
// `generateChartData` y `extraerDataArray` se importan arriba.

// Componentes `TableRow` y `MobileCard` movidos a `commonComponents.js` para evitar duplicación entre tablas

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
  // Estados para búsqueda/filtrado de la sección "Reportes Generados"
  const [savedSearch, setSavedSearch] = useState("")
  const [savedFilterType, setSavedFilterType] = useState("todos")
  const [savedFilterStatus, setSavedFilterStatus] = useState("todos")
  // Memoizar chartData para evitar cálculos repetidos
  const chartData = useMemo(() => generateChartData(activeReport), [activeReport]);

  const filteredData = useMemo(() => {
    if (!activeReport) return [];
    const datos = activeReport.datos || {};
    const data = extraerDataArray(datos);

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
      id: (savedReports?.length ?? 0) + 1,
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

  const COLORS = ["#2563eb", "#8b5cf6", "#059669", "#f59e0b", "#ef4444"]

  

  return (
    <>
      <div className="flex-1">{/* Sidebar removido temporalmente */}
        <main>
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
                        {paginatedData.map((row, idx) => {
                          const rowKey = row._id || row.id || Object.values(row).join('-') + '-' + idx;
                          return <TableRow key={rowKey} row={row} idx={idx} />;
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
          )}

          {/* Saved Reports Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#334155]">Reportes Generados</h3>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Reporte
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <SearchAndFilters
                searchPlaceholder="Buscar reportes..."
                searchValue={savedSearch}
                onSearchChange={(e) => setSavedSearch(e.target.value)}
                filters={[
                  {
                    value: savedFilterType,
                    onChange: (e) => setSavedFilterType(e.target.value),
                    options: [
                      { value: 'todos', label: 'Todos los tipos' },
                      { value: 'dashboard', label: 'Dashboard' },
                      { value: 'usuarios', label: 'Usuarios' },
                      { value: 'inscripciones', label: 'Inscripciones' },
                    ]
                  },
                  {
                    value: savedFilterStatus,
                    onChange: (e) => setSavedFilterStatus(e.target.value),
                    options: [
                      { value: 'todos', label: 'Todos los estados' },
                      { value: 'completado', label: 'Completado' },
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'error', label: 'Error' },
                    ]
                  }
                ]}
              />
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportesGuardados.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#334155] mb-1">{report.nombre}</h4>
                        <p className="text-sm text-gray-500"> {new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">{report.descripcion}</p>
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {report.estado}
                    </span>
                  </div>

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
                      className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="inline h-4 w-4 mr-1" />
                      Ver Reporte
                    </button>
                    <button
                      onClick={() => { editarReporte(report); }}
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
                <label htmlFor="reportType" className="mb-2 block text-sm font-medium text-gray-700">Tipo de Reporte</label>
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
                      <label htmlFor="dateFrom" className="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
                      <input
                        type="date"
                        id="dateFrom"
                        value={reportFilters.dateFrom}
                        onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateTo" className="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
                      <input
                        type="date"
                        id="dateTo"
                        value={reportFilters.dateTo}
                        onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                      <select
                        id="status"
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
    </>

 
  )
}
TablaReportes.propTypes = {
  reportesGuardados: PropTypes.array.isRequired,
  editarReporte: PropTypes.func.isRequired,
  eliminarReporte: PropTypes.func,
};

export default TablaReportes;
