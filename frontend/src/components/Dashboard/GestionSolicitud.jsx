import { useState, useEffect } from "react";
import { solicitudService } from "../../services/solicirudService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaUnificadaSolicitudes from "./Tablas/SolicitudTabla";
import SolicitudModal from "./Modales/SolicitudModal";
import useBusqueda from "./Busqueda/useBusqueda";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';



const GestionSolicitud = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
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
      "correo",
      "tipoSolicitud",
      "categoria.nombre",
      "categoria"
    ]
  );
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
  const [categorias, setCategorias] = useState([]);

  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
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
      mostrarAlerta("Error", `Error al crear la solicitud: ${error.message}`);
    }
  };

  // Actualizar solicitud
  const actualizarSolicitud = async () => {
    try {
      await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      mostrarAlerta("¡Éxito!", "Solicitud actualizada exitosamente");
      setMostrarModal(false);
      setSolicitudSeleccionada(null);
      setModoEdicionSolicitud(false);
      obtenerSolicitudes();
    } catch (error) {
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

  return (
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
      <div className="stats-grid-admin">
        <div className="stat-card-admin">
          <div className="stat-icon-admin users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info-admin">
            <h3>5</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon-admin active">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info-admin">
            <h3>4</h3>
            <p>Usuarios Activos</p>
          </div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon-admin admins">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-info-admin">
            <h3>1</h3>
            <p>Administradores</p>
          </div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-icon-admin new">
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
            placeholder="Buscar Solicitud..."
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
       <TablaUnificadaSolicitudes
          datosUnificados={{ solicitudes: solicitudesFiltradas, inscripciones: [], reservas: [] }}
          abrirModalEditarSolicitud={(canEdit && !readOnly) ? abrirModalEditarSolicitud : null}
          eliminarSolicitud={(canDelete && !modoTesorero && !readOnly) ? eliminarSolicitud : null}
        />
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
    </div>
  );
};

export default GestionSolicitud;
