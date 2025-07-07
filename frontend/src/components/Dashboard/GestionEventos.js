import { useState, useEffect } from "react";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaEventos from "./Tablas/EventoTabla";
import EventoModal from "./Modales/EventoModal";

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
      alert("Evento creado exitosamente");
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
      alert(`Error al crear el evento: ${error.message}`);
    }
  };

  // Actualizar evento
  const actualizarEvento = async () => {
    try {
      await eventService.updateEvent(eventoSeleccionado._id, eventoSeleccionado);
      alert("Evento actualizado exitosamente");
      setMostrarModal(false);
      setEventoSeleccionado(null);
      setModoEdicion(false);
      obtenerEventos();
    } catch (error) {
      alert(`Error al actualizar el evento: ${error.message}`);
    }
  };

  // Eliminar evento
  const eliminarEvento = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    try {
      await eventService.deleteEvent(id);
      alert("Evento eliminado exitosamente");
      obtenerEventos();
    } catch (error) {
      alert(`Error al eliminar el evento: ${error.message}`);
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

  // Abrir modal para editar
  const abrirModalEditar = (evento) => {
    setModoEdicion(true);
    setEventoSeleccionado({ ...evento });
    setMostrarModal(true);
  };

  return (
    <div className="seccion-usuarios">
      <div className="page-header-Academicos">
        <h2>Gestión de Eventos</h2>
        <button className="btn-primary" onClick={abrirModalCrear}>
          + Nuevo Evento
        </button>
      </div>
      <TablaEventos
        eventos={eventos}
        onEditar={abrirModalEditar}
        onEliminar={eliminarEvento}
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
  );
};

export default GestionEventos;
