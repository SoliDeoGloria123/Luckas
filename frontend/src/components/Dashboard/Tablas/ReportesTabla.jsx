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
  Download,
FileSpreadsheet
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
  ResponsiveContainer,
} from "recharts"

const MOCK_DATA = {
  usuarios: [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      rol: "Administrador",
      estado: "Activo",
      fechaRegistro: "2025-01-15",
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@example.com",
      rol: "Usuario",
      estado: "Activo",
      fechaRegistro: "2025-02-20",
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos@example.com",
      rol: "Usuario",
      estado: "Inactivo",
      fechaRegistro: "2025-01-10",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana@example.com",
      rol: "Moderador",
      estado: "Activo",
      fechaRegistro: "2025-03-05",
    },
    {
      id: 5,
      nombre: "Pedro Sánchez",
      email: "pedro@example.com",
      rol: "Usuario",
      estado: "Activo",
      fechaRegistro: "2025-02-28",
    },
  ],
  inscripciones: [
    {
      id: 1,
      estudiante: "Juan Pérez",
      programa: "Administración de Empresas",
      fecha: "2025-01-15",
      estado: "Confirmada",
      monto: "$350",
    },
    {
      id: 2,
      estudiante: "María García",
      programa: "Pintura al Óleo",
      fecha: "2025-02-20",
      estado: "Pendiente",
      monto: "$120",
    },
    {
      id: 3,
      estudiante: "Carlos López",
      programa: "Inglés Conversacional",
      fecha: "2025-01-10",
      estado: "Confirmada",
      monto: "$200",
    },
    {
      id: 4,
      estudiante: "Ana Martínez",
      programa: "Yoga y Meditación",
      fecha: "2025-03-05",
      estado: "Confirmada",
      monto: "$80",
    },
    {
      id: 5,
      estudiante: "Pedro Sánchez",
      programa: "Administración de Empresas",
      fecha: "2025-02-28",
      estado: "Cancelada",
      monto: "$350",
    },
  ],
  reservas: [
    {
      id: 1,
      cliente: "Juan Pérez",
      cabaña: "Cabaña del Bosque",
      fechaInicio: "2025-03-15",
      fechaFin: "2025-03-20",
      estado: "Confirmada",
      total: "$450",
    },
    {
      id: 2,
      cliente: "María García",
      cabaña: "Cabaña del Lago",
      fechaInicio: "2025-04-01",
      fechaFin: "2025-04-05",
      estado: "Pendiente",
      total: "$380",
    },
    {
      id: 3,
      cliente: "Carlos López",
      cabaña: "Cabaña de la Montaña",
      fechaInicio: "2025-02-10",
      fechaFin: "2025-02-15",
      estado: "Completada",
      total: "$520",
    },
    {
      id: 4,
      cliente: "Ana Martínez",
      cabaña: "Cabaña del Bosque",
      fechaInicio: "2025-05-20",
      fechaFin: "2025-05-25",
      estado: "Confirmada",
      total: "$450",
    },
  ],
  eventos: [
    {
      id: 1,
      nombre: "Taller de Liderazgo",
      fecha: "2025-03-25",
      ubicacion: "Auditorio Principal",
      asistentes: 45,
      estado: "Programado",
    },
    {
      id: 2,
      nombre: "Conferencia de Innovación",
      fecha: "2025-04-10",
      ubicacion: "Sala de Conferencias",
      asistentes: 120,
      estado: "Programado",
    },
    {
      id: 3,
      nombre: "Retiro Espiritual",
      fecha: "2025-02-15",
      ubicacion: "Centro de Retiros",
      asistentes: 30,
      estado: "Completado",
    },
    {
      id: 4,
      nombre: "Seminario de Finanzas",
      fecha: "2025-05-05",
      ubicacion: "Auditorio Principal",
      asistentes: 80,
      estado: "Programado",
    },
  ],
  solicitudes: [
    {
      id: 1,
      solicitante: "Juan Pérez",
      tipo: "Certificado",
      fecha: "2025-02-20",
      estado: "Pendiente",
      prioridad: "Alta",
    },
    {
      id: 2,
      solicitante: "María García",
      tipo: "Constancia",
      fecha: "2025-02-22",
      estado: "Aprobada",
      prioridad: "Media",
    },
    {
      id: 3,
      solicitante: "Carlos López",
      tipo: "Reembolso",
      fecha: "2025-02-18",
      estado: "Rechazada",
      prioridad: "Baja",
    },
    {
      id: 4,
      solicitante: "Ana Martínez",
      tipo: "Certificado",
      fecha: "2025-02-25",
      estado: "Pendiente",
      prioridad: "Alta",
    },
  ],
  programas: [
    {
      id: 1,
      nombre: "Administración de Empresas",
      categoria: "Técnico",
      duracion: "16 semanas",
      inscritos: 25,
      estado: "Activo",
    },
    { id: 2, nombre: "Pintura al Óleo", categoria: "Arte", duracion: "10 semanas", inscritos: 15, estado: "Activo" },
    {
      id: 3,
      nombre: "Inglés Conversacional",
      categoria: "Idiomas",
      duracion: "12 semanas",
      inscritos: 30,
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Yoga y Meditación",
      categoria: "Bienestar",
      duracion: "6 semanas",
      inscritos: 20,
      estado: "Activo",
    },
  ],
  certificaciones: [
    {
      id: 1,
      estudiante: "Juan Pérez",
      programa: "Administración de Empresas",
      fechaEmision: "2025-02-28",
      codigo: "CERT-2025-001",
      estado: "Emitido",
    },
    {
      id: 2,
      estudiante: "María García",
      programa: "Pintura al Óleo",
      fechaEmision: "2025-03-05",
      codigo: "CERT-2025-002",
      estado: "Emitido",
    },
    {
      id: 3,
      estudiante: "Carlos López",
      programa: "Inglés Conversacional",
      fechaEmision: "2025-02-20",
      codigo: "CERT-2025-003",
      estado: "Emitido",
    },
  ],
  tareas: [
    {
      id: 1,
      titulo: "Revisar solicitudes",
      asignado: "Admin",
      fechaVencimiento: "2025-03-01",
      estado: "Pendiente",
      prioridad: "Alta",
    },
    {
      id: 2,
      titulo: "Actualizar base de datos",
      asignado: "Admin",
      fechaVencimiento: "2025-03-05",
      estado: "En Progreso",
      prioridad: "Media",
    },
    {
      id: 3,
      titulo: "Preparar informe mensual",
      asignado: "Admin",
      fechaVencimiento: "2025-02-28",
      estado: "Completada",
      prioridad: "Alta",
    },
  ],
  cabanas: [
    { id: 1, nombre: "Cabaña del Bosque", capacidad: 4, precio: "$90/noche", estado: "Disponible", reservasActivas: 2 },
    { id: 2, nombre: "Cabaña del Lago", capacidad: 6, precio: "$120/noche", estado: "Disponible", reservasActivas: 1 },
    {
      id: 3,
      nombre: "Cabaña de la Montaña",
      capacidad: 8,
      precio: "$150/noche",
      estado: "Ocupada",
      reservasActivas: 1,
    },
  ],
  notificaciones: [
    {
      id: 1,
      titulo: "Nueva inscripción",
      mensaje: "Juan Pérez se inscribió en Administración",
      fecha: "2025-02-28",
      tipo: "Info",
      leida: false,
    },
    {
      id: 2,
      titulo: "Solicitud pendiente",
      mensaje: "Tienes 2 solicitudes pendientes de revisión",
      fecha: "2025-02-27",
      tipo: "Alerta",
      leida: false,
    },
    {
      id: 3,
      titulo: "Evento próximo",
      mensaje: "Taller de Liderazgo en 3 días",
      fecha: "2025-02-26",
      tipo: "Recordatorio",
      leida: true,
    },
  ],
}

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

