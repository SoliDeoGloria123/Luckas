import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';

// ============ HELPERS CENTRALIZADOS ============

// Helper para obtener imágenes del evento
const extraerImagenes = (evento) => {
  return Array.isArray(evento.imagen) ? evento.imagen : [];
};

// Helper para formatear fechas con múltiples formatos
const formatFecha = (f) => {
  if (!f && f !== 0) return '';
  const str = String(f).trim();
  const d = new Date(str);
  if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('es-ES');

  let sep = null;
  if (str.includes('/')) {
    sep = '/';
  } else if (str.includes('-')) {
    sep = '-';
  }
  if (sep) {
    const parts = str.split(sep).map(p => p.trim());
    if (parts.length === 3 && parts[2].length === 4) {
      const [dd, mm, yyyy] = parts;
      const reconstructed = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const d2 = new Date(reconstructed);
      if (!Number.isNaN(d2.getTime())) return d2.toLocaleDateString('es-ES');
    }
  }
  return str;
};

// Helper para obtener nombre de categoría
const extraerCategoriaInfo = (categoria) => {
  if (!categoria) return '';
  if (typeof categoria === 'object') return categoria.nombre || categoria.title || '';
  return '';
};

// Helper para parsear etiquetas
const parsearEtiquetas = (etiquetasData) => {
  if (Array.isArray(etiquetasData)) {
    return etiquetasData;
  } else if (etiquetasData) {
    return String(etiquetasData).split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// Helper para obtener clases de estado
const obtenerClasesEstado = (activo) => {
  return activo
    ? 'bg-emerald-500 text-white'
    : 'bg-red-500 text-white';
};

const TablaEventos = ({ eventos = [], onEditar, onEliminar, onDeshabilitar, onVerDetalle }) => {

  // Estado para manejar el índice de imagen de cada evento
  const [imgIndices, setImgIndices] = useState({});
  
  // Factory function para navegar imágenes
  const navegarImagen = (eventoId, totalImages, direccion) => {
    setImgIndices(prev => {
      const current = prev[eventoId] || 0;
      if (direccion === 'prev') {
        return { ...prev, [eventoId]: current > 0 ? current - 1 : totalImages - 1 };
      } else {
        return { ...prev, [eventoId]: current < totalImages - 1 ? current + 1 : 0 };
      }
    });
  };
  // Renderizado condicional extraído
  let contenidoEventos;
  if (eventos.length > 0) {
    contenidoEventos = eventos.map((evento) => {
      const imagenes = extraerImagenes(evento);
      const imgIndex = imgIndices[evento._id] || 0;
      const categoriaNombre = extraerCategoriaInfo(evento.categoria);
      const etiquetas = parsearEtiquetas(evento.etiquetas);
      const clasesEstado = obtenerClasesEstado(evento.active);

      return (
            <div key={evento._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Imagen del evento */}
              <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">

                {imagenes.length > 0 ? (
                  <>
                    <img
                      src={imagenes[imgIndex]}
                      alt={evento.nombre}
                      className="w-full h-64 object-cover"
                      style={{ borderRadius: '1rem' }}
                    />
                    {imagenes.length > 1 && (
                      <>
                        <button
                          onClick={() => navegarImagen(evento._id, imagenes.length, 'prev')}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {"<"}
                        </button>
                        <button
                          onClick={() => navegarImagen(evento._id, imagenes.length, 'next')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {">"}
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {imagenes.map((img, idx) => (
                            <span
                              key={`indicator-${evento._id}-${idx}`}
                              className={`inline-block w-2 h-2 rounded-full ${imgIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-64 text-white text-4xl">
                    <span>📅</span>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full">
                    {/*tipoEvento.label*/}
                  </span>
                  {categoriaNombre && (
                    <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-medium rounded-full">
                      {categoriaNombre}
                    </span>
                  )}
                  {evento.destacado && (
                    <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </span>
                  )}
                  
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-2 px-6 py-3">
                  <button
                    onClick={() => onVerDetalle(evento)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEditar(evento)}
                    className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEliminar(evento._id)}
                    className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contenido del evento */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2">{evento.nombre}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{evento.descripcion}</p>
                </div>

                <div className="space-y-3">
                  {/* Fechas */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-600">
                        {formatFecha(evento.fechaEvento)}

                      </span>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-slate-600 line-clamp-1">{evento.lugar}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-600 line-clamp-1">{evento.direccion}</span>
                  </div>


                  {/* Horario */}

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-600">
                      {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      ({evento.duracionDias} día{evento.duracionDias > 1 ? 's' : ''})
                    </span>
                  </div>



                  {/* Capacidad */}

                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">Máximo {evento.cuposTotales ?? evento.cuposDisponibles} participantes</span>
                  </div>


                  {/* Precio */}

                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">
                      {evento.precio}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-600">Estado:</span>
                    <span className={`px-3 py-1 text-base font-medium rounded-full shadow-md ${clasesEstado}`}>
                      {evento.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>


                  {/* Servicios incluidos */}
                  <div className="flex flex-wrap gap-2">
                    {evento.incluyeAlojamiento && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
                        🏠 Alojamiento
                      </span>
                    )}
                    {evento.incluyeAlimentacion && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg">
                        🍽️ Alimentación
                      </span>
                    )}
                  </div>
                  {etiquetas.length > 0 && (
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-2">
                        {etiquetas.slice(0, 6).map((tag, i) => (
                          <span key={`tag-${evento._id}-${i}`} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coordinador */}
                {evento.coordinador && (
                  <div className="pt-3 border-t border-slate-200/50">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Coordinador:</span> {evento.coordinador}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        });
  } else {
    contenidoEventos = (
      <div className="col-span-full text-center py-12">
        <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay eventos</h3>
        <p className="text-slate-500 mb-6">Comienza creando tu primer eventos o actividad</p>
        <button
          /* onClick={abrirModalCrear}*/
          className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Crear Evento
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contenidoEventos}
    </div>
  );
};
TablaEventos.propTypes = {

  eventos: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onDeshabilitar: PropTypes.func,
  onVerDetalle: PropTypes.func.isRequired,
};

export default TablaEventos;