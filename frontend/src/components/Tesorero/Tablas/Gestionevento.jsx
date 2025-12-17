import React, { useState, useEffect } from 'react';
import { eventService } from "../../../services/eventService";
import { categorizacionService } from "../../../services/categorizacionService";
import { mostrarAlerta } from '../../utils/alertas';
import EventoModal from '../../Dashboard/Modales/EventoModal';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import {
  Edit,
  Calendar,
  Eye,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';

// ============ HELPERS CENTRALIZADOS ============

// Helper genérico para extraer lista de respuesta API
const extraerListaDeRespuesta = (respuesta) => {
  if (!respuesta) return [];
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta.data && Array.isArray(respuesta.data)) return respuesta.data;
  return [];
};

// Helper para filtrado flexible - CONSOLIDADO
const pasaFiltroGenerico = (objeto, filterValue, comparadores) => {
  if (!filterValue || filterValue === '' || filterValue === 'todos') return true;
  return comparadores.some(comp => comp(objeto, filterValue));
};

// Funciones de filtrado unificadas - reduce duplicación
const crearFiltroEvento = (tipo) => {
  const filtros = {
    categoria: (evento, filterCategoria) => {
      const cat = evento.categoria?._id || evento.categoria?.nombre || evento.categoria;
      return pasaFiltroGenerico(evento, filterCategoria, [
        (e, val) => String(cat) === String(val),
        (e, val) => String((e.categoria?.nombre || '')).toLowerCase() === String(val).toLowerCase(),
      ]);
    },
    estado: (evento, filterEstado) => {
      const comparadores = [
        (e, val) => String(val).toLowerCase() === 'activo' && (e.active === true || String(e.estado).toLowerCase() === 'activo'),
        (e, val) => String(val).toLowerCase() === 'inactivo' && (e.active === false || String(e.estado).toLowerCase() === 'inactivo'),
        (e, val) => (e.estado || '').toLowerCase() === String(val).toLowerCase(),
      ];
      return pasaFiltroGenerico(evento, filterEstado, comparadores);
    },
    busqueda: (evento, searchTerm) => {
      if (!searchTerm) return true;
      const q = String(searchTerm).trim().toLowerCase();
      if (!q) return true;
      return [
        (evento.nombre || '').toLowerCase(),
        (evento.descripcion || '').toLowerCase(),
        (evento.lugar || '').toLowerCase(),
        (evento.direccion || '').toLowerCase(),
        (evento.categoria?.nombre || '').toLowerCase(),
      ].some(campo => campo.includes(q));
    }
  };
  return filtros[tipo] || (() => true);
};

const pasaFiltroPorCategoriaEvento = (evento, filterCategoria) => crearFiltroEvento('categoria')(evento, filterCategoria);
const pasaFiltroPorEstadoEvento = (evento, filterEstado) => crearFiltroEvento('estado')(evento, filterEstado);
const pasaFiltroPorBusquedaEvento = (evento, searchTerm) => crearFiltroEvento('busqueda')(evento, searchTerm);

