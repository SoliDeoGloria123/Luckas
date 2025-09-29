import { useState, useEffect } from "react";
import { inscripcionService } from "../../services/inscripcionService";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaInscripciones from "./Tablas/InscripcionTabla";
import InscripcionModalCrear from "./Modales/InscripcionModalCrear";
import InscripcionModalEditar from "./Modales/InscripcionModalEditar";
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

  useEffect(() => {
    obtenerInscripciones();
    obtenerEventos();
    obtenerCategorias();
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
      // Agregar tipoReferencia requerido por el backend
      insc.tipoReferencia = 'Eventos';
      await inscripcionService.create(insc);
      mostrarAlerta("¡Éxito!", "Inscripción creada exitosamente");
      setMostrarModal(false);
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear la inscripción: ${error.message}`);
    }
  };

  // Actualizar inscripción
  const actualizarInscripcion = async () => {
    try {
      const insc = { ...inscripcionSeleccionada };
      const usuarioId = typeof insc.usuario === 'object' && insc.usuario._id ? insc.usuario._id : insc.usuario;
      const payload = {
        usuario: usuarioId,
        referencia: insc.evento,
        tipoReferencia: 'Eventos',
        categoria: insc.categoria,
        estado: insc.estado,
        observaciones: insc.observaciones,
        nombre: insc.nombre,
        tipoDocumento: insc.tipoDocumento,
        numeroDocumento: insc.numeroDocumento,
        telefono: insc.telefono,
        edad: Number(insc.edad),
        correo: insc.correo,
        apellido: insc.apellido,
      };
      await inscripcionService.update(insc._id, payload);
      mostrarAlerta("¡Éxito!", "Inscripción actualizada exitosamente");
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
              <i class="fas fa-search"></i>
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
            inscripciones={inscripcionesFiltradas}
            onEditar={abrirModalEditar}
            onEliminar={eliminarInscripcion}
          />
          {modoEdicion ? (
            <InscripcionModalEditar
              mostrar={mostrarModal}
              inscripcion={inscripcionSeleccionada}
              setInscripcion={setInscripcionSeleccionada}
              eventos={eventos}
              categorias={categorias}
              onClose={() => setMostrarModal(false)}
              onSubmit={actualizarInscripcion}
            />
          ) : (
            <InscripcionModalCrear
              mostrar={mostrarModal}
              eventos={eventos}
              categorias={categorias}
              onClose={() => setMostrarModal(false)}
              onSubmit={crearInscripcion}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionIscripcion;
