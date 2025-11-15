import React, { useState, useEffect } from "react";
import { reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";
import { cabanaService } from "../../services/cabanaService";
import TablaReservas from "./Tablas/ReservaTabla";
import ReservasModal from "./Modales/ReservaModal";
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import PropTypes from 'prop-types';
import manejarOperacionAsync from './common/manejarOperacionAsync';

const defaultReserva = {
  usuario: "",
  cabana: "",
  fechaInicio: "",
  fechaFin: "",
  precio: "",
  estado: "Pendiente",
  observaciones: "",
  nombre: "",
  apellido: "",
  tipoDocumento: "",
  numeroDocumento: "",
  correoElectronico: "",
  telefono: "",
  numeroPersonas: 1,
  activo: true
};

const GestionReservas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({ ...defaultReserva });
  const [error, setError] = useState("");

  // Usar helper compartido `manejarOperacionAsync` (se pasa `setError` para preservar comportamiento)

  useEffect(() => {
    obtenerReservas();
    obtenerUsuarios();
    obtenerCabanas();
  }, []);

  const obtenerReservas = () => manejarOperacionAsync(
    () => reservaService.getAll(),
    setReservas,
    "Error al obtener reservas",
    setError
  );

  const obtenerUsuarios = () => manejarOperacionAsync(
    () => userService.getAllUsers(),
    setUsuarios,
    "Error al obtener usuarios",
    setError
  );

  const obtenerCabanas = () => manejarOperacionAsync(
    () => cabanaService.getAll(),
    setCabanas,
    "Error al obtener cabañas",
    setError
  );

  // CRUD
  const crearReserva = async () => {
    try {
      // Forzar activo a booleano
      const reservaData = { ...nuevaReserva };
      if (typeof reservaData.activo === 'string') {
        reservaData.activo = reservaData.activo === 'true';
      } else if (typeof reservaData.activo !== 'boolean') {
        reservaData.activo = true;
      }
      await reservaService.create(reservaData);
      mostrarAlerta("¡Éxito!", "Reserva creada exitosamente");
      setMostrarModal(false);
      setNuevaReserva({ ...defaultReserva });
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al crear la reserva: " + err.message);
    }
  };

  const actualizarReserva = async () => {
    try {
      // Forzar activo a booleano
      const reservaData = { ...reservaSeleccionada };
      if (typeof reservaData.activo === 'string') {
        reservaData.activo = reservaData.activo === 'true';
      } else if (typeof reservaData.activo !== 'boolean') {
        reservaData.activo = true;
      }
      await reservaService.update(reservaSeleccionada._id, reservaData);
      mostrarAlerta("¡Éxito!", "Reserva actualizada exitosamente");
      setMostrarModal(false);
      setReservaSeleccionada(null);
      setModoEdicion(false);
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al actualizar reserva: " + err.message);
    }
  };

  const eliminarReserva = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await reservaService.delete(id);
      mostrarAlerta("¡Éxito!", "Reserva eliminada exitosamente");
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al eliminar reserva: " + err.message);
    }
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaReserva({ ...defaultReserva });
    setMostrarModal(true);
  };

  const abrirModalEditar = (reserva) => {
    setModoEdicion(true);
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  // Search filter
  const reservasFiltradas = reservas.filter(r => {
    const texto = `${r.usuario?.nombre || r.usuario || ''} ${r.cabana?.nombre || r.cabana || ''} ${r.estado || ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(reservasFiltradas.length / registrosPorPagina);
  const reservasPaginadas = reservasFiltradas.slice(
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
              <h1>Gestión de Reservas</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            {canCreate && !readOnly && (
              <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                + Nueva Reserva
              </button>
            )}
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
                placeholder="Buscar Reserva..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
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
          </section>
          {error && <div className="error-message">{error}</div>}
          <TablaReservas
            reservas={reservasPaginadas}
            onEditar={canEdit && !readOnly ? abrirModalEditar : null}
            onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarReserva : null}
          />
          <ReservasModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            reservaSeleccionada={reservaSeleccionada}
            setReservaSeleccionada={setReservaSeleccionada}
            nuevaReserva={nuevaReserva}
            setNuevaReserva={setNuevaReserva}
            usuarios={usuarios}
            cabanas={cabanas}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarReserva : crearReserva}
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

export default GestionReservas;

// Validación de props con PropTypes

GestionReservas.propTypes = {
  readOnly: PropTypes.bool,
  modoTesorero: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
