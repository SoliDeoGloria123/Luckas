import React from "react";

import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';

const TablaEventos = ({ cargando, eventosFiltrados = [], onEditar, onEliminar, onDeshabilitar, onVerImagen }) => {
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cargando ? (
        <div className="col-span-full text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando eventos...</p>
        </div>
      ) : eventosFiltrados.length > 0 ? (
        eventosFiltrados.map((evento) => {
          return (
            <div key={evento._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Imagen del evento */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                {evento.imagen ? (
                  <img
                    src={evento.imagen}
                    alt={evento.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center text-white text-4xl ${evento.imagen ? 'hidden' : 'flex'}`}>
                  <span>{/*tipoEvento.icon*/}</span>
                </div>

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
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => onEditar(evento)}
                    className="p-2 bg-white/20 backdrop-blur text-white hover:bg-white/30 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEliminar(evento)}
                    className="p-2 bg-red-500/20 backdrop-blur text-white hover:bg-red-500/30 rounded-lg transition-colors"
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