import { useState, useEffect } from "react";
import { inscripcionService } from "../../services/inscripcionService";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaInscripciones from "./Tablas/InscripcionTabla";
import InscripcionModal from "./Modales/InscripsionModal";

const GestionIscripcion = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [nuevaInscripcion, setNuevaInscripcion] = useState({
    usuario: "",
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    correo: "",
    telefono: "",
    edad: "",
    evento: "",
    categoria: "",
    estado: "pendiente",
    observaciones: "",
    solicitud: ""
  });
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Obtener inscripciones
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setInscripciones([]);
    }
  };

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
    obtenerInscripciones();
    obtenerEventos();
    obtenerCategorias();
  }, []);

  // Crear inscripción
  const crearInscripcion = async () => {
    try {
      // Elimina el campo solicitud si está vacío
      const insc = { ...nuevaInscripcion };
      if (!insc.solicitud || insc.solicitud === "") {
        delete insc.solicitud;
      }
      await inscripcionService.create(insc);
      alert("Inscripción creada exitosamente");
      setMostrarModal(false);
      setNuevaInscripcion({
        usuario: "",
        nombre: "",
        apellido: "",
        tipoDocumento: "",
        numeroDocumento: "",
        correo: "",
        telefono: "",
        edad: "",
        evento: "",
        categoria: "",
        estado: "pendiente",
        observaciones: "",
        solicitud: ""
      });
      obtenerInscripciones();
    } catch (error) {
      alert(`Error al crear la inscripción: ${error.message}`);
    }
  };

  // Actualizar inscripción
  const actualizarInscripcion = async () => {
    try {
      await inscripcionService.update(inscripcionSeleccionada._id, inscripcionSeleccionada);
      alert("Inscripción actualizada exitosamente");
      setMostrarModal(false);
      setInscripcionSeleccionada(null);
      setModoEdicion(false);
      obtenerInscripciones();
    } catch (error) {
      alert(`Error al actualizar la inscripción: ${error.message}`);
    }
  };

  // Eliminar inscripción
  const eliminarInscripcion = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta inscripción?")) return;
    try {
      await inscripcionService.delete(id);
      alert("Inscripción eliminada exitosamente");
      obtenerInscripciones();
    } catch (error) {
      alert(`Error al eliminar la inscripción: ${error.message}`);
    }
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaInscripcion({
      usuario: "",
      nombre: "",
      apellido: "",
      tipoDocumento: "",
      numeroDocumento: "",
      correo: "",
      telefono: "",
      edad: "",
      evento: "",
      categoria: "",
      estado: "pendiente",
      observaciones: "",
      solicitud: ""
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (inscripcion) => {
    setModoEdicion(true);
    setInscripcionSeleccionada({ ...inscripcion });
    setMostrarModal(true);
  };

  return (
    <div className="seccion-usuarios">
      <div className="seccion-header">
        <h2>Gestión de Inscripciones</h2>
        <button className="btn-primary" onClick={abrirModalCrear}>
          ➕ Nueva Inscripción
        </button>
      </div>
      <TablaInscripciones
        inscripciones={inscripciones}
        onEditar={abrirModalEditar}
        onEliminar={eliminarInscripcion}
      />
      <InscripcionModal
        mostrar={mostrarModal}
        modoEdicion={modoEdicion}
        inscripcionSeleccionada={inscripcionSeleccionada}
        setInscripcionSeleccionada={setInscripcionSeleccionada}
        nuevaInscripcion={nuevaInscripcion}
        setNuevaInscripcion={setNuevaInscripcion}
        eventos={eventos}
        categorias={categorias}
        onClose={() => setMostrarModal(false)}
        onSubmit={modoEdicion ? actualizarInscripcion : crearInscripcion}
      />
    </div>
  );
};

export default GestionIscripcion;
