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
  const [filtros, setFiltros] = useState({ busqueda: '', tipo: 'todos', estado: 'todos' });
  const [cargando] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);


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
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setEventos([]);
      mostrarAlerta("Error", `No se pudieron obtener los eventos: ${error.message}`);

    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
      mostrarAlerta("Error", `No se pudieron obtener las categorías: ${error.message}`);
    }
  };

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  // Función auxiliar para preparar FormData del evento
  const prepararFormDataEvento = () => {
    const formData = new globalThis.FormData();
    for (const [key, value] of Object.entries(nuevoEvento)) {
      if (key === 'etiquetas' && typeof value === 'string') {
        value.split(',').forEach(et => formData.append('etiquetas', et.trim()));
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
    const cumpleBusqueda = evento.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      evento.ubicacion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      evento.coordinador?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleTipo = filtros.tipo === 'todos' || evento.tipo === filtros.tipo;
    const cumpleEstado = filtros.estado === 'todos' || evento.estado === filtros.estado;
    return cumpleBusqueda && cumpleTipo && cumpleEstado;
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
        <div className="seccion-usuarios">
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
                <h3>5</h3>
                <p>Total Usuarios</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info-admin">
                <h3>4</h3>
                <p>Usuarios Activos</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info-admin">
                <h3>1</h3>
                <p>Administradores</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>12</h3>
                <p>Nuevos Este Mes</p>
              </div>
            </div>
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
                {/*tiposEventos.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))*/}
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
          {mostrarModalDetalle && eventoDetalle && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                <h2 className="text-2xl font-bold mb-4">{eventoDetalle.nombre}</h2>
                <p className="mb-2"><strong>Descripción:</strong> {eventoDetalle.descripcion}</p>
                <p className="mb-2"><strong>Categoría:</strong> {eventoDetalle.categoria?.nombre || eventoDetalle.categoria}</p>
                <p className="mb-2"><strong>Etiquetas:</strong> {eventoDetalle.etiquetas?.join(', ')}</p>
                <p className="mb-2"><strong>Fecha:</strong> {eventoDetalle.fechaEvento ? new Date(eventoDetalle.fechaEvento).toLocaleDateString() : ''}</p>
                <p className="mb-2"><strong>Hora:</strong> {eventoDetalle.horaInicio} - {eventoDetalle.horaFin}</p>
                <p className="mb-2"><strong>Lugar:</strong> {eventoDetalle.lugar}</p>
                <p className="mb-2"><strong>Dirección:</strong> {eventoDetalle.direccion}</p>
                <p className="mb-2"><strong>Duración (días):</strong> {eventoDetalle.duracionDias}</p>
                <p className="mb-2"><strong>Cupos totales:</strong> {eventoDetalle.cuposTotales}</p>
                <p className="mb-2"><strong>Cupos disponibles:</strong> {eventoDetalle.cuposDisponibles}</p>
                <p className="mb-2"><strong>Precio:</strong> ${eventoDetalle.precio}</p>
                <p className="mb-2"><strong>Prioridad:</strong> {eventoDetalle.prioridad}</p>
                <p className="mb-2"><strong>Observaciones:</strong> {eventoDetalle.observaciones}</p>
                <p className="mb-2"><strong>Coordinador:</strong> {eventoDetalle.categorizadoPor?.nombre || eventoDetalle.categorizadoPor}</p>
                <p className="mb-2"><strong>Fecha categorización:</strong> {eventoDetalle.fechaCategorizacion ? new Date(eventoDetalle.fechaCategorizacion).toLocaleDateString() : ''}</p>
                <p className="mb-2"><strong>Activo:</strong> {eventoDetalle.active ? 'Sí' : 'No'}</p>
                <p className="mb-2"><strong>Programa:</strong> {eventoDetalle.programa && eventoDetalle.programa.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {eventoDetalle.programa.map((mod, i) => (
                      <li key={mod.id || mod.tema}>
                        <strong>{mod.tema}</strong> ({mod.horaInicio} - {mod.horaFin}): {mod.descripcion}
                      </li>
                    ))}
                  </ul>
                ) : 'No definido'}
                </p>
                <div className="flex flex-wrap gap-2 my-4">
                  {Array.isArray(eventoDetalle.imagen) && eventoDetalle.imagen.map((img, idx) => (
                    <img
                      key={img}
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setMostrarModalDetalle(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          <TablaEventos
            eventos={eventosPaginados}
            cargando={cargando}
            onEditar={abrirModalEditar}
            onEliminar={eliminarEvento}
            onVerDetalle={abrirModalVer}
            eventosFiltrados={eventosFiltrados}
          />
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
      </div>
    </div>
  );
};

export default GestionEventos;