const generateChartData = (reportType) => {
  switch (reportType) {
    case "usuarios":
      return {
        trend: [
          { mes: "Ene", total: 12 },
          { mes: "Feb", total: 18 },
          { mes: "Mar", total: 25 },
          { mes: "Abr", total: 32 },
          { mes: "May", total: 28 },
          { mes: "Jun", total: 35 },
        ],
        distribution: [
          { name: "Administrador", value: 2 },
          { name: "Moderador", value: 3 },
          { name: "Usuario", value: 20 },
        ],
      }
    case "inscripciones":
      return {
        trend: [
          { mes: "Ene", total: 15 },
          { mes: "Feb", total: 22 },
          { mes: "Mar", total: 28 },
          { mes: "Abr", total: 35 },
          { mes: "May", total: 30 },
          { mes: "Jun", total: 40 },
        ],
        distribution: [
          { name: "Confirmada", value: 45 },
          { name: "Pendiente", value: 12 },
          { name: "Cancelada", value: 8 },
        ],
      }
    case "reservas":
      return {
        trend: [
          { mes: "Ene", total: 8 },
          { mes: "Feb", total: 12 },
          { mes: "Mar", total: 15 },
          { mes: "Abr", total: 20 },
          { mes: "May", total: 18 },
          { mes: "Jun", total: 25 },
        ],
        distribution: [
          { name: "Confirmada", value: 30 },
          { name: "Pendiente", value: 10 },
          { name: "Completada", value: 25 },
        ],
      }
    default:
      return {
        trend: [],
        distribution: [],
      }
  }
}

const TablaReportes = ({ reportesGuardados , editarReporte, eliminarReporte }) => {
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
  const itemsPerPage = 5

  const filteredData = useMemo(() => {
    if (!activeReport) return []
    const data = MOCK_DATA[activeReport.type] || []
    return data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [activeReport, searchTerm])

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
         <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900 mb-2">Sistema de Reportes</h1>
              <p className="text-gray-600">Genera y administra reportes del sistema</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar Excel
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Nuevo Reporte
              </button>
            </div>
          </div>


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
                <table className="w-full">
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
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateChartData(activeReport.type).trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Distribution Chart */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Distribución</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={generateChartData(activeReport.type).distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {generateChartData(activeReport.type).distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Saved Reports Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-xl text-gray-900">Reportes Guardados</h2>
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
                        setActiveReport(report)
                        setCurrentPage(1)
                        setSearchTerm("")
                      }}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="inline h-4 w-4 mr-1" />
                      Ver Reporte
                    </button>
                    <button
                      onClick={() => setSavedReports(savedReports.filter((r) => r.id !== report.id))}
                      className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
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
                        className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                          selectedReportType === type.value
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            selectedReportType === type.value ? "bg-blue-600" : "bg-gray-100"
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
