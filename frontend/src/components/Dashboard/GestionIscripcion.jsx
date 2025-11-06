import { useState, useEffect } from "react";
import { inscripcionService } from "../../services/inscripcionService";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import { programasAcademicosService } from "../../services/programasAcademicosService";
import TablaInscripciones from "./Tablas/InscripcionTabla";
//import InscripcionModalCrear from "./Modales/InscripcionModalCrear";
//import InscripcionModalEditar from "./Modales/InscripcionModalEditar";
import InscripcionModal from "./Modales/InscripcionModa";
import useBusqueda from "./Busqueda/useBusqueda";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';


const GestionIscripcion = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programas, setProgramas] = useState([]); // 1. Estado para programas
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const {
    busqueda: busquedaInscripciones,
    setBusqueda: setBusquedaInscripciones,
    datosFiltrados: inscripcionesFiltradas
  } = useBusqueda(
    inscripciones,
    [
      "nombre",
      "apellido",
      "numeroDocumento", // Búsqueda por cédula desde inscripción
      "usuario.numeroDocumento", // Búsqueda por cédula desde usuario poblado
      "correo",
      "usuario.correo",
      "telefono",
      "usuario.telefono",
      "evento.nombre",
      "categoria.nombre"
    ]
  );


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
  // 2. Obtener programas académicos
  const obtenerProgramas = async () => {
    try {
      const res = await programasAcademicosService.getAllProgramas();
      setProgramas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setProgramas([]);
    }
  };

  useEffect(() => {
    obtenerInscripciones();
    obtenerEventos();
    obtenerCategorias();
    obtenerProgramas();
  }, []);

  // Crear inscripción
  const crearInscripcion = async (payload) => {
    try {
      // Elimina el campo solicitud si está vacío
      const insc = { ...payload };
      if (!insc.solicitud || insc.solicitud === "") {
        delete insc.solicitud;
      }
      // Convertir edad a número
      if (insc.edad) insc.edad = Number(insc.edad);
      // Corregir: enviar referencia en vez de evento
      if (insc.evento) {
        insc.referencia = insc.evento;
        delete insc.evento;
      }
      await inscripcionService.create(insc);
      mostrarAlerta("¡Éxito!", "Inscripción creada exitosamente");
      setMostrarModal(false);
      obtenerInscripciones();
    } catch (error) {
      // Mostrar el error exacto del backend
      console.error("Error al crear inscripción:", error.response?.data || error.message);
      mostrarAlerta("Error", `Error al crear la inscripción: ${error.response?.data?.message || error.message}`);
    }
  };

  // Actualizar inscripción
  const actualizarInscripcion = async (form) => {
    try {
      const usuarioId = typeof form.usuario === 'object' && form.usuario._id ? form.usuario._id : form.usuario;
      const payload = {
        usuario: usuarioId,
        tipoReferencia: form.tipoReferencia,
        referencia: form.referencia,
        categoria: form.categoria,
        estado: form.estado,
        observaciones: form.observaciones,
        nombre: form.nombre,
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        telefono: form.telefono,
        edad: Number(form.edad),
        correo: form.correo,
        apellido: form.apellido,
      };
      await inscripcionService.update(inscripcionSeleccionada._id, payload);
      mostrarAlerta("¡Éxito!", "Inscripción actualizada exitosamente");
      setMostrarModal(false);
      setInscripcionSeleccionada(null);
      setModoEdicion(false);
      obtenerInscripciones();
    } catch (error) {
      // Mostrar el error exacto del backend
      console.error("Error al actualizar inscripción:", error.response?.data || error.message);
      mostrarAlerta("Error", `Error al actualizar la inscripción: ${error.response?.data?.message || error.message}`);
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
      mostrarAlerta("¡Éxito!", "Inscripción eliminada exitosamente");
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("Error", `Error al eliminar la inscripción: ${error.message}`);
    }
  };

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setMostrarModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (inscripcion) => {
    setModoEdicion(true);
    setInscripcionSeleccionada({ ...inscripcion });
    setMostrarModal(true);
  };


  // Paginación para programas académicos
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(inscripcionesFiltradas.length / registrosPorPagina);
  const inscripcionesPaginadas = inscripcionesFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );
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
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1>Gestión de Inscripciones</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
              + Nueva Inscripción
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

          <section className="filtros-section-admin">
            <div className="busqueda-contenedor">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, cédula, correo..."
                value={busquedaInscripciones}
                onChange={(e) => setBusquedaInscripciones(e.target.value)}
                className="input-busqueda"
                style={{ marginLeft: 10, width: 350 }}
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

          </section>

          <TablaInscripciones
            inscripciones={inscripcionesPaginadas}
            onEditar={abrirModalEditar}
            onEliminar={eliminarInscripcion}
          />
          <InscripcionModal
            mostrar={mostrarModal}
            modo={modoEdicion ? "editar" : "crear"}
            inscripcion={modoEdicion ? inscripcionSeleccionada : null}
            eventos={eventos}
            categorias={categorias}
            programas={programas}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarInscripcion : crearInscripcion}
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
              Página {paginaActual} de {totalPaginas}
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

export default GestionIscripcion;