// Helper para formatear fecha
const formatFecha = (f) => {
  if (!f && f !== 0) return '';
  const str = String(f).trim();
  const d = new Date(str);
  if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('es-ES');

  let sep = null;
  if (str.includes('/')) sep = '/';
  else if (str.includes('-')) sep = '-';
  
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

// Helper para obtener imágenes desde varios formatos
const getImagesFromEvento = (evento) => {
  if (!evento) return [];
  if (Array.isArray(evento.imagen)) return evento.imagen;
  if (Array.isArray(evento.imagenes)) return evento.imagenes;
  if (Array.isArray(evento.images)) return evento.images;
  if (evento.imagen && typeof evento.imagen === 'string') return [evento.imagen];
  return [];
};

const Gestionevento = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  // Filtros y buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    capacidad: '',
    ubicacion: '',
    categoria: '',
    estado: 'activo'
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [estadisticas, setEstadisticas] = useState({ totalEvents: 0, upcoming: 0, completed: 0, cancelled: 0 });

  // Helper genérico consolidado para cargar datos
  const cargarDatos = async (servicio, setState, onSuccess, errorMsg) => {
    try {
      const res = await servicio();
      const lista = extraerListaDeRespuesta(res);
      setState(lista);
      if (onSuccess) onSuccess();
    } catch (error) {
      setState([]);
      mostrarAlerta("Error", `${errorMsg}: ${error.message}`, 'error');
    }
  };

  // Funciones derivadas - reutilizan cargarDatos
  const obtenerEventos = () => cargarDatos(
    () => eventService.getAllEvents(),
    setEventos,
    null,
    'No se pudieron obtener los eventos'
  );

  const obtenerCategorias = () => cargarDatos(
    () => categorizacionService.getAll(),
    setCategorias,
    obtenerEstadisticas,
    'No se pudieron obtener las categorías'
  );

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  // Estadísticas de eventos
  const obtenerEstadisticas = async () => {
    try {
      const stats = await eventService.getEstadisticasGenerales();
      setEstadisticas(stats?.data || stats);
    } catch (error) {
      mostrarAlerta("Error", `Error al obtener estadísticas: ${error.message}`, 'error');
    }
  };

  // Estado de filtrado
  const eventosFiltrados = (eventos || []).filter((ev) => {
    return pasaFiltroPorCategoriaEvento(ev, filterCategoria) &&
           pasaFiltroPorEstadoEvento(ev, filterEstado) &&
           pasaFiltroPorBusquedaEvento(ev, searchTerm);
  });

  // Carrusel de imágenes: un índice por evento
  const [imgIndices, setImgIndices] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Helper unificado para navegación de imágenes
  const navegarImagen = (eventoId, totalImages, direction) => {
    setImgIndices(prev => {
      const currentIndex = prev[eventoId] || 0;
      let newIndex;
      if (direction === 'next') {
        newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
      } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
      }
      return { ...prev, [eventoId]: newIndex };
    });
  };

  const prevImg = (eventoId, totalImages) => navegarImagen(eventoId, totalImages, 'prev');
  const nextImg = (eventoId, totalImages) => navegarImagen(eventoId, totalImages, 'next');

  // Consolidar handlers de modales
  const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
  };
  
  const onVerDetalle = abrirModalVer; // Alias para mantener consistencia

  const resetNuevoEvento = () => ({
    nombre: '', descripcion: '', fecha: '', capacidad: '', ubicacion: '', categoria: '', estado: 'activo'
  });

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setEventoSeleccionado(null);
    setNuevoEvento(resetNuevoEvento());
    setSelectedImages([]);
    setMostrarModal(true);
  };

  const abrirModalEditar = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado(evento);
    setMostrarModal(true);
  };
  
  const handleCreate = abrirModalCrear; // Alias anterior
  const onEditar = abrirModalEditar; // Alias adicional

  // Consolidado: Manejar submit de eventos (crear o actualizar)
  const guardarEvento = (esEdicion) => async (payload) => {
    try {
      // Detectar si es un evento del formulario o payload directo
      if (payload?.preventDefault) payload.preventDefault();
      
      // Extraer body de forma clara (reducir ternario anidado)
      const esEventoFormulario = payload && !payload.preventDefault;
      const datosEvento = esEdicion ? (eventoSeleccionado || nuevoEvento) : nuevoEvento;
      const bodyData = esEventoFormulario ? payload : datosEvento;
      
      const isFormData = bodyData instanceof FormData;
      const eventoId = bodyData?._id;
      
      if (esEdicion && !eventoId) {
        mostrarAlerta('Error', 'No se encontró el ID del evento a actualizar');
        return;
      }
      
      await (esEdicion 
        ? eventService.updateEvent(eventoId, bodyData, isFormData)
        : eventService.createEvent(bodyData, isFormData));
      
      mostrarAlerta("¡Éxito!", `Evento ${esEdicion ? 'actualizado' : 'creado'} exitosamente`);
      setMostrarModal(false);
      obtenerEventos();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };

  // Aliases para mantener compatibilidad
  const crearEvento = guardarEvento(false);
  const actualizarEvento = guardarEvento(true);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const totalPaginas = Math.ceil(eventosFiltrados.length / registrosPorPagina);
  const eventosPaginados = eventosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 cuando cambian filtros, búsqueda o la lista de eventos
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filterCategoria, filterEstado, eventos.length]);

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
              <h1>Gestión de Eventos</h1>
              <p>Administra y organiza todos los eventos del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nuevo Evento
          </button>
        </div>

        <div className="stats-grid-solicitudes">
          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.totalEvents}</div>
              <div className="stat-label-solicitudes">Total Eventos</div>
            </div>
            <div className="stat-icon-solicitudes purple">
              <i className="fas fa-calendar-alt"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.upcoming}</div>
              <div className="stat-label-solicitudes">Próximos</div>
            </div>
            <div className="stat-icon-solicitudes orange">
              <i className="fas fa-clock"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.completed}</div>
              <div className="stat-label-solicitudes">Completados</div>
            </div>
            <div className="stat-icon-solicitudes green">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">{estadisticas.cancelled}</div>
              <div className="stat-label-solicitudes">Cancelados</div>
            </div>
            <div className="stat-icon-solicitudes red">
              <i className="fas fa-times-circle"></i>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar eventos..."
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
              <option value="todos">Todas las categorías</option>
              {(categorias || []).map((c) => (
                <option key={c._id || c.nombre} value={c._id || c.nombre}>
                  {c.nombre || c._id}
                </option>
              ))}
            </select>
            <select
              id="statusFilter"
              className="filter-select"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="cancelado">Cancelado</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {

            if (eventosFiltrados.length > 0) {
              return eventosPaginados.map((evento) => {
                const imagenes = Array.isArray(evento.imagen) ? evento.imagen : [];
                const imgIndex = imgIndices[evento._id] || 0;

                // Determinar clases para el estado del evento (no usadas aquí)

                // Variables locales usadas en el markup
                const categoriaNombre = evento.categoria?.nombre || evento.categoria || null;
                let etiquetas = [];
                if (evento.etiquetas) {
                  etiquetas = Array.isArray(evento.etiquetas) ? evento.etiquetas : [evento.etiquetas];
                }

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
                          <span className={`px-3 py-1 text-base font-medium rounded-full shadow-md ${evento.active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                            }`}>
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
              }); // end map
            } // end if
            return null;
          })()}
        </div>
        {/* Lista de Eventos */}
        {mostrarModalDetalle && eventoDetalle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
              <div className="flex items-start justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">{eventoDetalle.nombre}</h2>
                  <p className="text-sm text-slate-500 mt-1">{eventoDetalle.categoria?.nombre || eventoDetalle.categoria} • {eventoDetalle.fechaEvento ? new Date(eventoDetalle.fechaEvento).toLocaleDateString() : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${eventoDetalle.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>{eventoDetalle.active ? 'Activo' : 'Inactivo'}</span>
                  <button onClick={() => setMostrarModalDetalle(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md">✕</button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* Carrusel */}
                    {getImagesFromEvento(eventoDetalle).length > 0 ? (
                      <div>
                        <div className="relative mb-3">
                          <img
                            src={getImagesFromEvento(eventoDetalle)[carouselIndex]}
                            alt={`Imagen evento ${carouselIndex + 1}`}
                            className="w-full h-56 object-cover rounded-lg"
                          />
                          {getImagesFromEvento(eventoDetalle).length > 1 && (
                            <>
                              <button
                                onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                              >◀</button>
                              <button
                                onClick={() => setCarouselIndex(i => Math.min(i + 1, getImagesFromEvento(eventoDetalle).length - 1))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                              >▶</button>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {getImagesFromEvento(eventoDetalle).map((img, idx) => (
                            <button
                              key={img}
                              type="button"
                              onClick={() => setCarouselIndex(idx)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCarouselIndex(idx); } }}
                              aria-label={`Mostrar imagen ${idx + 1}`}
                              className={`p-0 border-0 bg-transparent ${carouselIndex === idx ? 'ring-2 ring-blue-500 rounded' : ''}`}
                            >
                              <img
                                src={img}
                                alt={`Thumb ${idx + 1}`}
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

                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      <li><strong className="text-slate-800">Lugar:</strong> {eventoDetalle.lugar || '—'}</li>
                      <li><strong className="text-slate-800">Dirección:</strong> {eventoDetalle.direccion || '—'}</li>
                      <li><strong className="text-slate-800">Hora:</strong> {eventoDetalle.horaInicio || '—'} - {eventoDetalle.horaFin || '—'}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-800">Detalles</h4>
                      <div className="mt-2 text-sm text-slate-700 space-y-1">
                        <div><strong>Duración (días):</strong> {eventoDetalle.duracionDias ?? '—'}</div>
                        <div><strong>Cupos totales:</strong> {eventoDetalle.cuposTotales ?? '—'}</div>
                        <div><strong>Cupos disponibles:</strong> {eventoDetalle.cuposDisponibles ?? '—'}</div>
                        <div><strong>Precio:</strong> ${eventoDetalle.precio ?? 0}</div>
                        <div><strong>Prioridad:</strong> {eventoDetalle.prioridad || '—'}</div>

                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Observaciones</h4>
                      <p className="text-sm text-slate-700 mt-2">{eventoDetalle.observaciones || '—'}</p>
                    </div>
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

        {mostrarModal && (
          <EventoModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            eventoSeleccionado={eventoSeleccionado}
            setEventoSeleccionado={setEventoSeleccionado}
            nuevoEvento={nuevoEvento}
            setNuevoEvento={setNuevoEvento}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarEvento : crearEvento}
            categorias={categorias}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}

      </main>
      <Footer />
    </>
  );
};

export default Gestionevento;