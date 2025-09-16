import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionEventosAdmin = () => {
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({ busqueda: '', tipo: 'todos', estado: 'todos' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'campamento', // 'campamento', 'retiro', 'conferencia', 'taller', 'otro'
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    direccion: '',
    capacidadMaxima: '',
    precio: '',
    incluyeAlojamiento: false,
    incluyeAlimentacion: false,
    requisitos: '',
    programa: '',
    instructor: '',
    coordinador: '',
    imagen: '',
    imagenes: [], // Para múltiples imágenes
    estado: 'activo',
    destacado: false,
    etiquetas: []
  });

  const tiposEventos = [
    { value: 'campamento', label: 'Campamento', icon: '🏕️' },
    { value: 'retiro', label: 'Retiro Espiritual', icon: '🙏' },
    { value: 'conferencia', label: 'Conferencia', icon: '🎤' },
    { value: 'taller', label: 'Taller', icon: '🔨' },
    { value: 'seminario', label: 'Seminario', icon: '📚' },
    { value: 'congreso', label: 'Congreso', icon: '🏛️' },
    { value: 'otro', label: 'Otro', icon: '📅' }
  ];

  useEffect(() => {
    obtenerEventos();
  }, []);

  const obtenerEventos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3001/api/eventos', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEventos(data.data || []);
      }
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      mostrarAlerta('Error', 'No se pudieron cargar los eventos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const crearEvento = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevoEvento)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Evento creado exitosamente');
        setMostrarModal(false);
        resetFormulario();
        obtenerEventos();
      } else {
        throw new Error('Error al crear el evento');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al crear el evento', 'error');
    }
  };

  const actualizarEvento = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/eventos/${eventoSeleccionado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventoSeleccionado)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Evento actualizado exitosamente');
        setMostrarModal(false);
        setEventoSeleccionado(null);
        setModoEdicion(false);
        obtenerEventos();
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al actualizar el evento', 'error');
    }
  };

  const eliminarEvento = async (evento) => {
    const confirmado = await mostrarConfirmacion(
      '¿Estás seguro?',
      `Esta acción eliminará el evento "${evento.nombre}" permanentemente.`
    );

    if (!confirmado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/eventos/${evento._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Evento eliminado exitosamente');
        obtenerEventos();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al eliminar el evento', 'error');
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    resetFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado({ ...evento });
    setMostrarModal(true);
  };

  const resetFormulario = () => {
    setNuevoEvento({
      nombre: '',
      descripcion: '',
      tipo: 'campamento',
      fechaInicio: '',
      fechaFin: '',
      horaInicio: '',
      horaFin: '',
      ubicacion: '',
      direccion: '',
      capacidadMaxima: '',
      precio: '',
      incluyeAlojamiento: false,
      incluyeAlimentacion: false,
      requisitos: '',
      programa: '',
      instructor: '',
      coordinador: '',
      imagen: '',
      imagenes: [],
      estado: 'activo',
      destacado: false,
      etiquetas: []
    });
  };

  const eventosFiltrados = eventos.filter(evento => {
    const cumpleBusqueda = evento.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          evento.ubicacion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          evento.coordinador?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleTipo = filtros.tipo === 'todos' || evento.tipo === filtros.tipo;
    const cumpleEstado = filtros.estado === 'todos' || evento.estado === filtros.estado;
    
    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerTipoEvento = (tipo) => {
    return tiposEventos.find(t => t.value === tipo) || tiposEventos[tiposEventos.length - 1];
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Eventos</h1>
          <p className="text-slate-600">Administra campamentos, retiros y actividades del seminario</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
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
            {tiposEventos.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="cancelado">Cancelado</option>
            <option value="finalizado">Finalizado</option>
          </select>

          <div className="text-sm text-slate-600 flex items-center">
            <span className="font-medium">{eventosFiltrados.length}</span> evento(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando eventos...</p>
          </div>
        ) : eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => {
            const tipoEvento = obtenerTipoEvento(evento.tipo);
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
                    <span>{tipoEvento.icon}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full">
                      {tipoEvento.label}
                    </span>
                    {evento.destacado && (
                      <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      evento.estado === 'activo' 
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
                      onClick={() => abrirModalEditar(evento)}
                      className="p-2 bg-white/20 backdrop-blur text-white hover:bg-white/30 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarEvento(evento)}
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
                        {formatearFecha(evento.fechaInicio)}
                        {evento.fechaFin && evento.fechaFin !== evento.fechaInicio && 
                          ` - ${formatearFecha(evento.fechaFin)}`
                        }
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
                          {formatearPrecio(evento.precio)}
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
            <p className="text-slate-500 mb-6">Comienza creando tu primer evento o actividad</p>
            <button
              onClick={abrirModalCrear}
              className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Crear Evento
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar evento */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {modoEdicion ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setEventoSeleccionado(null);
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
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? eventoSeleccionado?.nombre || '' : nuevoEvento.nombre}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, nombre: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, nombre: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej: Campamento de Jóvenes 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    value={modoEdicion ? eventoSeleccionado?.tipo : nuevoEvento.tipo}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, tipo: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, tipo: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {tiposEventos.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.icon} {tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={modoEdicion ? eventoSeleccionado?.estado : nuevoEvento.estado}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, estado: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, estado: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={modoEdicion ? 
                      (eventoSeleccionado?.fechaInicio ? eventoSeleccionado.fechaInicio.split('T')[0] : '') : 
                      nuevoEvento.fechaInicio
                    }
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, fechaInicio: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, fechaInicio: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={modoEdicion ? 
                      (eventoSeleccionado?.fechaFin ? eventoSeleccionado.fechaFin.split('T')[0] : '') : 
                      nuevoEvento.fechaFin
                    }
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, fechaFin: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, fechaFin: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={modoEdicion ? eventoSeleccionado?.horaInicio || '' : nuevoEvento.horaInicio}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, horaInicio: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, horaInicio: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={modoEdicion ? eventoSeleccionado?.horaFin || '' : nuevoEvento.horaFin}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, horaFin: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, horaFin: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? eventoSeleccionado?.ubicacion || '' : nuevoEvento.ubicacion}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, ubicacion: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, ubicacion: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Nombre del lugar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coordinador
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? eventoSeleccionado?.coordinador || '' : nuevoEvento.coordinador}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, coordinador: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, coordinador: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Nombre del coordinador"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? eventoSeleccionado?.capacidadMaxima || '' : nuevoEvento.capacidadMaxima}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, capacidadMaxima: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, capacidadMaxima: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Número de participantes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? eventoSeleccionado?.precio || '' : nuevoEvento.precio}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setEventoSeleccionado({ ...eventoSeleccionado, precio: e.target.value });
                      } else {
                        setNuevoEvento({ ...nuevoEvento, precio: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Dirección completa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={modoEdicion ? eventoSeleccionado?.direccion || '' : nuevoEvento.direccion}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setEventoSeleccionado({ ...eventoSeleccionado, direccion: e.target.value });
                    } else {
                      setNuevoEvento({ ...nuevoEvento, direccion: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Dirección completa del evento"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={modoEdicion ? eventoSeleccionado?.descripcion || '' : nuevoEvento.descripcion}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setEventoSeleccionado({ ...eventoSeleccionado, descripcion: e.target.value });
                    } else {
                      setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value });
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Describe el evento, objetivos y actividades incluidas..."
                />
              </div>

              {/* Programa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Programa/Agenda
                </label>
                <textarea
                  value={modoEdicion ? eventoSeleccionado?.programa || '' : nuevoEvento.programa}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setEventoSeleccionado({ ...eventoSeleccionado, programa: e.target.value });
                    } else {
                      setNuevoEvento({ ...nuevoEvento, programa: e.target.value });
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Detalla la agenda del evento por días/horarios..."
                />
              </div>

              {/* Requisitos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requisitos
                </label>
                <textarea
                  value={modoEdicion ? eventoSeleccionado?.requisitos || '' : nuevoEvento.requisitos}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setEventoSeleccionado({ ...eventoSeleccionado, requisitos: e.target.value });
                    } else {
                      setNuevoEvento({ ...nuevoEvento, requisitos: e.target.value });
                    }
                  }}
                  rows={3}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Requisitos para participar en el evento..."
                />
              </div>

              {/* URL de imagen */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL de Imagen Principal
                </label>
                <input
                  type="url"
                  value={modoEdicion ? eventoSeleccionado?.imagen || '' : nuevoEvento.imagen}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setEventoSeleccionado({ ...eventoSeleccionado, imagen: e.target.value });
                    } else {
                      setNuevoEvento({ ...nuevoEvento, imagen: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {/* Opciones adicionales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Servicios Incluidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modoEdicion ? eventoSeleccionado?.incluyeAlojamiento || false : nuevoEvento.incluyeAlojamiento}
                      onChange={(e) => {
                        if (modoEdicion) {
                          setEventoSeleccionado({ ...eventoSeleccionado, incluyeAlojamiento: e.target.checked });
                        } else {
                          setNuevoEvento({ ...nuevoEvento, incluyeAlojamiento: e.target.checked });
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Incluye Alojamiento</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modoEdicion ? eventoSeleccionado?.incluyeAlimentacion || false : nuevoEvento.incluyeAlimentacion}
                      onChange={(e) => {
                        if (modoEdicion) {
                          setEventoSeleccionado({ ...eventoSeleccionado, incluyeAlimentacion: e.target.checked });
                        } else {
                          setNuevoEvento({ ...nuevoEvento, incluyeAlimentacion: e.target.checked });
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Incluye Alimentación</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modoEdicion ? eventoSeleccionado?.destacado || false : nuevoEvento.destacado}
                      onChange={(e) => {
                        if (modoEdicion) {
                          setEventoSeleccionado({ ...eventoSeleccionado, destacado: e.target.checked });
                        } else {
                          setNuevoEvento({ ...nuevoEvento, destacado: e.target.checked });
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Evento Destacado</span>
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
                    setEventoSeleccionado(null);
                    setModoEdicion(false);
                  }}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100/80 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={modoEdicion ? actualizarEvento : crearEvento}
                  className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'} Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEventosAdmin;
