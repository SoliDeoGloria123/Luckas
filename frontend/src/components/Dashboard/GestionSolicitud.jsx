import { useState, useEffect } from "react";
import { solicitudService } from "../../services/solicirudService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaUnificadaSolicitudes from "./Tablas/SolicitudTabla";
import SolicitudModal from "./Modales/SolicitudModal";
import useBusqueda from "./Busqueda/useBusqueda";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import PropTypes from 'prop-types';


const GestionSolicitud = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [modoEdicionSolicitud, setModoEdicionSolicitud] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const {
    busqueda: busquedaSolicitudes,
    setBusqueda: setBusquedaSolicitudes,
    datosFiltrados: solicitudesFiltradas
  } = useBusqueda(
    solicitudes,
    [
      "solicitante.nombre",
      "solicitante.apellido",
      "solicitante.numeroDocumento", // Agregar búsqueda por cédula
      "correo",
      "tipoSolicitud",
      "categoria.nombre",
      "categoria"
    ]
  );
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    solicitante: "",
    titulo: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "",
    categoria: "",
    descripcion: "",
    estado: "Nueva",
    prioridad: "Media",
    responsable: "",
    observaciones: ""
  });
  const [categorias, setCategorias] = useState([]);

  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      console.log('=== OBTENIENDO SOLICITUDES ===');
      const data = await solicitudService.getAll();
      console.log('Datos recibidos:', data);
      console.log('Array de solicitudes:', data.data);
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      mostrarAlerta("Error", "Error al obtener solicitudes");
    }
  };

  // Obtener categorías de la base de datos
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerSolicitudes();
    obtenerCategorias();
  }, []);

  // Crear solicitud
  const crearSolicitud = async () => {
    try {
      await solicitudService.create(nuevaSolicitud);
      mostrarAlerta("¡Éxito!", "Solicitud creada exitosamente");
      setMostrarModal(false);
      setNuevaSolicitud({
        solicitante: "",
        titulo: "",
        correo: "",
        telefono: "",
        tipoSolicitud: "",
        categoria: "",
        descripcion: "",
        estado: "Nueva",
        prioridad: "Media",
        responsable: "",
        observaciones: ""
      });
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear la solicitud: ${error.message}`);
    }
  };

  // Actualizar solicitud
  const actualizarSolicitud = async () => {
    try {
      console.log('Actualizando solicitud:', solicitudSeleccionada);
      const resultado = await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      console.log('Resultado actualización:', resultado);

      if (resultado.success) {
        mostrarAlerta("¡Éxito!", "Solicitud actualizada exitosamente");
        setMostrarModal(false);
        setSolicitudSeleccionada(null);
        setModoEdicionSolicitud(false);
        obtenerSolicitudes();
      } else {
        mostrarAlerta("Error", resultado.message || "Error al actualizar la solicitud");
      }
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
      mostrarAlerta("Error", `Error: ${error.message}`);
    }
  };

  // Eliminar solicitud
  const eliminarSolicitud = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await solicitudService.delete(id);
      mostrarAlerta("¡Éxito!", "Solicitud eliminada exitosamente");
      obtenerSolicitudes();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`);
    }
  };

  // Abrir modal para crear solicitud
  const abrirModalCrearSolicitud = () => {
    setModoEdicionSolicitud(false);
    setNuevaSolicitud({
      solicitante: "",
      titulo: "",
      correo: "",
      telefono: "",
      tipoSolicitud: "",
      categoria: "",
      descripcion: "",
      estado: "Nueva",
      prioridad: "Media",
      responsable: "",
      observaciones: ""
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar solicitud
  const abrirModalEditarSolicitud = (solicitud) => {
    console.log('=== ABRIENDO MODAL EDITAR SOLICITUD ===');
    console.log('Solicitud recibida:', solicitud);
    console.log('canEdit:', canEdit);
    console.log('readOnly:', readOnly);

    setModoEdicionSolicitud(true);
    setSolicitudSeleccionada({ ...solicitud });
    setMostrarModal(true);

    console.log('Modal configurado - modoEdicion:', true);
    console.log('Modal configurado - mostrar:', true);
  };

  // Paginación para solicitudes filtradas
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(solicitudesFiltradas.length / registrosPorPagina);
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Resetear página al cambiar búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaSolicitudes]);

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
              <h1>Gestión de Solicitudes</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            <button className="btn-admin btn-primary-admin" onClick={abrirModalCrearSolicitud}>
              + Nuevo Solicitud
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
                value={busquedaSolicitudes}
                onChange={e => setBusquedaSolicitudes(e.target.value)}
                className="input-busqueda"
                style={{ marginLeft: 10, width: 300 }}
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
          <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
            <TablaUnificadaSolicitudes
              datosUnificados={{ solicitudes: solicitudesPaginadas, inscripciones: [], reservas: [] }}
              abrirModalEditarSolicitud={(canEdit && !readOnly) ? abrirModalEditarSolicitud : null}
              eliminarSolicitud={(canDelete && !modoTesorero && !readOnly) ? eliminarSolicitud : null}
            />
          </div>
          <SolicitudModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicionSolicitud}
            solicitudSeleccionada={solicitudSeleccionada}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
            nuevaSolicitud={nuevaSolicitud}
            setNuevaSolicitud={setNuevaSolicitud}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicionSolicitud ? actualizarSolicitud : crearSolicitud}
            categorias={categorias}
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

export default GestionSolicitud;

// Validación de props con PropTypes

GestionSolicitud.propTypes = {
  usuario: PropTypes.object,
  onCerrarSesion: PropTypes.func,
  modoTesorero: PropTypes.bool,
  userRole: PropTypes.string,
  readOnly: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
