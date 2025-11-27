import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Users,
  Wifi,
  Car,
  Utensils,
  DollarSign,
  Eye,
  Star,
  Check,
  X,
  MapPin
} from 'lucide-react';


const CabanaTabla = ({ cabanas, onEditar, onEliminar, onInsertar, onVerDetalle }) => {

  const [imgIndices, setImgIndices] = useState({});

  const tiposCabanas = [
    { value: 'individual', label: 'Individual', icon: '🏠', description: 'Para 1-2 personas' },
    { value: 'familiar', label: 'Familiar', icon: '🏡', description: 'Para familias pequeñas (3-4 personas)' },
    { value: 'grupal', label: 'Grupal', icon: '🏘️', description: 'Para grupos medianos (5-8 personas)' },
    { value: 'dormitorio', label: 'Dormitorio', icon: '🏢', description: 'Para grupos grandes (8+ personas)' }
  ];

  const serviciosDisponibles = [
    { value: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
    { value: 'estacionamiento', label: 'Estacionamiento', icon: <Car className="w-4 h-4" /> },
    { value: 'cocina', label: 'Cocina Completa', icon: <Utensils className="w-4 h-4" /> },
    { value: 'comedor', label: 'Comedor', icon: '🍽️' },
    { value: 'sala', label: 'Sala de Estar', icon: '🛋️' },
    { value: 'terraza', label: 'Terraza/Balcón', icon: '🌅' },
    { value: 'parrilla', label: 'Parrilla/BBQ', icon: '🔥' },
    { value: 'fogata', label: 'Área de Fogata', icon: '🔥' },
    { value: 'jardin', label: 'Jardín', icon: '🌻' },
    { value: 'piscina', label: 'Acceso a Piscina', icon: '🏊' }
  ];


  // Si el padre ya aplicó filtros/paginación, usamos la lista tal cual
  const cabanasFiltradas = Array.isArray(cabanas) ? cabanas : [];

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const obtenerTipoCabana = (tipo) => {
    return tiposCabanas.find(t => t.value === tipo) || tiposCabanas[0];
  };


  // Renderizado condicional extraído para evitar ternarias anidadas en JSX
  let contenidoCabanas;
  if (cabanasFiltradas.length > 0) {
    contenidoCabanas = cabanasFiltradas.map((cabana) => {
      const tipoCabana = obtenerTipoCabana(cabana.tipo);
      // Definir variables y funciones dentro del map
      const imagenes = Array.isArray(cabana.imagen) ? cabana.imagen : [];
      const imgIndex = imgIndices[cabana._id] || 0;
      const prevImg = () => {
        setImgIndices(prev => ({
          ...prev,
          [cabana._id]: prev[cabana._id] > 0 ? prev[cabana._id] - 1 : imagenes.length - 1
        }));
      };
      const nextImg = () => {
        setImgIndices(prev => ({
          ...prev,
          [cabana._id]: prev[cabana._id] < imagenes.length - 1 ? prev[cabana._id] + 1 : 0
        }));
      };

      // Extraer lógica de datos desde el modelo (compatibilidad con campos anteriores)
      const capacidad = cabana.capacidad ?? cabana.capacidadMaxima ?? null;
      const precio = cabana.precio ?? cabana.precioPorNoche ?? null;
      const categoria = cabana.categoria && typeof cabana.categoria === 'object'
        ? (cabana.categoria.nombre || cabana.categoria.name || '')
        : (cabana.categoria || '');
      const creadoPor = cabana.creadoPor && typeof cabana.creadoPor === 'object'
        ? (cabana.creadoPor.nombre || cabana.creadoPor.name || cabana.creadoPor.email || '')
        : (cabana.creadoPor || '');

      // Extraer lógica de clase del estado para evitar ternarias anidadas
      let estadoClass = '';
      if (cabana.estado === 'disponible') {
        estadoClass = 'bg-emerald-500/90 text-white';
      } else if (cabana.estado === 'ocupada') {
        estadoClass = 'bg-red-500/90 text-white';
      } else if (cabana.estado === 'mantenimiento') {
        estadoClass = 'bg-amber-500/90 text-white';
      } else {
        estadoClass = 'bg-gray-500/90 text-white';
      }

      // Lógica de visualización simple para la disponibilidad (mapa para evitar reasignaciones redundantes)
      const estadoVisual = {
        disponible: {
          cls: 'text-emerald-600',
          node: (<><Check className="w-4 h-4 mr-1" /> Disponible</>)
        },
        ocupada: {
          cls: 'text-red-600',
          node: (<><X className="w-4 h-4 mr-1" /> Ocupada</>)
        },
        mantenimiento: {
          cls: 'text-amber-600',
          node: (<><X className="w-4 h-4 mr-1" /> En mantenimiento</>)
        }
      };

      const { cls: disponibilidadClass, node: disponibilidadNode } = estadoVisual[cabana.estado] || { cls: 'text-red-600', node: (<><X className="w-4 h-4 mr-1" /> No disponible</>) };

      return (
        <div key={cabana._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Imagen principal */}
          <div className="relative h-64 bg-gradient-to-r from-emerald-500 to-blue-600">
            {imagenes.length > 0 ? (
              <>
                <img
                  src={imagenes[imgIndex]}
                  alt={cabana.nombre}
                  className="w-full h-64 object-cover"
                  style={{ borderRadius: '1rem' }}
                />
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                      style={{ zIndex: 2 }}
                    >
                      {"<"}
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                      style={{ zIndex: 2 }}
                    >
                      {">"}
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {imagenes.map((img, idx) => (
                        <span
                          key={img || idx}
                          className={`inline-block w-2 h-2 rounded-full ${imgIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-64 text-white text-4xl">
                <span>{tipoCabana.icon}</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full">
                {tipoCabana.label}
              </span>
              {cabana.destacada && (
                <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Destacada
                </span>
              )}
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${estadoClass}`}>
                {cabana.estado || '—'}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 px-6 py-3">
              <button
                onClick={() => onVerDetalle(cabana)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEditar(cabana)}
                className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEliminar(cabana._id)}
                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contenido de la cabaña */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2">{cabana.nombre}</h3>
              <p className="text-slate-600 text-sm line-clamp-3">{cabana.descripcion}</p>
            </div>

            <div className="space-y-3">
              {/* Capacidad y habitaciones */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-600">Hasta {capacidad ?? '—'} personas</span>
                </div>
                {cabana.numeroCuartos && (
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">{cabana.numeroCuartos} cuarto(s)</span>
                  </div>
                )}
              </div>

              {/* Ubicación */}
              {cabana.ubicacion && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-slate-600 line-clamp-1">{cabana.ubicacion}</span>
                </div>
              )}

              {/* Precios */}
              <div className="space-y-1">
                {precio != null && (
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">
                      {formatearPrecio(precio)}{(cabana.precio || cabana.precioPorNoche) ? ' / noche' : ''}
                    </span>
                  </div>
                )}
                {cabana.precioPorPersona && (
                  <div className="flex items-center space-x-2 text-sm ml-6">
                    <span className="text-slate-600">
                      {formatearPrecio(cabana.precioPorPersona)} / persona
                    </span>
                  </div>
                )}
                {categoria && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-500 italic">Categoría:</span>
                    <span className="text-slate-700 font-medium">{categoria}</span>
                  </div>
                )}
                {creadoPor && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-500 italic">Creado por:</span>
                    <span className="text-slate-700">{creadoPor}</span>
                  </div>
                )}
              </div>

              {/* Servicios principales */}
              <div className="flex flex-wrap gap-2">
                {cabana.servicios?.slice(0, 4).map((servicio) => {
                  const servicioInfo = serviciosDisponibles.find(s => s.value === servicio);
                  return servicioInfo ? (
                    <span key={servicio} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
                      {servicioInfo.icon}
                      <span className="ml-1">{servicioInfo.label}</span>
                    </span>
                  ) : null;
                })}
                {cabana.servicios?.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                    +{cabana.servicios.length - 4} más
                  </span>
                )}
              </div>

              {/* Disponibilidad (usando campo `estado` del modelo) */}
              <div className="pt-3 border-t border-slate-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Disponibilidad:</span>
                  <span className={`flex items-center text-sm font-medium ${disponibilidadClass}`}>
                    {disponibilidadNode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  } else {
    contenidoCabanas = (
      <div className="col-span-full text-center py-12">
        <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay cabañas</h3>
        <p className="text-slate-500 mb-6">Comienza agregando tu primera cabaña o alojamiento</p>
        <button
          onClick={onInsertar}
          className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Crear Cabaña
        </button>
      </div>
    );
  }

  return (
    <>

      {/* Lista de Cabañas */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contenidoCabanas}
      </div>
    </>
  );
};

CabanaTabla.propTypes = {
  cabanas: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onInsertar: PropTypes.func.isRequired,
  onVerDetalle: PropTypes.func.isRequired,
};

export default CabanaTabla;