import React, { useState, useEffect } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { categorizacionService } from '../../../services/categorizacionService';
import { mostrarAlerta } from '../../utils/alertas';
import CabanaModal from '../../Dashboard/Modales/CabanaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import {
  Plus,
  Edit,
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


const crearCabanaVacia = () => ({
  nombre: '',
  descripcion: '',
  capacidad: '',
  precio: '',
  categoria: '',
  estado: 'disponible',
  servicios: []
});

const Gestioncabana = () => {
  // Estado de carga y filtrado
  // Carrusel de imágenes: un índice por cabaña
  const [imgIndices, setImgIndices] = useState({});
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filtros y buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [nuevaCabana, setNuevaCabana] = useState(crearCabanaVacia());
  const [selectedImages, setSelectedImages] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ totalCabanas: 0, disponibles: 0, ocupadas: 0, mantenimiento: 0 });

  // Función para obtener el tipo de cabaña (dummy)
  const obtenerTipoCabana = (tipo) => ({ label: tipo || 'Cabaña', icon: <Home className="w-6 h-6" /> });

  // Función para formatear precios (dummy)
  const formatearPrecio = (precio) => `$${precio}`;

  // Servicios disponibles (dummy)
  const serviciosDisponibles = [
    { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-3 h-3" /> },
    { value: 'parqueadero', label: 'Parqueadero', icon: <Car className="w-3 h-3" /> },
    { value: 'restaurante', label: 'Restaurante', icon: <Utensils className="w-3 h-3" /> },
    // ...agrega más si lo necesitas
  ];


  // Helper: obtiene las imágenes desde el objeto de detalle (soporta varias claves)
  const getImagesFromDetalle = (detalle) => {
    if (!detalle) return [];
    if (Array.isArray(detalle.imagen)) return detalle.imagen;
    if (Array.isArray(detalle.imagenes)) return detalle.imagenes;
    // Algunos backends pueden enviar 'images' o 'files' o solo una URL en 'imagen'
    if (Array.isArray(detalle.images)) return detalle.images;
    if (detalle.imagen && typeof detalle.imagen === 'string') return [detalle.imagen];
    return [];
  };

  const [cabanas, setCabanas] = useState([]);
  const pasaFiltroPorCategoriaCabana = (cabana, categoriaFilter) => {
    if (!categoriaFilter || categoriaFilter === 'todos') return true;
    const cat = cabana.categoria?._id || cabana.categoria?.nombre || cabana.categoria;
    if (!cat) return false;
    return String(cat) === String(categoriaFilter) || String((cabana.categoria?.nombre || '')).toLowerCase() === String(categoriaFilter).toLowerCase();
  };

  const pasaFiltroPorEstadoCabana = (cabana, estadoFilter) => {
    if (!estadoFilter || estadoFilter === 'todos') return true;
    const ef = String(estadoFilter).toLowerCase();
    // soportar booleano disponibilidad o campo estado
    if (ef === 'disponible') return (cabana.estado && String(cabana.estado).toLowerCase() === 'disponible') || Boolean(cabana.disponibilidad);
    if (ef === 'ocupada') return (cabana.estado && String(cabana.estado).toLowerCase() === 'ocupada');
    if (ef === 'mantenimiento') return (cabana.estado && String(cabana.estado).toLowerCase() === 'mantenimiento');
    return (cabana.estado || '').toLowerCase() === ef;
  };

  const pasaFiltroPorBusquedaCabana = (cabana, q) => {
    if (!q) return true;
    const s = String(q).trim().toLowerCase();
    if (!s) return true;
    const campos = [
      cabana.nombre || '',
      cabana.descripcion || '',
      cabana.ubicacion || '',
      cabana.categoria?.nombre || cabana.categoria || ''
    ].map(c => String(c).toLowerCase());
    return campos.some(c => c.includes(s));
  };

  const cabanasFiltradas = (cabanas || []).filter(c => (
    pasaFiltroPorCategoriaCabana(c, filterCategoria) &&
    pasaFiltroPorEstadoCabana(c, filterEstado) &&
    pasaFiltroPorBusquedaCabana(c, searchTerm)
  ));
  const [categorias, setCategorias] = useState([]);


  // Funciones para navegación de imágenes
  const prevImg = (cabanaId, imagenes) => {
    setImgIndices(prev => ({
      ...prev,
      [cabanaId]: prev[cabanaId] > 0 ? prev[cabanaId] - 1 : imagenes.length - 1
    }));
  };

  const nextImg = (cabanaId, imagenes) => {
    setImgIndices(prev => ({
      ...prev,
      [cabanaId]: prev[cabanaId] < imagenes.length - 1 ? prev[cabanaId] + 1 : 0
    }));
  };

  // Función para renderizar servicios
  const renderServicios = (servicios) => {
    const serviciosVisibles = (servicios || []).slice(0, 4);
    return (
      <div className="flex flex-wrap gap-2">
        {serviciosVisibles.map((servicio) => {
          const servicioInfo = serviciosDisponibles.find(s => s.value === servicio);
          return servicioInfo ? (
            <span key={`servicio-${servicio}`} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
              {servicioInfo.icon}
              <span className="ml-1">{servicioInfo.label}</span>
            </span>
          ) : (
            <span key={`servicio-${servicio}`} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-lg">
              {servicio}
            </span>
          );
        })}
        {(servicios || []).length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
            +{(servicios || []).length - 4} más
          </span>
        )}
      </div>
    );
  };

  // Helper genérico para obtener datos desde API - consolida la lógica
  const obtenerDatos = async (servicio, setState, onSuccess, errorMsg) => {
    try {
      const respuesta = await servicio();
      const datos = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
      setState(datos);
      if (onSuccess) onSuccess();
    } catch (err) {
      setState([]);
      console.log("Error", `${errorMsg}: ${err.message}`);
    }
  };

  // Obtener cabañas
  const obtenerCabanas = () => obtenerDatos(
    () => cabanaService.getAll(),
    setCabanas,
    () => estadisticasIniciales(),
    'Error al obtener cabañas'
  );

  // Obtener estadísticas
  const estadisticasIniciales = async () => {
    try {
      const stats = await cabanaService.getEstadisticasGenerales();
      setEstadisticas(stats);
    } catch (err) {
      console.log("Error al obtener estadísticas generales: " + err.message);
    }
  };

  // Obtener categorías
  const obtenerCategorias = () => obtenerDatos(
    () => categorizacionService.getAll(),
    setCategorias,
    null,
    'Error al obtener categorías'
  );
  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  // Helper para resetear estado del modal
  const resetearEstado = () => {
    setNuevaCabana(crearCabanaVacia());
    setSelectedImages([]);
    setModoEdicion(false);
    setCabanaSeleccionada(null);
  };

  // Helper genérico para modales - consolidado
  const abrirModal = (tipo, cabana = null) => {
    if (tipo === 'crear') {
      resetearEstado();
      setMostrarModal(true);
    } else if (tipo === 'editar') {
      setModoEdicion(true);
      setCabanaSeleccionada(cabana);
      setMostrarModal(true);
    } else if (tipo === 'ver') {
      setEventoDetalle(cabana);
      setCarouselIndex(0);
      setMostrarModalDetalle(true);
    }
  };

  // Aliases para mantener compatibilidad
  const handleCreate = () => abrirModal('crear');
  const handleEdit = (cabana) => abrirModal('editar', cabana);
  const abrirModalVer = (cabana) => abrirModal('ver', cabana);
  const onVerDetalle = abrirModalVer;
  const onEditar = handleEdit;
  const toggleDisponibilidad = async (cabana) => {
    try {
      const id = cabana._id;
      const nuevoValor = !cabana.disponibilidad;
      await cabanaService.update(id, { disponibilidad: nuevoValor });
      mostrarAlerta('¡Éxito!', `Disponibilidad actualizada`, 'success');
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta('Error', `No se pudo actualizar disponibilidad: ${err.message}`, 'error');
    }
  };

  // Helper genérico para operaciones CRUD de cabañas - consolidado
  const operarCabana = async (operacion, datosPayload = null) => {
    try {
      const body = (datosPayload && typeof datosPayload.preventDefault !== 'function') ? datosPayload : nuevaCabana;
      const id = cabanaSeleccionada?._id;
      
      switch (operacion) {
        case 'crear':
          await cabanaService.create(body);
          mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente", 'success');
          break;
        case 'actualizar':
          if (!id) throw new Error('No se encontró el ID de la cabaña a actualizar');
          await cabanaService.update(id, body);
          mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente", 'success');
          break;
      }
      setMostrarModal(false);
      resetearEstado();
      obtenerCabanas();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };

  // Funciones CRUD derivadas
  const crearCabana = (payload) => operarCabana('crear', payload);
  const actualizarCabana = (payload) => operarCabana('actualizar', payload);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const totalPaginas = Math.ceil(cabanasFiltradas.length / registrosPorPagina);
  const cabanasPaginadas = cabanasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 cuando cambian filtros/búsqueda o la lista de cabañas
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filterCategoria, filterEstado, cabanas.length]);

  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Cabañas</h1>
              <p>Administra reservas y disponibilidad de cabañas</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Cabaña
          </button>
        </div>
        <div className="stats-grid-solicitudes">
          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.totalCabanas}</div>
              <div className="stat-label-solicitudes">Total Cabañas</div>
            </div>
            <div className="stat-icon-solicitudes purple">
              <i className="fas fa-home"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.disponibles}</div>
              <div className="stat-label-solicitudes">Disponibles</div>
            </div>
            <div className="stat-icon-solicitudes orange">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.ocupadas}</div>
              <div className="stat-label-solicitudes">Ocupadas</div>
            </div>
            <div className="stat-icon-solicitudes green">
              <i className="fas fa-users"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.mantenimiento}</div>
              <div className="stat-label-solicitudes">En Mantenimiento</div>
            </div>
            <div className="stat-icon-solicitudes red">
              <i className="fas fa-tools"></i>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar cabañas..."
                id="userSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
            >
              <option value="todos">Todas las Categorías</option>
              {(categorias || []).map((c) => (
                <option key={c._id || c.nombre} value={c._id || c.nombre}>{c.nombre || c._id}</option>
              ))}
            </select>
            <select
              id="statusFilter"
              className="filter-select"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
               <option value="todos">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
         
        </div>


        {/* Lista de Cabañas */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabanasFiltradas.length > 0 ? (
            cabanasPaginadas.map((cabana) => {
              const tipoCabana = obtenerTipoCabana(cabana.tipo);
              const imagenes = Array.isArray(cabana.imagen) ? cabana.imagen : [];
              const imgIndex = imgIndices[cabana._id] || 0;
              let estadoClass = 'bg-gray-500/90 text-white';
              if (cabana.estado === 'disponible') {
                estadoClass = 'bg-emerald-500/90 text-white';
              } else if (cabana.estado === 'ocupada') {
                estadoClass = 'bg-red-500/90 text-white';
              } else if (cabana.estado === 'mantenimiento') {
                estadoClass = 'bg-amber-500/90 text-white';
              }

              // Variables usadas por el markup original (evitan ReferenceError)
              const capacidad = cabana.capacidad ?? cabana.capacidadMaxima ?? '—';
              const precio = cabana.precio ?? cabana.precioPorNoche ?? null;
              const categoria = cabana.categoria?.nombre || cabana.categoria || null;
              const creadoPor = cabana.creadoPor?.nombre || cabana.creadoPor || null;
              // Determina disponibilidad: prioriza `estado === 'disponible'`, si no existe usa el booleano `disponibilidad`.
              const isDisponible = (cabana.estado && String(cabana.estado).toLowerCase() === 'disponible') || Boolean(cabana.disponibilidad);
              const disponibilidadClass = isDisponible ? 'text-emerald-600' : 'text-red-600';
              const disponibilidadNode = isDisponible ? (
                <>
                  <Check className="w-4 h-4 mr-1" /> Disponible
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-1" /> No Disponible
                </>
              );

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
                                  onClick={() => prevImg(cabana._id, imagenes)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                                  style={{ zIndex: 2 }}
                                >
                                  {"<"}
                                </button>
                                <button
                                  onClick={() => nextImg(cabana._id, imagenes)}
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
                  {renderServicios(cabana.servicios || [])}

                  {/* Disponibilidad (usando campo `estado` del modelo) */}
                  <div className="pt-3 border-t border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Disponibilidad:</span>
                          <button
                            type="button"
                            onClick={() => toggleDisponibilidad(cabana)}
                            className={`flex items-center text-sm font-medium cursor-pointer bg-transparent border-0 p-0 ${disponibilidadClass}`}
                          >
                            {disponibilidadNode}
                          </button>
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
                onClick={handleCreate}
                className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Crear Cabaña
              </button>
            </div>
          )}
        </div>
        {mostrarModalDetalle && eventoDetalle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
              <div className="flex items-start justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">{eventoDetalle.nombre}</h2>
                  <p className="text-sm text-slate-500 mt-1">{eventoDetalle.categoria?.nombre || eventoDetalle.categoria} • {eventoDetalle.ubicacion || ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${eventoDetalle.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>{eventoDetalle.estado || '—'}</span>
                  <button onClick={() => setMostrarModalDetalle(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md"><X size={20} /></button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* Carrusel */}
                    {getImagesFromDetalle(eventoDetalle).length > 0 ? (
                      <div>
                        <div className="relative mb-3">
                          <img
                            src={getImagesFromDetalle(eventoDetalle)[carouselIndex]}
                            alt={`Imagen cabaña ${carouselIndex + 1}`}
                            className="w-full h-56 object-cover rounded-lg"
                          />
                          {getImagesFromDetalle(eventoDetalle).length > 1 && (
                            <>
                              <button
                                onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                aria-label="Imagen anterior"
                              >◀</button>
                              <button
                                onClick={() => setCarouselIndex(i => Math.min(i + 1, getImagesFromDetalle(eventoDetalle).length - 1))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                aria-label="Imagen siguiente"
                              >▶</button>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {getImagesFromDetalle(eventoDetalle).map((img) => (
                            <button
                              key={typeof img === 'string' ? img : (img?.name || String(img))}
                              type="button"
                              onClick={() => setCarouselIndex(getImagesFromDetalle(eventoDetalle).indexOf(img))}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCarouselIndex(getImagesFromDetalle(eventoDetalle).indexOf(img)); } }}
                              aria-label={`Mostrar imagen`}
                              className={`p-0 border-0 bg-transparent ${getImagesFromDetalle(eventoDetalle).indexOf(img) === carouselIndex ? 'ring-2 ring-blue-500 rounded' : ''}`}
                            >
                              <img
                                src={typeof img === 'string' ? img : img?.url || ''}
                                alt={`Thumb`}
                                className="w-20 h-14 object-cover rounded cursor-pointer"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-56 flex items-center justify-center bg-slate-100 rounded-lg mb-3 text-sm text-slate-500">Sin imágenes</div>
                    )}

                    <p className="text-sm text-slate-700 leading-relaxed mt-4">{eventoDetalle.descripcion || 'Sin descripción'}</p>
                  </div>

                  <div>
                    <ul className="mt-2 text-sm text-slate-700 space-y-2">
                      <li><strong className="text-slate-800">Capacidad:</strong> {eventoDetalle.capacidad ?? '—'}</li>
                      <li><strong className="text-slate-800">Precio:</strong> ${eventoDetalle.precio ?? 0}</li>
                      <li><strong className="text-slate-800">Ubicación:</strong> {eventoDetalle.ubicacion || '—'}</li>
                      <li><strong className="text-slate-800">Estado:</strong> {eventoDetalle.estado || '—'}</li>
                      <li><strong className="text-slate-800">Creado por:</strong> {eventoDetalle.creadoPor?.nombre || eventoDetalle.creadoPor || '—'}</li>
                      <li><strong className="text-slate-800">Creado:</strong> {eventoDetalle.createdAt ? new Date(eventoDetalle.createdAt).toLocaleString() : '—'}</li>
                      <li><strong className="text-slate-800">Actualizado:</strong> {eventoDetalle.updatedAt ? new Date(eventoDetalle.updatedAt).toLocaleString() : '—'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setMostrarModalDetalle(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarModal && (
          <CabanaModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            cabanaSeleccionada={cabanaSeleccionada}
            setCabanaSeleccionada={setCabanaSeleccionada}
            nuevaCabana={nuevaCabana}
            setNuevaCabana={setNuevaCabana}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarCabana : crearCabana}
            categorias={categorias}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}

        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gestioncabana;