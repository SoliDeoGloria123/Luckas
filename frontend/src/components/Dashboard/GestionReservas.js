import React, { useState, useEffect } from "react";
import { reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";
import { cabanaService } from "../../services/cabanaService";
import TablaReservas from "./Tablas/ReservaTabla";
import ReservasModal from "./Modales/ReservaModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionReservas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuario: "",
    cabana: "",
    fechaInicio: "",
    fechaFin: "",
    precio: "",
    estado: "Pendiente",
    observaciones: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerReservas();
    obtenerUsuarios();
    obtenerCabanas();
  }, []);

  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      let resvs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setReservas(resvs);
    } catch (err) {
      setError("Error al obtener reservas: " + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      let users = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setUsuarios(users);
    } catch (err) {
      setError("Error al obtener usuarios: " + err.message);
    }
  };

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCabanas(cabs);
    } catch (err) {
      setError("Error al obtener cabañas: " + err.message);
    }
  };

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
      setNuevaReserva({
        usuario: "",
        cabana: "",
        fechaInicio: "",
        fechaFin: "",
        precio: "",
        estado: "Pendiente",
        observaciones: "",
        activo: true
      });
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
      mostrarAlerta("Error","Error al eliminar reserva: " + err.message);
    }
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaReserva({
      usuario: "",
      cabana: "",
      fechaInicio: "",
      fechaFin: "",
      precio: "",
      estado: "Pendiente",
      observaciones: ""
    });
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

  return (
    <div className="seccion-usuarios">
      <div className="page-header-Academicos">
        <h1 className="titulo-admin" >Gestión de Reservas</h1>
        {canCreate && !readOnly && (
          <button className="btn-admin" onClick={abrirModalCrear}>
            ➕ Nueva Reserva
          </button>
        )}
      </div>
      <section className="filtros-section-admin">
        <div className="busqueda-contenedor">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar Reserva..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
        <div class="filtro-grupo-admin">
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


        {error && <div className="error-message">{error}</div>}
        <TablaReservas
          reservas={reservasFiltradas}
          onEditar={canEdit && !readOnly ? abrirModalEditar : null}
          onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarReserva : null}
        />
      </section>
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
    </div>
  );
};

export default GestionReservas;
