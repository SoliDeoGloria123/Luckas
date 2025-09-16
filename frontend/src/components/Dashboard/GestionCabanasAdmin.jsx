import React, { useState, useEffect } from 'react';
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
  Star,
  Check,
  X,
  MapPin
} from 'lucide-react';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionCabanasAdmin = () => {
  const [cabanas, setCabanas] = useState([]);
  const [filtros, setFiltros] = useState({ busqueda: '', tipo: 'todos', estado: 'todos' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [nuevaCabana, setNuevaCabana] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'individual', // 'individual', 'familiar', 'grupal', 'dormitorio'
    capacidadMaxima: '',
    numeroCuartos: '',
    numeroBanos: '',
    precioPorNoche: '',
    precioPorPersona: '',
    ubicacion: '',
    coordenadas: { lat: '', lng: '' },
    servicios: [], // wifi, estacionamiento, cocina, etc.
    amenidades: [], // tv, aire_acondicionado, nevera, etc.
    imagenes: [], // Array de URLs de imágenes
    imagenPrincipal: '',
    estado: 'disponible',
    caracteristicas: '',
    reglas: '',
    politicaCancelacion: '',
    descuentos: {
      semana: 0, // % descuento por semana
      mes: 0 // % descuento por mes
    },
    disponibilidad: true,
    destacada: false,
    etiquetas: []
  });

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

  useEffect(() => {
    obtenerCabanas();
  }, []);

  const obtenerCabanas = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3001/api/cabanas', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCabanas(data.data || []);
      }
    } catch (error) {
      console.error('Error al obtener cabañas:', error);
      mostrarAlerta('Error', 'No se pudieron cargar las cabañas', 'error');
    } finally {
      setCargando(false);
    }
  };

  const crearCabana = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cabanas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevaCabana)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Cabaña creada exitosamente');
        setMostrarModal(false);
        resetFormulario();
        obtenerCabanas();
      } else {
        throw new Error('Error al crear la cabaña');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al crear la cabaña', 'error');
    }
  };

  const actualizarCabana = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/cabanas/${cabanaSeleccionada._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cabanaSeleccionada)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Cabaña actualizada exitosamente');
        setMostrarModal(false);
        setCabanaSeleccionada(null);
        setModoEdicion(false);
        obtenerCabanas();
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al actualizar la cabaña', 'error');
    }
  };

  const eliminarCabana = async (cabana) => {
    const confirmado = await mostrarConfirmacion(
      '¿Estás seguro?',
      `Esta acción eliminará la cabaña "${cabana.nombre}" permanentemente.`
    );

    if (!confirmado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cabanas/${cabana._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Cabaña eliminada exitosamente');
        obtenerCabanas();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al eliminar la cabaña', 'error');
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    resetFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (cabana) => {
    setModoEdicion(true);
    setCabanaSeleccionada({ ...cabana });
    setMostrarModal(true);
  };

  const resetFormulario = () => {
    setNuevaCabana({
      nombre: '',
      descripcion: '',
      tipo: 'individual',
      capacidadMaxima: '',
      numeroCuartos: '',
      numeroBanos: '',
      precioPorNoche: '',
      precioPorPersona: '',
      ubicacion: '',
      coordenadas: { lat: '', lng: '' },
      servicios: [],
      amenidades: [],
      imagenes: [],
      imagenPrincipal: '',
      estado: 'disponible',
      caracteristicas: '',
      reglas: '',
      politicaCancelacion: '',
      descuentos: { semana: 0, mes: 0 },
      disponibilidad: true,
      destacada: false,
      etiquetas: []
    });
  };

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

  const toggleAmenidad = (amenidad, isEditing = false) => {
    if (isEditing) {
      const amenidadesActuales = cabanaSeleccionada.amenidades || [];
      const nuevasAmenidades = amenidadesActuales.includes(amenidad)
        ? amenidadesActuales.filter(a => a !== amenidad)
        : [...amenidadesActuales, amenidad];
      setCabanaSeleccionada({ ...cabanaSeleccionada, amenidades: nuevasAmenidades });
    } else {
      const amenidadesActuales = nuevaCabana.amenidades;
      const nuevasAmenidades = amenidadesActuales.includes(amenidad)
        ? amenidadesActuales.filter(a => a !== amenidad)
        : [...amenidadesActuales, amenidad];
      setNuevaCabana({ ...nuevaCabana, amenidades: nuevasAmenidades });
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Cabañas</h1>
          <p className="text-slate-600">Administra las cabañas y alojamientos del seminario</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cabaña</span>
        </button>
      </div>

      {/* Filtros */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando cabañas...</p>
          </div>
        ) : cabanasFiltradas.length > 0 ? (
          cabanasFiltradas.map((cabana) => {
            const tipoCabana = obtenerTipoCabana(cabana.tipo);
            return (
              <div key={cabana._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Imagen principal */}
                <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-blue-600">
                  {cabana.imagenPrincipal ? (
                    <img 
                      src={cabana.imagenPrincipal} 
                      alt={cabana.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center text-white text-4xl ${cabana.imagenPrincipal ? 'hidden' : 'flex'}`}>
                    <span>{tipoCabana.icon}</span>
                  </div>
                  
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
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      cabana.estado === 'disponible' 
                        ? 'bg-emerald-500/90 text-white' 
                        : cabana.estado === 'ocupada' 
                          ? 'bg-red-500/90 text-white'
                          : cabana.estado === 'mantenimiento'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                    }`}>
                      {cabana.estado}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => abrirModalEditar(cabana)}
                      className="p-2 bg-white/20 backdrop-blur text-white hover:bg-white/30 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarCabana(cabana)}
                      className="p-2 bg-red-500/20 backdrop-blur text-white hover:bg-red-500/30 rounded-lg transition-colors"
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
                        <span className={`flex items-center text-sm font-medium ${
                          cabana.disponibilidad ? 'text-emerald-600' : 'text-red-600'
                        }`}>
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
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay cabañas</h3>
            <p className="text-slate-500 mb-6">Comienza agregando tu primera cabaña o alojamiento</p>
            <button
              onClick={abrirModalCrear}
              className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Crear Cabaña
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar cabaña */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {modoEdicion ? 'Editar Cabaña' : 'Nueva Cabaña'}
                </h2>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setCabanaSeleccionada(null);
                    setModoEdicion(false);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100/80"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de la Cabaña *
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? cabanaSeleccionada?.nombre || '' : nuevaCabana.nombre}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, nombre: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, nombre: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej: Cabaña El Refugio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Cabaña *
                  </label>
                  <select
                    value={modoEdicion ? cabanaSeleccionada?.tipo : nuevaCabana.tipo}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, tipo: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, tipo: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {tiposCabanas.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.icon} {tipo.label} - {tipo.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={modoEdicion ? cabanaSeleccionada?.estado : nuevaCabana.estado}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, estado: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, estado: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacidad Máxima *
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? cabanaSeleccionada?.capacidadMaxima || '' : nuevaCabana.capacidadMaxima}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, capacidadMaxima: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, capacidadMaxima: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Número máximo de huéspedes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Cuartos
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? cabanaSeleccionada?.numeroCuartos || '' : nuevaCabana.numeroCuartos}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, numeroCuartos: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, numeroCuartos: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Baños
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? cabanaSeleccionada?.numeroBanos || '' : nuevaCabana.numeroBanos}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, numeroBanos: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, numeroBanos: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio por Noche (COP)
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? cabanaSeleccionada?.precioPorNoche || '' : nuevaCabana.precioPorNoche}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, precioPorNoche: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, precioPorNoche: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio por Persona (COP)
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? cabanaSeleccionada?.precioPorPersona || '' : nuevaCabana.precioPorPersona}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, precioPorPersona: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, precioPorPersona: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={modoEdicion ? cabanaSeleccionada?.ubicacion || '' : nuevaCabana.ubicacion}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setCabanaSeleccionada({ ...cabanaSeleccionada, ubicacion: e.target.value });
                    } else {
                      setNuevaCabana({ ...nuevaCabana, ubicacion: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Descripción de la ubicación de la cabaña"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={modoEdicion ? cabanaSeleccionada?.descripcion || '' : nuevaCabana.descripcion}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setCabanaSeleccionada({ ...cabanaSeleccionada, descripcion: e.target.value });
                    } else {
                      setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value });
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Describe la cabaña, sus características principales y comodidades..."
                />
              </div>

              {/* Servicios */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Servicios Disponibles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {serviciosDisponibles.map((servicio) => {
                    const isSelected = modoEdicion 
                      ? cabanaSeleccionada?.servicios?.includes(servicio.value)
                      : nuevaCabana.servicios.includes(servicio.value);
                    
                    return (
                      <label
                        key={servicio.value}
                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-100/80 border-2 border-blue-500/50' 
                            : 'bg-white/50 border-2 border-slate-200/50 hover:bg-slate-50/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleServicio(servicio.value, modoEdicion)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          {servicio.icon}
                          <span className="text-sm font-medium text-slate-700">{servicio.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Amenidades */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Amenidades
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenidadesDisponibles.map((amenidad) => {
                    const isSelected = modoEdicion 
                      ? cabanaSeleccionada?.amenidades?.includes(amenidad.value)
                      : nuevaCabana.amenidades.includes(amenidad.value);
                    
                    return (
                      <label
                        key={amenidad.value}
                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-emerald-100/80 border-2 border-emerald-500/50' 
                            : 'bg-white/50 border-2 border-slate-200/50 hover:bg-slate-50/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAmenidad(amenidad.value, modoEdicion)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span>{amenidad.icon}</span>
                          <span className="text-sm font-medium text-slate-700">{amenidad.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Imágenes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL de Imagen Principal
                  </label>
                  <input
                    type="url"
                    value={modoEdicion ? cabanaSeleccionada?.imagenPrincipal || '' : nuevaCabana.imagenPrincipal}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, imagenPrincipal: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, imagenPrincipal: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://ejemplo.com/imagen-principal.jpg"
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Características Especiales
                  </label>
                  <textarea
                    value={modoEdicion ? cabanaSeleccionada?.caracteristicas || '' : nuevaCabana.caracteristicas}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, caracteristicas: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, caracteristicas: e.target.value });
                      }
                    }}
                    rows={3}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    placeholder="Características especiales de la cabaña..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reglas de la Casa
                  </label>
                  <textarea
                    value={modoEdicion ? cabanaSeleccionada?.reglas || '' : nuevaCabana.reglas}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setCabanaSeleccionada({ ...cabanaSeleccionada, reglas: e.target.value });
                      } else {
                        setNuevaCabana({ ...nuevaCabana, reglas: e.target.value });
                      }
                    }}
                    rows={3}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    placeholder="Reglas y normas para los huéspedes..."
                  />
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Opciones Adicionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modoEdicion ? cabanaSeleccionada?.disponibilidad || false : nuevaCabana.disponibilidad}
                      onChange={(e) => {
                        if (modoEdicion) {
                          setCabanaSeleccionada({ ...cabanaSeleccionada, disponibilidad: e.target.checked });
                        } else {
                          setNuevaCabana({ ...nuevaCabana, disponibilidad: e.target.checked });
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Disponible para reservas</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modoEdicion ? cabanaSeleccionada?.destacada || false : nuevaCabana.destacada}
                      onChange={(e) => {
                        if (modoEdicion) {
                          setCabanaSeleccionada({ ...cabanaSeleccionada, destacada: e.target.checked });
                        } else {
                          setNuevaCabana({ ...nuevaCabana, destacada: e.target.checked });
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Cabaña Destacada</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="sticky bottom-0 glass-card border-t border-white/20 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setCabanaSeleccionada(null);
                    setModoEdicion(false);
                  }}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100/80 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={modoEdicion ? actualizarCabana : crearCabana}
                  className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'} Cabaña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCabanasAdmin;
