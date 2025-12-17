import { useState, useEffect } from "react";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaEventos from "./Tablas/EventoTabla";
import EventoModal from "./Modales/EventoModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';

import {
  Plus,
  Search,
} from 'lucide-react';

// ============ HELPERS CENTRALIZADOS ============

// Helper genérico para extraer lista de respuesta API
const extraerListaDeRespuesta = (respuesta) => {
  if (!respuesta) return [];
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta.data && Array.isArray(respuesta.data)) return respuesta.data;
  return [];
};


const crearEventoVacio = () => ({
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "",
  fechaEvento: "",
  horaInicio: "",
  horaFin: "",
  lugar: "",
  direccion: "",
  duracionDias: 1,
  cuposTotales: 0,
  cuposDisponibles: 0,
  prioridad: "Media",
  active: true,
  etiquetas: "",
  observaciones: "",
  imagen: ""
});

// Helper para obtener imágenes desde varios formatos
const getImagesFromEvento = (evento) => {
  if (!evento) return [];
  if (Array.isArray(evento.imagen)) return evento.imagen;
  if (evento.imagen) return [evento.imagen];
  return [];
};

// Helper genérico para obtener datos
const obtenerDatosGenerico = async (servicio, setState, onSuccess, errorMsg) => {
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

// Helper para filtrar eventos
const filtrarEventos = (eventos, filtros) => {
  return eventos.filter(evento => {
    const texto = (filtros.busqueda || '').toLowerCase();
    const campos = [
      String(evento.nombre || '').toLowerCase(),
      String(evento.descripcion || '').toLowerCase(),
      String(evento.lugar || evento.ubicacion || '').toLowerCase(),
      String(evento.direccion || '').toLowerCase(),
      ...(Array.isArray(evento.etiquetas) ? evento.etiquetas.map(e => String(e).toLowerCase()) : []),
      String(evento.categoria?.nombre || evento.categoria || '').toLowerCase(),
      String(evento.categorizadoPor?.nombre || evento.coordinador || '').toLowerCase(),
    ];

    const cumpleBusqueda = !texto || campos.some(campo => campo.includes(texto));

    const cumpleCategoria = filtros.categoria === 'todos' || 
      (evento.categoria && (String(evento.categoria._id || evento.categoria) === String(filtros.categoria)));

    let cumpleEstado = true;
    if (filtros.estado && filtros.estado !== 'todos') {
      const esActivo = evento.active === true || String(evento.estado || '').toLowerCase() === 'activo';
      const esInactivo = evento.active === false || String(evento.estado || '').toLowerCase() === 'inactivo';
      
      if (filtros.estado === 'activo') cumpleEstado = esActivo;
      else if (filtros.estado === 'inactivo') cumpleEstado = esInactivo;
      else cumpleEstado = String(evento.estado || '').toLowerCase() === String(filtros.estado).toLowerCase();
    }

    return cumpleBusqueda && cumpleCategoria && cumpleEstado;
  });
};

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({ busqueda: '', categoria: 'todos', estado: 'todos' });
  const [cargando] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [estadisticas, setEstadisticas] = useState({ totalEvents: 0, upcoming: 0, completed: 0, cancelled: 0 });
  const [nuevoEvento, setNuevoEvento] = useState(crearEventoVacio());
  const [categorias, setCategorias] = useState([]);

  // Obtener eventos y categorías
  const obtenerEventos = () => obtenerDatosGenerico(
    () => eventService.getAllEvents(),
    setEventos,
    null,
    'No se pudieron obtener los eventos'
  );

  const obtenerCategorias = () => obtenerDatosGenerico(
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
      mostrarAlerta("ERROR", `Error al obtener estadísticas: ${error.message}`, 'error');
    }
  };

  // Helper para preparar FormData del evento
  const prepararFormDataEvento = (eventoData = nuevoEvento) => {
    const formData = new globalThis.FormData();
    for (const [key, value] of Object.entries(eventoData)) {
      if (key === 'etiquetas' && typeof value === 'string') {
        for (const et of value.split(',')) {
          formData.append('etiquetas', et.trim());
        }
      } else {
        formData.append(key, value);
      }
    }
    for (const imgObj of selectedImages) {
      if (imgObj.file) formData.append('imagen', imgObj.file);
    }
    return formData;
  };

  // Helper para resetear estado
  const resetearEstado = () => {
    setNuevoEvento(crearEventoVacio());
    setSelectedImages([]);
    setModoEdicion(false);
    setEventoSeleccionado(null);
  };

  // Helper genérico para modales - consolidado
  const abrirModal = (tipo, evento = null) => {
    if (tipo === 'crear') {
      resetearEstado();
      setModoEdicion(false);
      setMostrarModal(true);
    } else if (tipo === 'editar') {
      setModoEdicion(true);
      setEventoSeleccionado({ ...
        evento });
      setMostrarModal(true);
    } else if (tipo === 'ver') {
      setEventoDetalle(evento);
      setMostrarModalDetalle(true);
    }
  };

  // Aliases para mantener compatibilidad con otros usos
  const abrirModalCrear = () => abrirModal('crear');
  const abrirModalEditar = (evento) => abrirModal('editar', evento);
  const abrirModalVer = (evento) => abrirModal('ver', evento);

  // Helper genérico para operaciones CRUD de eventos - consolidado
  const operarEvento = async (operacion, idEvento = null, datosEvento = null) => {
    try {
      const mensajes = {
        crear: 'Evento creado exitosamente',
        actualizar: 'Evento actualizado exitosamente',
        eliminar: 'Evento eliminado exitosamente'
      };
      
      switch (operacion) {
        case 'crear': {
          const formData = datosEvento instanceof FormData ? datosEvento : prepararFormDataEvento(datosEvento);
          await eventService.createEvent(formData, true);
          break;
        }
        case 'actualizar': {
          await eventService.updateEvent(idEvento || eventoSeleccionado._id, datosEvento || eventoSeleccionado);
          break;
        }
        case 'eliminar': {
          if (!await mostrarConfirmacion("¿Estás seguro?", "Esta acción eliminará el evento de forma permanente.")) return;
          await eventService.deleteEvent(idEvento);
          break;
        }
      }
      mostrarAlerta("¡Éxito!", mensajes[operacion]);
      setMostrarModal(false);
      resetearEstado();
      obtenerEventos();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };

  // Funciones CRUD derivadas
  const crearEvento = (formDataFromModal = null, isFormData = false) => operarEvento('crear', null, formDataFromModal);
  const actualizarEvento = () => operarEvento('actualizar');
  const eliminarEvento = (id) => operarEvento('eliminar', id);

  // Filtrar eventos antes de la paginación
  const eventosFiltrados = filtrarEventos(eventos, filtros);

  // Paginación para eventos
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const totalPaginas = Math.ceil(eventosFiltrados.length / registrosPorPagina);
  const eventosPaginados = eventosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  useEffect(() => {
    setCarouselIndex(0);
  }, [eventoDetalle]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Sidebar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        <Header
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          seccionActiva={seccionActiva}
        />
        <div className="space-y-7 fade-in-up p-9">
          {/* Header */}
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1 >Gestión de Eventos</h1>
              <p>Administra campamentos, retiros y actividades del seminario</p>
            </div>
            <button
              onClick={abrirModalCrear}
              className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento</span>
            </button>
          </div>
          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin users">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.totalEvents}</h3>
                <p>Total Eventos</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.upcoming}</h3>
                <p>Próximos</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.completed}</h3>
                <p>Completados</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.cancelled}</h3>
                <p>Cancelados</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filtros.busqueda}
                  onChange={(e) => { setFiltros({ ...filtros, busqueda: e.target.value }); setPaginaActual(1); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex space-x-3">

                <select
                  value={filtros.categoria}
                  onChange={(e) => { setFiltros({ ...filtros, categoria: e.target.value }); setPaginaActual(1); }}
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="todos">Todas las categorías</option>
                  {Array.isArray(categorias) && categorias.map((cat) => (
                    <option key={cat._id || cat.id || cat.codigo} value={cat._id || cat.id || cat.codigo}>
                      {cat.nombre || cat.label || cat.codigo}
                    </option>
                  ))}
                </select>

                <select
                  value={filtros.estado}
                  onChange={(e) => { setFiltros({ ...filtros, estado: e.target.value }); setPaginaActual(1); }}
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

            </div>
          </div>

         
          <TablaEventos
            eventos={eventosPaginados}
            cargando={cargando}
            onEditar={abrirModalEditar}
            onEliminar={eliminarEvento}
            onVerDetalle={abrirModalVer}
            eventosFiltrados={eventosFiltrados}
          />
          
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
        </div>
        <EventoModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            eventoSeleccionado={eventoSeleccionado}
            setEventoSeleccionado={setEventoSeleccionado}
            nuevoEvento={nuevoEvento}
            setNuevoEvento={setNuevoEvento}
            categorias={categorias}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarEvento : (formData, isFormData) => crearEvento(formData, isFormData)}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
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
      </div>
    </div>
  );
};

export default GestionEventos;
