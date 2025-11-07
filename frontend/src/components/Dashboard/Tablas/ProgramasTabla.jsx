import React from 'react';
import PropTypes from "prop-types";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';

const ProgramasTabla = ({
  programas = [],
  abrirModalEditar,
  eliminarPrograma,
  formatearPrecio,
  formatearFecha,
  abrirModalVer,
  cargando,
  abrirModalCrear
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cargando ? (
        <div className="col-span-full text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando programas académicos...</p>
        </div>
      ) : programas.length > 0 ? (
        programas.map((programa) => (
          <div key={programa._id} className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header del programa */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${programa.tipo === 'curso'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600'
                  }`}>
                  {programa.tipo === 'curso' ? (
                    <BookOpen className="w-6 h-6 text-white" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${programa.tipo === 'curso'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                    }`}>
                    {programa.tipo === 'curso' ? 'Curso' : 'Programa Técnico'}
                  </span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${programa.estado === 'activo'
                    ? 'bg-emerald-100 text-emerald-800'
                    : programa.estado === 'inactivo'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                    }`}>
                    {programa.estado}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => abrirModalVer(programa)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => abrirModalEditar(programa)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => eliminarPrograma(programa._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido del programa */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{programa.nombre}</h3>
              <p className="text-slate-600 text-sm line-clamp-3">{programa.descripcion}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-600">
                    {formatearPrecio(programa.precio)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-600">
                    Max. {programa.capacidadMaxima || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-600">
                    {typeof programa.duracion === 'object'
                      ? `${programa.duracion?.horas || 0}h - ${programa.duracion?.semanas || 0} sem`
                      : programa.duracion || 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-600">
                    {programa.fechaInicio ? new Date(programa.fechaInicio).toLocaleDateString() : 'Por definir'}
                  </span>
                </div>
              </div>

              {programa.instructor && (
                <div className="pt-3 border-t border-slate-200/50">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Instructor:</span> {programa.instructor}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay programas académicos</h3>
          <p className="text-slate-500 mb-6">Comienza creando tu primer curso o programa técnico</p>
          <button
            onClick={abrirModalCrear}
            className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Crear Programa Académico
          </button>
        </div>
      )}
    </div>
  );
};
ProgramasTabla.propTypes = {
  programas: PropTypes.array.isRequired,
  abrirModalEditar: PropTypes.func.isRequired,
  eliminarPrograma: PropTypes.func.isRequired,
  formatearPrecio: PropTypes.func.isRequired,
  formatearFecha: PropTypes.func.isRequired,
  abrirModalVer: PropTypes.func.isRequired,
  cargando: PropTypes.bool,
  abrirModalCrear: PropTypes.func.isRequired,
};

export default ProgramasTabla;
