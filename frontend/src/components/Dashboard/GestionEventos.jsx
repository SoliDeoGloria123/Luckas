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
  const [cargando, setCargando] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "",
    fechaEvento: "",
    horaInicio: "",
    horaFin: "",
    lugar: "",
    cuposTotales: 0,
    cuposDisponibles: 0,
    prioridad: "Media",
    active: true,
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
    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  // Crear evento
  const crearEvento = async () => {
    try {
      await eventService.createEvent(nuevoEvento);
      mostrarAlerta("¡Éxito!", "Evento creado exitosamente");
      setMostrarModal(false);
      setNuevoEvento({
        nombre: "",
        descripcion: "",
        categoria: "",
        fechaEvento: "",
        horaInicio: "",
        horaFin: "",
        lugar: "",
        prioridad: "Media",
        precio: Number(nuevoEvento.precio),
        cuposTotales: Number(nuevoEvento.cuposTotales),
        cuposDisponibles: Number(nuevoEvento.cuposDisponibles),
        active: nuevoEvento.active === "true" || nuevoEvento.active === true,
        imagen: ""
      });
      obtenerEventos();
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
      mostrarAlerta("Error"`Error al actualizar el evento: ${error.message}`);
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
      mostrarAlerta("Error"`Error al eliminar el evento: ${error.message}`);
    }
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevoEvento({
      nombre: "",
      descripcion: "",
      precio: 0,
      categoria: "",
      fechaEvento: "",
      horaInicio: "",
      horaFin: "",
      lugar: "",
      cuposTotales: 0,
      cuposDisponibles: 0,
      prioridad: "Media",
      active: true,
      imagen: ""
    });
    setMostrarModal(true);
  };

  const [modalImagen, setModalImagen] = useState({ abierto: false, imagenes: [], actual: 0 });

  const handleVerImagenes = (imagenes) => {
    if (Array.isArray(imagenes) && imagenes.length > 0) {
      setModalImagen({ abierto: true, imagenes, actual: 0 });
    }
  };
  const handleNext = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual + 1) % prev.imagenes.length
    }));
  };

  const handlePrev = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual - 1 + prev.imagenes.length) % prev.imagenes.length
    }));
  };

  const cerrarModalImagen = () => {
    setModalImagen({ abierto: false, imagenes: [], actual: 0 });
  };

  // Abrir modal para editar
  const abrirModalEditar = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado({ ...evento });
    setMostrarModal(true);
  };

  const eventosFiltrados = eventos.filter(evento => {
    const cumpleBusqueda = evento.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      evento.ubicacion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      evento.coordinador?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleTipo = filtros.tipo === 'todos' || evento.tipo === filtros.tipo;
    const cumpleEstado = filtros.estado === 'todos' || evento.estado === filtros.estado;

    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });


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

          {modalImagen.abierto && (
            <div className="modal-overlay-admin" onClick={cerrarModalImagen}>
              <div className="modal-imagines modal-imagines" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cerrar" onClick={cerrarModalImagen}>✖</button>
                <button className="btn-flecha izquierda" onClick={handlePrev}>◀</button>
                <img
                  src={`http://localhost:3000/uploads/eventos/${modalImagen.imagenes[modalImagen.actual]}`}
                  alt="Imagen del evento"
                  className="imagen-modal"
                />
                <button className="btn-flecha derecha" onClick={handleNext}>▶</button>
              </div>
            </div>
          )}

          <TablaEventos
            eventos={eventos}
            cargando={cargando}
            onEditar={abrirModalEditar}
            onEliminar={eliminarEvento}
            onVerImagen={handleVerImagenes}
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
            onSubmit={modoEdicion ? actualizarEvento : crearEvento}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionEventos;
