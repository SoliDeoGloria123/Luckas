import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { userService } from "../../services/userService";
import { inscripcionService } from "../../services/inscripcionService";
import { solicitudService } from "../../services/solicirudService";
import { eventService } from "../../services/eventService";
import { tareaService } from "../../services/tareaService";
import { categorizacionService } from "../../services/categorizacionService";
import { cabanaService } from "../../services/cabanaService";
import { reservaService } from "../../services/reservaService";
import UsuarioModal from "./Modales/UsuarioModal";
import SolicitudModal from "./Modales/SolicitudModal";
import EventoModal from "./Modales/EventoModal";
import TareaModal from "./Modales/TareaModal";
import InscripcionModal from "./Modales/InscripsionModal";
import CabanaModal from "./Modales/CabanaModal";
import ReservasModal from "./Modales/ReservaModal";
import CategorizacionModal from "./Modales/CategorizacionModal";
import TablaUsuarios from "./Tablas/UserTabla";
import TablaCategorias from "./Tablas/CategorizacionTabla";
import TablaUnificadaSolicitudes from "./Tablas/SolicitudTabla";
import TablaInscripciones from "./Tablas/InscripcionTabla";
import TablaEventos from "./Tablas/EventoTabla";
import TablaTareas from "./Tablas/TareaTabla";
import TablaCabana from './Tablas/CabanaTabla';
import TablaReservas from './Tablas/ReservaTabla';
import Reportes from "../Reportes/Reportes";
import useBusqueda from "./Busqueda/useBusqueda";
import "./Dashboard.css";


