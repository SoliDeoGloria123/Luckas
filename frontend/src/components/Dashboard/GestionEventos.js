import { useState, useEffect } from "react";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaEventos from "./Tablas/EventoTabla";
import EventoModal from "./Modales/EventoModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
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

  return (
    <div className="seccion-usuarios">
      <div className="page-header-Academicos">
        <h1 className="titulo-admin" >Gestión de Eventos</h1>
        <button className="btn-admin" onClick={abrirModalCrear}>
          + Nuevo Evento
        </button>
      </div>
      <section className="filtros-section-admin">
        <div className="busqueda-contenedor">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar Eventos..."
            // value={busqueda}
            //onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
        <div className="filtro-grupo-admin">
          <select className="filtro-dropdown">
            <option>Todos los Roles</option>
            <option>Administrador</option>
            <option>Seminarista</option>
            <option>Tesorero</option>
            <option>Usuario Externo</option>
          </select>
          <select className="filtro-dropdown">
            <option>Todos los Estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
            <option>Pendiente</option>
          </select>
        </div>

        <TablaEventos
          eventos={eventos}
          onEditar={abrirModalEditar}
          onEliminar={eliminarEvento}
          onVerImagen={handleVerImagenes}
        />
        {modalImagen.abierto && (
          <div className="modal-overlay" onClick={cerrarModalImagen}>
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
      </section>
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
  );
};

export default GestionEventos;
