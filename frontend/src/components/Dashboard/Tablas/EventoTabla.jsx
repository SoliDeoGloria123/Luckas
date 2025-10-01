import React, { useState } from "react";

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

const TablaEventos = ({ cargando, eventos = [], onEditar, onEliminar, onDeshabilitar, onVerDetalle }) => {

 // Estado para manejar el índice de imagen de cada evento
  const [imgIndices, setImgIndices] = useState({});

  // Funciones para navegar en el carrusel
  const prevImg = (eventoId, totalImages) => {
    setImgIndices(prev => ({
      ...prev,
      [eventoId]: prev[eventoId] > 0 ? prev[eventoId] - 1 : totalImages - 1
    }));
  };

  const nextImg = (eventoId, totalImages) => {
    setImgIndices(prev => ({
      ...prev,
      [eventoId]: prev[eventoId] < totalImages - 1 ? prev[eventoId] + 1 : 0
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cargando ? (
        <div className="col-span-full text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando eventos...</p>
        </div>
      ) : eventos.length > 0 ? (
        eventos.map((evento) => {
          const imagenes = Array.isArray(evento.imagen) ? evento.imagen : [];
          const imgIndex = imgIndices[evento._id] || 0;
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
                          onClick={() => prevImg(evento._id, imagenes.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {"<"}
                        </button>
                        <button
                          onClick={() => nextImg(evento._id, imagenes.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {">"}
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {imagenes.map((_, idx) => (
                            <span
                              key={idx}
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
                  {evento.destacado && (
                    <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </span>
                  )}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${evento.estado === 'activo'
                    ? 'bg-emerald-500/90 text-white'
                    : evento.estado === 'inactivo'
                      ? 'bg-red-500/90 text-white'
                      : evento.estado === 'finalizado'
                        ? 'bg-gray-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}>
                    {evento.estado}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="flex  justify-end  gap-2  px-6 py-3 ">
                  <button
                  onClick={() => onVerDetalle(evento)}
                   className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>

                  <button
                    onClick={() => onEditar(evento)}
                    className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors "
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

                    </span>
                  </div>

                  {/* Ubicación */}
                  {evento.ubicacion && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-slate-600 line-clamp-1">{evento.ubicacion}</span>
                    </div>
                  )}

                  {/* Horario */}
                  {(evento.horaInicio || evento.horaFin) && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-600">
                        {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}
                      </span>
                    </div>
                  )}

                  {/* Capacidad */}
                  {evento.capacidadMaxima && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">Máximo {evento.capacidadMaxima} participantes</span>
                    </div>
                  )}

                  {/* Precio */}
                  {evento.precio && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">
                        {/*formatearPrecio(evento.precio)*/}
                      </span>
                    </div>
                  )}

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
        })
      ) : (
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
      )}
    </div>
  );
};

export default TablaEventos;