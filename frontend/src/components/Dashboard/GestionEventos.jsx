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
  const [nuevoEvento, setNuevoEvento] = useState({
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
  const [categorias, setCategorias] = useState([]);

  // Obtener eventos
  const obtenerEventos = async () => {
    try {
      const res = await eventService.getAllEvents();
      // Aceptar respuesta en varios formatos: array directo o { success, data }
      let lista = [];
      if (res) {
        if (Array.isArray(res)) lista = res;
        else if (res.data && Array.isArray(res.data)) lista = res.data;
        else if (res.success && Array.isArray(res.data)) lista = res.data;
        else if (res.data) lista = res.data;
      }
      setEventos(lista);
    } catch (error) {
      setEventos([]);
      mostrarAlerta("Error", `No se pudieron obtener los eventos: ${error.message}`);

    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      let lista = [];
      if (res) {
        if (Array.isArray(res)) lista = res;
        else if (res.data && Array.isArray(res.data)) lista = res.data;
        else if (res.data) lista = res.data;
      }
      setCategorias(lista || []);
      obtenerEstadisticas();
    } catch (error) {
      setCategorias([]);
      mostrarAlerta("Error", `No se pudieron obtener las categorías: ${error.message}`);
    }
  };

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  //estadisticas de eventos
  const obtenerEstadisticas = async () => {
    try {
      const stats = await eventService.getEstadisticasGenerales();
      setEstadisticas(stats?.data || stats);
    } catch (error) {
      mostrarAlerta("ERROR", `Error al obtener estadísticas: ${error.message}`, 'error');
    }
  };

  // Función auxiliar para preparar FormData del evento
  const prepararFormDataEvento = () => {
    const formData = new globalThis.FormData();
    for (const [key, value] of Object.entries(nuevoEvento)) {
      if (key === 'etiquetas' && typeof value === 'string') {
        for (const et of value.split(',')) {
          formData.append('etiquetas', et.trim());
        }
      } else {
        formData.append(key, value);
      }
    }
    // Agregar imágenes
    for (const imgObj of selectedImages) {
      if (imgObj.file) formData.append('imagen', imgObj.file);
    }
    return formData;
  };

  // Función auxiliar para resetear el formulario
  const resetearFormulario = () => {
    setMostrarModal(false);
    resetearEstadoEvento();
    setSelectedImages([]);
    obtenerEventos();
  };

  // Crear evento
  const crearEvento = async (formDataFromModal = null, isFormData = false) => {
    try {
      if (formDataFromModal && isFormData) {
        await eventService.createEvent(formDataFromModal, true);
        mostrarAlerta("¡Éxito!", "Evento creado exitosamente con imágenes");
      } else {
        const formData = prepararFormDataEvento();
        await eventService.createEvent(formData, true);
        mostrarAlerta("¡Éxito!", "Evento creado exitosamente");
      }
      resetearFormulario();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear el evento: ${error.message}`);
    }
  };

  // Actualizar evento
  const actualizarEvento = async () => {
    try {
      await eventService.updateEvent(eventoSeleccionado._id, eventoSeleccionado);
      mostrarAlerta("¡Éxito!", "Evento actualizado exitosamente");
      setMostrarModal(false);
      setEventoSeleccionado(null);
      setModoEdicion(false);
      obtenerEventos();
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar el evento: ${error.message}`);
    }
  };

  // Eliminar evento
  const eliminarEvento = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await eventService.deleteEvent(id);
      mostrarAlerta("¡Éxito!", "Evento eliminado exitosamente");
      obtenerEventos();
    } catch (error) {
      mostrarAlerta("Error", `Error al eliminar el evento: ${error.message}`);
    }
  };

  const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
  };
  // Función auxiliar para resetear estado inicial del evento
  const resetearEstadoEvento = () => {
    setNuevoEvento({
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
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    resetearEstadoEvento();
    setMostrarModal(true);
  };

  // Filtrar eventos antes de la paginación
  const eventosFiltrados = eventos.filter(evento => {
    const texto = (filtros.busqueda || '').toLowerCase();
    const nombre = String(evento.nombre || '').toLowerCase();
    const descripcion = String(evento.descripcion || '').toLowerCase();
    const lugar = String(evento.lugar || evento.ubicacion || '').toLowerCase();
    const direccion = String(evento.direccion || '').toLowerCase();
    const etiquetasArr = Array.isArray(evento.etiquetas) ? evento.etiquetas.map(e => String(e).toLowerCase()) : [];
    const categoriaNombre = String(evento.categoria?.nombre || evento.categoria || '').toLowerCase();
    const categorizadoPor = String(evento.categorizadoPor?.nombre || evento.coordinador || '').toLowerCase();

    const cumpleBusqueda = !texto || nombre.includes(texto) || descripcion.includes(texto) || lugar.includes(texto) || direccion.includes(texto) || etiquetasArr.some(et => et.includes(texto)) || categoriaNombre.includes(texto) || categorizadoPor.includes(texto);

    const cumpleCategoria = filtros.categoria === 'todos' || (evento.categoria && (String(evento.categoria._id || evento.categoria) === String(filtros.categoria)));

    // Estado: preferir boolean 'active' en el modelo; si existe 'estado' usarlo también
    let cumpleEstado = true;
    if (filtros.estado && filtros.estado !== 'todos') {
      if (filtros.estado === 'activo') cumpleEstado = evento.active === true || String(evento.estado || '').toLowerCase() === 'activo';
      else if (filtros.estado === 'inactivo') cumpleEstado = evento.active === false || String(evento.estado || '').toLowerCase() === 'inactivo';
      else cumpleEstado = String(evento.estado || '').toLowerCase() === String(filtros.estado).toLowerCase();
    }

    return cumpleBusqueda && cumpleCategoria && cumpleEstado;
  });

  // Paginación para eventos
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const totalPaginas = Math.ceil(eventosFiltrados.length / registrosPorPagina);
  const eventosPaginados = eventosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );
  // Abrir modal para editar
  const abrirModalEditar = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado({ ...evento });
    setMostrarModal(true);
  };

  // Helpers para el carrusel de imágenes del detalle
  const getImagesFromDetalle = (detalle) => {
    if (!detalle) return [];
    if (Array.isArray(detalle.imagen)) return detalle.imagen;
    if (detalle.imagen) return [detalle.imagen];
    return [];
  };

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
                      {getImagesFromDetalle(eventoDetalle).length > 0 ? (
                        <div>
                          <div className="relative mb-3">
                            <img
                              src={getImagesFromDetalle(eventoDetalle)[carouselIndex]}
                              alt={`Imagen evento ${carouselIndex + 1}`}
                              className="w-full h-56 object-cover rounded-lg"
                            />
                            {getImagesFromDetalle(eventoDetalle).length > 1 && (
                              <>
                                <button
                                  onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                >◀</button>
                                <button
                                  onClick={() => setCarouselIndex(i => Math.min(i + 1, getImagesFromDetalle(eventoDetalle).length - 1))}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                >▶</button>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {getImagesFromDetalle(eventoDetalle).map((img, idx) => (
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
