import React from "react"
import {
  Users,
  Bed,
  UserPlus,
  Calendar,
  FileText,
  Home,
  BarChart3,
  Eye,
  Trash2,
  Pencil
} from "lucide-react"

import PropTypes from "prop-types";

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


const TablaReportes = ({ reportesGuardados, editarReporte, eliminarReporte, onVerDetalles }) => {
  return (
    <div className="flex-1">
      <main>
        {/* Saved Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#334155]">Reportes Generados</h3>
          </div>
          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportesGuardados.map((report) => (
              <div
                key={report._id || report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const ReportIcon = REPORT_TYPES.find((t) => t.value === report.tipo)?.icon || FileText
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
                    onClick={() => onVerDetalles && onVerDetalles(report)}
                    className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Eye className="inline h-4 w-4 mr-1" />
                    Ver Detalles
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
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


TablaReportes.propTypes = {
  reportesGuardados: PropTypes.array.isRequired,
  editarReporte: PropTypes.func.isRequired,
  eliminarReporte: PropTypes.func,
  onVerDetalles: PropTypes.func,
};

export default TablaReportes;
