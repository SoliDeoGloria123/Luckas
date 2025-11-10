import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Edit,
  Trash2,
  Search,
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


const CabanaTabla = ({ cabanas, onEditar, onEliminar, onInsertar, nuevaCabana, setNuevaCabana, onVerDetalle }) => {

  const [filtros, setFiltros] = useState({ busqueda: '', tipo: 'todos', estado: 'todos' });
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
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

  const amenidadesDisponibles = [
    { value: 'tv', label: 'TV', icon: '📺' },
    { value: 'aire_acondicionado', label: 'A/C', icon: '❄️' },
    { value: 'ventilador', label: 'Ventilador', icon: '💨' },
    { value: 'nevera', label: 'Nevera', icon: '🧊' },
    { value: 'microondas', label: 'Microondas', icon: '📦' },
    { value: 'cafetera', label: 'Cafetera', icon: '☕' },
    { value: 'toallas', label: 'Toallas', icon: '🏖️' },
    { value: 'sabanas', label: 'Sábanas', icon: '🛏️' },
    { value: 'almohadas', label: 'Almohadas', icon: '😴' },
    { value: 'secador', label: 'Secador de Pelo', icon: '💇' }
  ];

  const cabanasFiltradas = cabanas.filter(cabana => {
    const cumpleBusqueda = cabana.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      cabana.ubicacion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      cabana.tipo?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleTipo = filtros.tipo === 'todos' || cabana.tipo === filtros.tipo;
    const cumpleEstado = filtros.estado === 'todos' || cabana.estado === filtros.estado;

    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

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

  const toggleServicio = (servicio, isEditing = false) => {
    if (isEditing) {
      const serviciosActuales = cabanaSeleccionada.servicios || [];
      const nuevosServicios = serviciosActuales.includes(servicio)
        ? serviciosActuales.filter(s => s !== servicio)
        : [...serviciosActuales, servicio];
      setCabanaSeleccionada({ ...cabanaSeleccionada, servicios: nuevosServicios });
    } else {
      const serviciosActuales = nuevaCabana.servicios;
      const nuevosServicios = serviciosActuales.includes(servicio)
        ? serviciosActuales.filter(s => s !== servicio)
        : [...serviciosActuales, servicio];
      setNuevaCabana({ ...nuevaCabana, servicios: nuevosServicios });
    }
  };

 /// const toggleAmenidad = (amenidad, isEditing = false) => {
 ///   if (isEditing) {
 ///     const amenidadesActuales = cabanaSeleccionada.amenidades || [];
 ///     const nuevasAmenidades = amenidadesActuales.includes(amenidad)
 ///       ? amenidadesActuales.filter(a => a !== amenidad)
 ///       : [...amenidadesActuales, amenidad];
 ///     setCabanaSeleccionada({ ...cabanaSeleccionada, amenidades: nuevasAmenidades });
 ///   } else {
 ///     const amenidadesActuales = nuevaCabana.amenidades;
 ///     const nuevasAmenidades = amenidadesActuales.includes(amenidad)
 ///       ? amenidadesActuales.filter(a => a !== amenidad)
 ///       : [...amenidadesActuales, amenidad];
 ///     setNuevaCabana({ ...nuevaCabana, amenidades: nuevasAmenidades });
 ///   }
 /// };

  // Renderizado condicional extraído para evitar ternarias anidadas en JSX
  let contenidoCabanas;
  if (cargando) {
    contenidoCabanas = (
      <div className="col-span-full text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Cargando cabañas...</p>
      </div>
    );
  } else if (cabanasFiltradas.length > 0) {
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
                {cabana.estado}
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
                  <span className="text-slate-600">Hasta {cabana.capacidadMaxima} personas</span>
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
                {cabana.precioPorNoche && (
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">
                      {formatearPrecio(cabana.precioPorNoche)} / noche
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

              {/* Disponibilidad */}
              <div className="pt-3 border-t border-slate-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Disponibilidad:</span>
                  <span className={`flex items-center text-sm font-medium ${cabana.disponibilidad ? 'text-emerald-600' : 'text-red-600'}`}>
                    {cabana.disponibilidad ? (
                      <><Check className="w-4 h-4 mr-1" /> Disponible</>
                    ) : (
                      <><X className="w-4 h-4 mr-1" /> No Disponible</>
                    )}
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
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cabañas..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los tipos</option>
            {tiposCabanas.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="inactiva">Inactiva</option>
          </select>

          <div className="text-sm text-slate-600 flex items-center">
            <span className="font-medium">{cabanasFiltradas.length}</span> cabaña(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Lista de Cabañas */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contenidoCabanas}
      </div>
    </>
  );
};
CabanaTabla.propTypes = {
  cabanas: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onInsertar: PropTypes.func.isRequired,
  nuevaCabana: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    tipo: PropTypes.string,
    estado: PropTypes.string,
    capacidadMaxima: PropTypes.number,
    numeroCuartos: PropTypes.number,
    ubicacion: PropTypes.string,
    precioPorNoche: PropTypes.number,
    precioPorPersona: PropTypes.number,
    servicios: PropTypes.array,
    amenidades: PropTypes.array,
    imagen: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    disponibilidad: PropTypes.bool,
    destacada: PropTypes.bool,
    _id: PropTypes.string
  }).isRequired,
  setNuevaCabana: PropTypes.func.isRequired,
  onVerDetalle: PropTypes.func.isRequired
};

export default CabanaTabla;