const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  const [usuarioActual, setUsuarioActual] = useState(usuarioProp);

  // Si no se pasa usuario como prop, obtenerlo desde localStorage
  useEffect(() => {
    if (!usuarioProp) {
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        setUsuarioActual(JSON.parse(usuarioStorage));
      }
    }
  }, [usuarioProp]);

  const handleCerrarSesion = () => {
    if (onCerrarSesionProp) {
      onCerrarSesionProp();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    nuevosHoy: 0,
  });
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    password: "",
    role: "externo",
    estado: "activo"
  });

  //----------------------------------------------------------------------------------------------------------
  // Obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      const usuariosData = Array.isArray(data.data) ? data.data : [];
      setUsuarios(usuariosData);
      calcularEstadisticas(usuariosData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
      if (error.message === "Unauthorized") {
        localStorage.removeItem("token");
        handleCerrarSesion();
      }
    } finally {
      setCargando(false);
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = (usuariosData) => {
    const hoy = new Date().toDateString();
    setEstadisticas({
      totalUsuarios: usuariosData.length,
      usuariosActivos: usuariosData.filter((user) => user.status === "active").length,
      administradores: usuariosData.filter((user) => user.role === "admin").length,
      nuevosHoy: usuariosData.filter((user) => new Date(user.createdAt).toDateString() === hoy).length,
    });
  };

  // Crear usuario
  const crearUsuario = async () => {
    try {
      await userService.createUser(nuevoUsuario);
      alert("Usuario creado exitosamente");
      setMostrarModal(false);
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: "",
        password: "",
        role: "externo",
        estado: "activo"
      });
      obtenerUsuarios();
    } catch (error) {
      alert(`Error al crear el usuario: ${error.message}`);
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async () => {
    try {
      await userService.updateUser(usuarioSeleccionado._id, {
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono,
        tipoDocumento: usuarioSeleccionado.tipoDocumento,
        numeroDocumento: usuarioSeleccionado.numeroDocumento,
        role: usuarioSeleccionado.role,
        estado: usuarioSeleccionado.estado,
      });
      alert("Usuario actualizado exitosamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }
    try {
      await userService.deleteUser(userId);
      alert("Usuario eliminado exitosamente");
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  //para cerrar la sesion 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  // Abrir modal para crear usuario
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevoUsuario({ nombre: "", apellido: "", correo: "", telefono: "", password: "", role: "participante" });
    setMostrarModal(true);
  };

  // Abrir modal para editar usuario
  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  };

  useEffect(() => {
    obtenerUsuarios();
    // eslint-disable-next-line
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = Array.isArray(usuarios)
    ? usuarios.filter(
      (user) =>
        user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.role?.toLowerCase().includes(busqueda.toLowerCase())
    )
    : [];
  /*-----------------------------------------------------------------------------------------------------------*/
    const [solicitudes, setSolicitudes] = useState([]);  
    const { busqueda: busquedaSolicitudes, setBusqueda: setBusquedaSolicitudes, datosFiltrados: solicitudesFiltradas } =
    useBusqueda(solicitudes, [
      "solicitante.nombre",
      "correo",
      "tipoSolicitud",
      "categoria.nombre",
      "categoria"
    ]);

  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    solicitante: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "",
    categoria: "",
    descripcion: "",
    estado: "Nuevo",
    prioridad: "Media",
    responsable: "",
    observaciones: ""
  });
  const [modoEdicionSolicitud, setModoEdicionSolicitud] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  

  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      console.log("Respuesta solicitudes:", data);
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener solicitudes");
    }
  };

  // Crear solicitud
  const crearSolicitud = async () => {
    try {
      await solicitudService.create(nuevaSolicitud);
      alert("Solicitud creada exitosamente");
      setMostrarModal(false);
      setNuevaSolicitud({
        solicitante: "",
        correo: "",
        telefono: "",
        tipoSolicitud: "",
        categoria: "",
        descripcion: "",
        estado: "Nuevo",
        prioridad: "Media",
        responsable: "",
        observaciones: ""
      });
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error al crear la solicitud: ${error.message}`);
    }
  };

  // Actualizar solicitud
  const actualizarSolicitud = async () => {
    try {
      await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      alert("Solicitud actualizada exitosamente");
      setMostrarModal(false);
      setSolicitudSeleccionada(null);
      setModoEdicionSolicitud(false);
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar solicitud
  const eliminarSolicitud = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) return;
    try {
      await solicitudService.delete(id);
      alert("Solicitud eliminada exitosamente");
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para crear solicitud
  const abrirModalCrearSolicitud = () => {
    setModoEdicionSolicitud(false);
    setNuevaSolicitud({
      solicitante: "",
      correo: "",
      telefono: "",
      tipoSolicitud: "",
      categoria: "",
      descripcion: "",
      prioridad: "Media",
      responsable: "",
      observaciones: ""
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar solicitud
  const abrirModalEditarSolicitud = (solicitud) => {
    setModoEdicionSolicitud(true);
    setSolicitudSeleccionada({ ...solicitud });
    setMostrarModal(true);
  };

  // Llama a obtenerSolicitudes cuando se activa la sección de solicitudes
  useEffect(() => {
    if (seccionActiva === "solicitudes") {
      obtenerSolicitudes();
    }
  }, [seccionActiva]);


  //-----------------------------------------------------------------------------------------------------------
  const [mostrarModalInscripcion, setMostrarModalInscripcion] = useState(false);
  const [modoEdicionInscripcion, setModoEdicionInscripcion] = useState(false);
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
  })
  // Obtener inscripciones
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener inscripciones");
    }
  };

  // Crear inscripción
  const CrearInscripcion = async () => {
    // Validación previa
    if (
      !nuevaInscripcion.usuario ||
      nuevaInscripcion.usuario.length !== 24 ||
      !nuevaInscripcion.evento ||
      nuevaInscripcion.evento.length !== 24 ||
      !nuevaInscripcion.categoria ||
      nuevaInscripcion.categoria.length !== 24
    ) {
      alert("Debes seleccionar usuario, evento y categoría válidos.");
      return;
    }
    try {
      // Copia el objeto y elimina solicitud si está vacío
      const inscripcionAEnviar = { ...nuevaInscripcion };
      if (!inscripcionAEnviar.solicitud) {
        delete inscripcionAEnviar.solicitud;
      }
      await inscripcionService.create(inscripcionAEnviar);
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
      // 1. Actualizar usuario relacionado
      await userService.updateUser(
        inscripcionSeleccionada.usuario._id ? inscripcionSeleccionada.usuario._id : inscripcionSeleccionada.usuario,
        {
          nombre: inscripcionSeleccionada.nombre,
          apellido: inscripcionSeleccionada.apellido,
          tipoDocumento: inscripcionSeleccionada.tipoDocumento,
          numeroDocumento: inscripcionSeleccionada.numeroDocumento,
          telefono: inscripcionSeleccionada.telefono,
          // correo: inscripcionSeleccionada.correo,
        }
      );
      await inscripcionService.update(inscripcionSeleccionada._id, inscripcionSeleccionada);

      alert("Inscripción y usuario actualizados exitosamente");
      setMostrarModalInscripcion(false);
      setInscripcionSeleccionada(null);
      setModoEdicionInscripcion(false);
      obtenerInscripciones();
      obtenerUsuarios(); // Refresca la lista de usuarios
    } catch (error) {
      alert(`Error: ${error.message}`);
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
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para crear inscripción
  const abrirModalCrearInscripcion = () => {
    setModoEdicionInscripcion(false);
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
    setMostrarModalInscripcion(true); // <-- CORRECTO
  };

  // Abrir modal para editar inscripción
  const abrirModalEditarInscripcion = (inscripcion) => {
    setModoEdicionInscripcion(true);
    setInscripcionSeleccionada({ ...inscripcion });
    setMostrarModalInscripcion(true); // <-- Cambia esto
  };
  const [inscripciones, setInscripciones] = useState([]);

  // Luego usas el hook
  const { busqueda: busquedaInscripciones, setBusqueda: setBusquedaInscripciones, datosFiltrados: inscripcionesFiltradas } =
    useBusqueda(inscripciones, [
      "nombre",
      "apellido",
      "correo",
      "telefono",
      "evento.nombre",
      "categoria.nombre",
      "estado"
    ]);

  useEffect(() => {
    if (seccionActiva === "inscripciones") {
      obtenerInscripciones();
    }
  }, [seccionActiva]);

  //-----------------------------------------------------------------------------------------------------------
  // FUNCIONES PARA GESTIÓN DE EVENTOS
  // Estados para eventos
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: 0,
    categoria: "",
    etiquetas: [],
    fechaEvento: "",
    horaInicio: "",
    horaFin: "",
    lugar: "",
    direccion: "",
    duracionDias: 1,
    cuposTotales: 0,
    cuposDisponibles: 0,
    programa: [],
    prioridad: "Normal",
    observaciones: "",
    active: true
  });
  const [modoEdicionEvento, setModoEdicionEvento] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [eventos, setEventos] = useState([]);
  const { busqueda: busquedaEventos, setBusqueda: setBusquedaEventos, datosFiltrados: eventosFiltrados } =
    useBusqueda(eventos, [
      "nombre",
      "descripcion",
      "categoria.nombre",
      "lugar",
      "direccion"
    ]);
  // Obtener todos los eventos
  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener eventos: " + error.message);
    }
  };

  // Crear evento
  const crearEvento = async () => {
    try {
      await eventService.createEvent(nuevoEvento);
      alert("Evento creado exitosamente");
      setMostrarModal(false);
      setNuevoEvento({
        nombre: "",
        descripcion: "",
        imagen: "",
        precio: 0,
        categoria: "",
        etiquetas: [],
        fechaEvento: "",
        horaInicio: "",
        horaFin: "",
        lugar: "",
        direccion: "",
        duracionDias: 1,
        cuposTotales: 0,
        cuposDisponibles: 0,
        programa: [],
        prioridad: "Normal",
        observaciones: "",
        active: true
      });
      obtenerEventos();
    } catch (error) {
      alert(`Error al crear el evento:s ${error.message}`);
    }
  };

  // Actualizar evento
  const actualizarEvento = async () => {
    try {
      await eventService.updateEvent(eventoSeleccionado._id, eventoSeleccionado);
      alert("Evento actualizado exitosamente");
      setMostrarModal(false);
      setEventoSeleccionado(null);
      setModoEdicionEvento(false);
      obtenerEventos();
    } catch (error) {
      alert(`Error al actualizar evento: ${error.message}`);
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
      alert(`Error al eliminar evento: ${error.message}`);
    }
  };

  // Deshabilitar evento
  const deshabilitarEvento = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres deshabilitar este evento?")) return;
    try {
      await eventService.disableEvent(id);
      alert("Evento deshabilitado exitosamente");
      obtenerEventos();
    } catch (error) {
      alert(`Error al deshabilitar evento: ${error.message}`);
    }
  };

  // Abrir modal para crear evento
  const abrirModalCrearEvento = () => {
    setModoEdicionEvento(false);
    setNuevoEvento({
      nombre: "",
      descripcion: "",
      imagen: "",
      precio: 0,
      categoria: "",
      etiquetas: [],
      fechaEvento: "",
      horaInicio: "",
      horaFin: "",
      lugar: "",
      direccion: "",
      duracionDias: 1,
      cuposTotales: 0,
      cuposDisponibles: 0,
      programa: [],
      prioridad: "Normal",
      observaciones: "",
      active: true
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar evento
  const abrirModalEditarEvento = (evento) => {
    setModoEdicionEvento(true);
    setEventoSeleccionado({
      ...evento,
      etiquetas: Array.isArray(evento.etiquetas) ? evento.etiquetas : []
    });
    setMostrarModal(true);
  };




  //-----------------------------------------------------------------------------------------------------------
  // FUNCIONES PARA GESTIÓN DE TAREAS
 // Estados para tareas
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "media",
    asignadoA: "",
    asignadoPor: "",
    fechaLimite: "",
    comentarios: []
  });
  const [modoEdicionTarea, setModoEdicionTarea] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const [tareas, setTareas] = useState([]);
  const { busqueda: busquedaTareas, setBusqueda: setBusquedaTareas, datosFiltrados: tareasFiltradas } =
    useBusqueda(tareas, [
      "titulo",
      "descripcion",
      "estado",
      "prioridad",
      "asignadoA",
      "asignadoPor"
    ]);
  // Obtener todas las tareas
  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      setTareas(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Error al obtener tareas: " + error.message);
    }
  };

  // Crear tarea
  const crearTarea = async () => {
    try {
      await tareaService.create(nuevaTarea);
      alert("Tarea creada exitosamente");
      setMostrarModal(false);
      setNuevaTarea({
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        prioridad: "media",
        asignadoA: "",
        asignadoPor: "",
        fechaLimite: "",
        comentarios: []
      });
      obtenerTareas();
    } catch (error) {
      alert(`Error al crear la tarea: ${error.message}`);
    }
  };

  // Actualizar tarea
  const actualizarTarea = async () => {
    try {
      await tareaService.update(tareaSeleccionada._id, tareaSeleccionada);
      alert("Tarea actualizada exitosamente");
      setMostrarModal(false);
      setTareaSeleccionada(null);
      setModoEdicionTarea(false);
      obtenerTareas();
    } catch (error) {
      alert(`Error al actualizar tarea: ${error.message}`);
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;
    try {
      await tareaService.delete(id);
      alert("Tarea eliminada exitosamente");
      obtenerTareas();
    } catch (error) {
      alert(`Error al eliminar tarea: ${error.message}`);
    }
  };

  // Cambiar estado de tarea
  const cambiarEstadoTarea = async (id, nuevoEstado) => {
    try {
      await tareaService.cambiarEstado(id, nuevoEstado);
      alert(`Estado de tarea cambiado a: ${nuevoEstado}`);
      obtenerTareas();
    } catch (error) {
      alert(`Error al cambiar estado: ${error.message}`);
    }
  };

  // Abrir modal para crear tarea
  const abrirModalCrearTarea = () => {
    setModoEdicionTarea(false);
    setNuevaTarea({
      titulo: "",
      descripcion: "",
      estado: "pendiente",
      prioridad: "media",
      asignadoA: "",
      asignadoPor: "",
      fechaLimite: "",
      comentarios: []
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar tarea
  const abrirModalEditarTarea = (tarea) => {
    setModoEdicionTarea(true);
    setTareaSeleccionada({
      ...tarea,
      fechaLimite: tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString().split('T')[0] : ""
    });
    setMostrarModal(true);
  };

  // Cargar tareas cuando se activa la sección
  useEffect(() => {
    if (seccionActiva === "tareas") {
      obtenerTareas();
    }
  }, [seccionActiva]);

  //-----------------------------------------------------------------------------------------------------------
  const [categorias, setCategorias] = useState([]);


  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    codigo: ""

  });
  const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const crearCategoria = async () => {
    try {
      await categorizacionService.create(nuevaCategoria);
      alert("Categoría creada exitosamente");
      setNuevaCategoria({ nombre: "", codigo: "" });
      setMostrarModal(false);
      obtenerCategorias();
    } catch (error) {
      alert(`Error al crear la categoría: ${error.message}`);
    }
  };

  // Actualizar categoría
  const actualizarCategoria = async () => {
    try {
      await categorizacionService.update(categoriaSeleccionada._id, categoriaSeleccionada);
      alert("Categoría actualizada exitosamente");
      setCategoriaSeleccionada(null);
      setModoEdicionCategoria(false);
      setMostrarModal(false);
      obtenerCategorias();
    } catch (error) {
      alert(`Error al actualizar la categoría: ${error.message}`);
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

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;
    try {
      await categorizacionService.delete(id);
      alert("Categoría eliminada exitosamente");
      obtenerCategorias();
    } catch (error) {
      alert(`Error al eliminar la categoría: ${error.message}`);
    }
  };

  const abrirModalCrearCategoria = () => {
    setModoEdicionCategoria(false);
    setNuevaCategoria({ nombre: "", codigo: "" });
    setMostrarModal(true);
  };

  const abrirModalEditarCategoria = (categoria) => {
    setModoEdicionCategoria(true);
    setCategoriaSeleccionada({ ...categoria });
    setMostrarModal(true);
  };
  //----------------------------------------------------------------------------------------------------------------
  const { busqueda: busquedaCategorias, setBusqueda: setBusquedaCategorias, datosFiltrados: categoriasFiltradas } =
    useBusqueda(categorias, ["nombre", "codigo", "estado"]);
  // Estados para cabañas
  const [cabanas, setCabanas] = useState([]);
 // Cabañas
const { busqueda: busquedaCabanas, setBusqueda: setBusquedaCabanas, datosFiltrados: cabanasFiltradas } =
  useBusqueda(cabanas, [
    "nombre",
    "descripcion",
    "capacidad",
    "categoria",
    "estado"
  ]);


  const [nuevaCabana, setNuevaCabana] = useState({
    nombre: "",
    descripcion: "",
    capacidad: "",
    categoria: "",
    estado: "disponible"
  });
  const [modoEdicionCabana, setModoEdicionCabana] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);

  // Obtener cabañas
  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      setCabanas(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener cabañas");
    }
  };

  // Crear cabaña
  const crearCabana = async () => {
    try {
      await cabanaService.create(nuevaCabana);
      alert("Cabaña creada exitosamente");
      setNuevaCabana({ nombre: "", descripcion: "", capacidad: "", categoria: "", estado: "disponible" });
      obtenerCabanas();
      setMostrarModal(false);
    } catch (error) {
      alert(`Error al crear la cabaña: ${error.message}`);
    }
  };

  // Actualizar cabaña
  const actualizarCabana = async () => {
    try {
      await cabanaService.update(cabanaSeleccionada._id, cabanaSeleccionada);
      alert("Cabaña actualizada exitosamente");
      setCabanaSeleccionada(null);
      setModoEdicionCabana(false);
      setMostrarModal(false);
      obtenerCabanas();
    } catch (error) {
      alert(`Error al actualizar la cabaña: ${error.message}`);
    }
  };

  // Eliminar cabaña
  const eliminarCabana = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta cabaña?")) return;
    try {
      await cabanaService.delete(id);
      alert("Cabaña eliminada exitosamente");
      obtenerCabanas();
    } catch (error) {
      alert(`Error al eliminar la cabaña: ${error.message}`);
    }
  };

  // Abrir modal para crear cabaña
  const abrirModalCrearCabana = () => {
    setModoEdicionCabana(false);
    setNuevaCabana({ nombre: "", descripcion: "", capacidad: "", categoria: "", estado: "disponible" });
    setMostrarModal(true);
  };

  // Abrir modal para editar cabaña
  const abrirModalEditarCabana = (cabana) => {
    setModoEdicionCabana(true);
    setCabanaSeleccionada({ ...cabana });
    setMostrarModal(true);
  };

  // Llama a obtenerCabanas cuando se activa la sección de cabañas
  useEffect(() => {
    if (seccionActiva === "cabanas") {
      obtenerCabanas();
    }
  }, [seccionActiva]);
  //-----------------------------------------------------------------------------------------------------------
  // Estados para reservas
  const [reservas, setReservas] = useState([]);
  // Reservas
const { busqueda: busquedaReservas, setBusqueda: setBusquedaReservas, datosFiltrados: reservasFiltradas } =
  useBusqueda(reservas, [
    "usuario.nombre",
    "usuario.apellido",
    "usuario.correo",
    "recurso.nombre",
    "categoria",
    "estado"
  ]);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuario: "",
    recurso: "",
    fechaInicio: "",
    fechaFin: "",
    categoria: "",
    observaciones: ""
  });
  const [modoEdicionReserva, setModoEdicionReserva] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Obtener reservas
  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      setReservas(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener reservas");
    }
  };

  // Crear reserva
  const crearReserva = async () => {
    try {
      await reservaService.create(nuevaReserva);
      alert("Reserva creada exitosamente");
      setNuevaReserva({ usuario: "", recurso: "", fechaInicio: "", fechaFin: "", categoria: "", observaciones: "" });
      obtenerReservas();
      setMostrarModal(false);
    } catch (error) {
      alert(`Error al crear la reserva: ${error.message}`);
    }
  };

  // Actualizar reserva
  const actualizarReserva = async () => {
    try {
      await reservaService.update(reservaSeleccionada._id, reservaSeleccionada);
      alert("Reserva actualizada exitosamente");
      setReservaSeleccionada(null);
      setModoEdicionReserva(false);
      setMostrarModal(false);
      obtenerReservas();
    } catch (error) {
      alert(`Error al actualizar la reserva: ${error.message}`);
    }
  };

  // Eliminar reserva
  const eliminarReserva = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) return;
    try {
      await reservaService.delete(id);
      alert("Reserva eliminada exitosamente");
      obtenerReservas();
    } catch (error) {
      alert(`Error al eliminar la reserva: ${error.message}`);
    }
  };

  // Abrir modal para crear reserva
  const abrirModalCrearReserva = () => {
    setModoEdicionReserva(false);
    setNuevaReserva({ usuario: "", recurso: "", fechaInicio: "", fechaFin: "", categoria: "", observaciones: "" });
    setMostrarModal(true);
  };

  // Abrir modal para editar reserva
  const abrirModalEditarReserva = (reserva) => {
    setModoEdicionReserva(true);
    setReservaSeleccionada({ ...reserva });
    setMostrarModal(true);
  };

  // Llama a obtenerReservas cuando se activa la sección de reservas
  useEffect(() => {
    if (seccionActiva === "reservas") {
      obtenerReservas();
    }
  }, [seccionActiva]);
  //-----------------------------------------------------------------------------------------------------------
  const [datosUnificados, setDatosUnificados] = useState({
    solicitudes: [],
    inscripciones: [],
    reservas: []
  });

  useEffect(() => {
    if (seccionActiva === "solicitudes") {
      obtenerDatosUnificados();
    }
    // eslint-disable-next-line
  }, [seccionActiva]);

  const obtenerDatosUnificados = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/solicitudes/unificado", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener datos unificados");
      const data = await res.json();
      setDatosUnificados({
        solicitudes: data.data.solicitudes || [],
        inscripciones: data.data.inscripciones || [],
        reservas: data.data.reservas || [],
      });
    } catch (error) {
      alert("Error al obtener datos unificados: " + error.message);
    }
  };


  if (cargando) {
    return (
      <div className="cargando-contenedor">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Si no hay usuario y no se está pasando como prop, mostrar loading
  if (!usuarioActual && !usuarioProp) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-contenedor">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarAbierto ? "abierto" : "cerrado"}`}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="sidebar-header">
          <div className="logo">
            <span className="luckas">Luckas</span><span className="ent">ent</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-seccion">
            <div className="nav-titulo">PRINCIPAL</div>
            <ul>
              <li className={seccionActiva === "dashboard" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("dashboard")}>
                  <span className="nav-icon">📊</span>
                  <span className="nav-texto">Dashboard</span>
                </a>
              </li>
              <li className={seccionActiva === "usuarios" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("usuarios")}>
                  <span className="nav-icon">👥</span>
                  <span className="nav-texto">Usuarios</span>
                </a>
              </li>
              <li className={seccionActiva === "configuracion" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("configuracion")}>
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-texto">Configuración</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-seccion">
            <div className="nav-titulo">GESTIÓN</div>
            <ul>
              <li>
                <a href="#" onClick={() => setSeccionActiva("categorizacion")}>
                  <span className="nav-icon">🗂️</span>
                  <span className="nav-texto">Categorizacion</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("solicitudes")}>
                  <span className="nav-icon">📨</span>
                  <span className="nav-texto">Solicitudes</span>
                </a>
              </li>

              <li>
                <a href="#" onClick={() => setSeccionActiva("inscripciones")}>
                  <span className="nav-icon">📝</span>
                  <span className="nav-texto">Inscripciones</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("eventos")}>
                  <span className="nav-icon">📅</span>
                  <span className="nav-texto">Eventos</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("tareas")}>
                  <span className="nav-icon">✅</span>
                  <span className="nav-texto">Tareas</span>
                </a>
              </li>

              <li>
                <a href="#" onClick={() => setSeccionActiva("cabanas")}>
                  <span className="nav-icon">🛖</span>
                  <span className="nav-texto">Cabañas</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("reservas")}>
                  <span className="nav-icon">📅</span>
                  <span className="nav-texto">Reservas</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("reportes")}>
                  <span className="nav-icon">📈</span>
                  <span className="nav-texto">Reportes</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Header */}
        <header className="header">
          <div className="header-izquierda">
            <button className="btn-menu" onClick={() => setSidebarAbierto(!sidebarAbierto)}>
              ☰
            </button>
            <div className="breadcrumb">
              <span>Inicio</span>
              <span>/</span>
              <span>{seccionActiva === "dashboard" ? "Dashboard" : "Usuarios"}</span>
            </div>
          </div>

          <div className="header-derecha">
            <div className="notificaciones">
              <span className="notif-icon">🔔</span>
              <span className="notif-badge">3</span>

            </div>
            <div className="usuario-info">
              <div className="usuario-avatar">{usuarioActual?.nombre?.substring(0, 2).toUpperCase()}</div>
              <span className="usuario-nombre">{usuarioActual?.nombre}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>

            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="contenido">
          {seccionActiva === "dashboard" && (
            <>
              {/* Tarjetas de Estadísticas */}
              <div className="estadisticas-grid">
                <div className="tarjeta-stat morada">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.totalUsuarios}</div>
                    <div className="stat-label">Usuarios Totales</div>
                    <div className="stat-cambio">+12.4% ↑</div>
                  </div>
                  <div className="stat-grafico">📈</div>
                </div>

                <div className="tarjeta-stat azul">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.usuariosActivos}</div>
                    <div className="stat-label">Usuarios Activos</div>
                    <div className="stat-cambio">+40.9% ↑</div>
                  </div>
                  <div className="stat-grafico">👥</div>
                </div>

                <div className="tarjeta-stat naranja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.administradores}</div>
                    <div className="stat-label">Administradores</div>
                    <div className="stat-cambio">+84.7% ↑</div>
                  </div>
                  <div className="stat-grafico">🛡️</div>
                </div>

                <div className="tarjeta-stat roja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.nuevosHoy}</div>
                    <div className="stat-label">Nuevos Hoy</div>
                    <div className="stat-cambio">-23.6% ↓</div>
                  </div>
                  <div className="stat-grafico">📊</div>
                </div>
              </div>

              {/* Gráfico de Actividad */}
              <div className="tarjeta-grafico">
                <div className="grafico-header">
                  <h3>Actividad de Usuarios</h3>
                  <div className="grafico-controles">
                    <button className="btn-periodo activo">Día</button>
                    <button className="btn-periodo">Mes</button>
                    <button className="btn-periodo">Año</button>
                  </div>
                </div>
                <div className="grafico-placeholder">
                  <div className="grafico-linea"></div>
                  <p>Gráfico de actividad de usuarios en tiempo real</p>
                </div>
              </div>
            </>
          )}

          {seccionActiva === "usuarios" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Usuarios</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Usuario
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar usuarios..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaUsuarios
                usuarios={usuariosFiltrados}
                onEditar={readOnly ? null : abrirModalEditar}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarUsuario}
              />
              <UsuarioModal
                mostrar={mostrarModal && seccionActiva === "usuarios"}
                modoEdicion={modoEdicion}
                usuarioSeleccionado={usuarioSeleccionado}
                setUsuarioSeleccionado={setUsuarioSeleccionado}
                nuevoUsuario={nuevoUsuario}
                setNuevoUsuario={setNuevoUsuario}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
              />
            </div>

          )}
          {seccionActiva === "configuracion" && (
            <div className="seccion-configuracion">
              <h2>Configuración del Sistema</h2>
              <p>Próximamente: Configuraciones del sistema</p>
            </div>
          )}
          {seccionActiva === "solicitudes" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Solicitudes</h2>
                {(canCreate && !readOnly) && (
                  <button className="btn-primary" onClick={abrirModalCrearSolicitud}>
                    ➕ Nuevo Solicitud
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Solicitud..."
                  value={busquedaSolicitudes}
                  onChange={e => setBusquedaSolicitudes(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaUnificadaSolicitudes
                datosUnificados={{ solicitudes: solicitudesFiltradas, inscripciones: [], reservas: [] }}
                abrirModalEditarSolicitud={(canEdit && !readOnly) ? abrirModalEditarSolicitud : null}
                eliminarSolicitud={(canDelete && !modoTesorero && !readOnly) ? eliminarSolicitud : null}
              />
              <SolicitudModal
                mostrar={mostrarModal && seccionActiva === "solicitudes"}
                modoEdicion={modoEdicionSolicitud}
                solicitudSeleccionada={solicitudSeleccionada}
                setSolicitudSeleccionada={setSolicitudSeleccionada}
                nuevaSolicitud={nuevaSolicitud}
                setNuevaSolicitud={setNuevaSolicitud}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionSolicitud ? actualizarSolicitud : crearSolicitud}
                categorias={categorias}
              />
            </div>
          )}

          {seccionActiva === "inscripciones" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Inscripciones</h2>
                {(canCreate && !readOnly) && (
                  <button className="btn-primary" onClick={abrirModalCrearInscripcion}>
                    ➕ Nueva Inscripción
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Inscripción..."
                  value={busquedaInscripciones}
                  onChange={e => setBusquedaInscripciones(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaInscripciones
                inscripciones={inscripcionesFiltradas}
                onEditar={(canEdit && !readOnly) ? abrirModalEditarInscripcion : null}
                onEliminar={(canDelete && !modoTesorero && !readOnly) ? eliminarInscripcion : null}
              />
              <InscripcionModal
                mostrar={mostrarModalInscripcion}
                modoEdicion={modoEdicionInscripcion}
                inscripcionSeleccionada={inscripcionSeleccionada}
                setInscripcionSeleccionada={setInscripcionSeleccionada}
                nuevaInscripcion={nuevaInscripcion}
                setNuevaInscripcion={setNuevaInscripcion}
                eventos={eventos}
                categorias={categorias}
                onClose={() => setMostrarModalInscripcion(false)}
                onSubmit={modoEdicionInscripcion ? actualizarInscripcion : CrearInscripcion}
              />
            </div>
          )}

          {seccionActiva === "eventos" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Eventos</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrearEvento}>
                    ➕ Nuevo Evento
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Evento..."
                  value={busquedaEventos}
                  onChange={e => setBusquedaEventos(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaEventos
                eventos={eventosFiltrados}
                onEditar={readOnly ? null : abrirModalEditarEvento}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarEvento}
                onDeshabilitar={readOnly ? null : deshabilitarEvento}
              />

              <EventoModal
                mostrar={mostrarModal && seccionActiva === "eventos"}
                modoEdicion={modoEdicionEvento}
                eventoSeleccionado={eventoSeleccionado}
                setEventoSeleccionado={setEventoSeleccionado}
                nuevoEvento={nuevoEvento}
                setNuevoEvento={setNuevoEvento}
                categorias={categorias}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionEvento ? actualizarEvento : crearEvento}
              />
            </div>
          )}
          {seccionActiva === "categorizacion" && (
            <div className="seccion-categorias">
              <div className="seccion-header">
                <h2>Categorización</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrearCategoria}>
                    ➕ Nueva Categoría
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Categoría..."
                  value={busquedaCategorias}
                  onChange={e => setBusquedaCategorias(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaCategorias
                categorias={categoriasFiltradas}
                onEditar={readOnly ? null : abrirModalEditarCategoria}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarCategoria}
              />
              <CategorizacionModal
                mostrar={mostrarModal && seccionActiva === "categorizacion"}
                modoEdicion={modoEdicionCategoria}
                categoriaSeleccionada={categoriaSeleccionada}
                setCategoriaSeleccionada={setCategoriaSeleccionada}
                nuevaCategoria={nuevaCategoria}
                setNuevaCategoria={setNuevaCategoria}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionCategoria ? actualizarCategoria : crearCategoria}
              />
            </div>
          )}
          {seccionActiva === "tareas" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Tareas</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrearTarea}>
                    ➕ Nueva Tarea
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Tarea..."
                  value={busquedaTareas}
                  onChange={e => setBusquedaTareas(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaTareas
                tareas={tareasFiltradas}
                onEditar={readOnly ? null : abrirModalEditarTarea}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarTarea}
                onCambiarEstado={readOnly ? null : cambiarEstadoTarea}
              />
              <TareaModal
                mostrar={mostrarModal && seccionActiva === "tareas"}
                modoEdicion={modoEdicionTarea}
                tareaSeleccionada={tareaSeleccionada}
                setTareaSeleccionada={setTareaSeleccionada}
                nuevaTarea={nuevaTarea}
                setNuevaTarea={setNuevaTarea}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionTarea ? actualizarTarea : crearTarea}
                usuarios={usuarios} // <-- agrega esto
              />
            </div>
          )}
          {seccionActiva === "cabanas" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Cabañas</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrearCabana}>
                    ➕ Nueva Cabaña
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Cabaña..."
                  value={busquedaCabanas}
                  onChange={e => setBusquedaCabanas(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaCabana
                cabanas={cabanasFiltradas}
                onEditar={readOnly ? null : abrirModalEditarCabana}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarCabana}
              />
              <CabanaModal
                mostrar={mostrarModal && seccionActiva === "cabanas"}
                modoEdicion={modoEdicionCabana}
                cabanaSeleccionada={cabanaSeleccionada}
                setCabanaSeleccionada={setCabanaSeleccionada}
                nuevaCabana={nuevaCabana}
                setNuevaCabana={setNuevaCabana}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionCabana ? actualizarCabana : crearCabana}
                categorias={categorias}
              />
            </div>
          )}
          {seccionActiva === "reservas" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Reservas</h2>
                {(canCreate && !readOnly) && (
                  <button className="btn-primary" onClick={abrirModalCrearReserva}>
                    ➕ Nueva Reserva
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar Reserva..."
                  value={busquedaReservas}
                  onChange={e => setBusquedaReservas(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <TablaReservas
                reservas={reservasFiltradas}
                onEditar={(canEdit && !readOnly) ? abrirModalEditarReserva : null}
                onEliminar={(canDelete && !modoTesorero && !readOnly) ? eliminarReserva : null}
              />
              <ReservasModal
                mostrar={mostrarModal && seccionActiva === "reservas"}
                modoEdicion={modoEdicionReserva}
                reservaSeleccionada={reservaSeleccionada}
                setReservaSeleccionada={setReservaSeleccionada}
                nuevaReserva={nuevaReserva}
                setNuevaReserva={setNuevaReserva}
                usuarios={usuarios}
                cabanas={cabanas}
                categorias={categorias}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicionReserva ? actualizarReserva : crearReserva}
              />
            </div>
          )}

          {seccionActiva === "reportes" && (
            <div className="seccion-reportes">
              <Reportes />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
export default Dashboard