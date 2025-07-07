import { useState, useEffect } from "react";
import { solicitudService } from "../../services/solicirudService";
import { categorizacionService } from "../../services/categorizacionService";
import TablaUnificadaSolicitudes from "./Tablas/SolicitudTabla";
import SolicitudModal from "./Modales/SolicitudModal";
import useBusqueda from "./Busqueda/useBusqueda"; 



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
      alert("Error al obtener solicitudes");
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

  return (
    <div className="seccion-usuarios"> {/* Aplica el mismo contenedor que Dashboard */}
      <div className="page-header-Academicos">
        <h2>Gestión de Solicitudes</h2>
        <button className="btn-primary" onClick={abrirModalCrearSolicitud}>
          ➕ Nuevo Solicitud
        </button>
      </div>
         <div className="busqueda-contenedor">
          <input
          type="text"
          placeholder="🔍 Buscar Solicitud..."
          value={busquedaSolicitudes}
          onChange={e => setBusquedaSolicitudes(e.target.value)}
          className="input-busqueda"
          style={{ marginLeft: 10, width: 300 }}
        />
         </div>
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
