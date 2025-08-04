import { useState, useEffect } from "react";
import { inscripcionService } from "../../services/inscripcionService";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaInscripciones from "./Tablas/InscripcionTabla";
import InscripcionModal from "./Modales/InscripsionModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

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
      mostrarAlerta("¡Éxito!","Inscripción creada exitosamente");
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
      mostrarAlerta("Error",`Error al crear la inscripción: ${error.message}`);
    }
  };

  // Actualizar inscripción
  const actualizarInscripcion = async () => {
    try {
      await inscripcionService.update(inscripcionSeleccionada._id, inscripcionSeleccionada);
      mostrarAlerta("¡Éxito!","Inscripción actualizada exitosamente");
      setMostrarModal(false);
      setInscripcionSeleccionada(null);
      setModoEdicion(false);
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar la inscripción: ${error.message}`);
    }
  };

  // Eliminar inscripción
  const eliminarInscripcion = async (id) => {
   const confirmado = await mostrarConfirmacion(
    "¿Estás seguro?",
    "Esta acción eliminará el usuario de forma permanente."
  );

    if (!confirmado) return;
    try {
      await inscripcionService.delete(id);
      mostrarAlerta("¡Éxito!","Inscripción eliminada exitosamente");
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("Error",`Error al eliminar la inscripción: ${error.message}`);
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
      <div className="page-header-Academicos">
        <h1 className="titulo-admin" >Gestión de Inscripciones</h1>
        <button className="btn-admin" onClick={abrirModalCrear}>
          ➕ Nueva Inscripción
        </button>
      </div>

      <section className="filtros-section-admin">
        <div className="busqueda-contenedor">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar Incripcion..."
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

      <TablaInscripciones
        inscripciones={inscripciones}
        onEditar={abrirModalEditar}
        onEliminar={eliminarInscripcion}
      />
      </section>
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
