import React, { useState, useEffect } from 'react';
import { reservaService } from '../../../services/reservaService';
import { userService } from '../../../services/userService';
import { cabanaService } from '../../../services/cabanaService';
import { mostrarAlerta } from '../../utils/alertas';
import ReservaModal from '../../Dashboard/Modales/ReservaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import { Edit } from 'lucide-react';


const Gestionreserva = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuario: '',
    cabana: '',
    fechaInicio: '',
    fechaFin: '',
    numeroPersonas: 1,
    tipoDocumento: '',
    numeroDocumento: '',
    correoElectronico: '',
    telefono: '',
    propositoEstadia: '',
    estado: 'pendiente'
  });

  //obtener reservas 
  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      let resvs = [];
      if (Array.isArray(data)) {
        resvs = data;
      } else if (Array.isArray(data.data)) {
        resvs = data.data;
      } else {
        resvs = [];
      }
      setReservas(resvs);
    } catch (err) {
      console.log("Error al obtener reservas: " + err.message);
    }
  };
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (Array.isArray(data.data)) {
        users = data.data;
      } else {
        users = [];
      }
      setUsuarios(users);
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = [];
      if (Array.isArray(data)) {
        cabs = data;
      } else if (Array.isArray(data.data)) {
        cabs = data.data;
      } else {
        cabs = [];
      }
      setCabanas(cabs);
    } catch (err) {
      console.log("Error al obtener cabañas: " + err.message);
    }
  };

  useEffect(() => {
    obtenerReservas();
    obtenerUsuarios();
    obtenerCabanas();
  }, []);

  const handleCreate = () => {
    setModoEdicion(false);
    setReservaSeleccionada(null);
    setNuevaReserva({
      usuario: '',
      cabana: '',
      fechaInicio: '',
      fechaFin: '',
      numeroPersonas: 1,
      tipoDocumento: '',
      numeroDocumento: '',
      correoElectronico: '',
      telefono: '',
      propositoEstadia: '',
      estado: 'pendiente'
    });
    setMostrarModal(true);
  };

  const handleEdit = (reserva) => {
    setModoEdicion(true);
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearReserva = async (payload) => {
    // Soporta recibir event (desde un submit directo) o un payload (objeto)
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaReserva;
      await reservaService.create(body);
      mostrarAlerta("¡Éxito!", "Reserva creada exitosamente", 'success');
      setMostrarModal(false);
      obtenerReservas();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al crear reserva: ${error.message}`, 'error');
    }
  };

  const actualizarReserva = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaReserva;
      const id = (body && body._id) ? body._id : (reservaSeleccionada && reservaSeleccionada._id);
      if (!id) {
        mostrarAlerta('ERROR', 'No se encontró el ID de la reserva a actualizar', 'error');
        return;
      }
      await reservaService.update(id, body);
      mostrarAlerta("¡Éxito!", "Reserva actualizada exitosamente", 'success');
      setMostrarModal(false);
      obtenerReservas();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al actualizar reserva: ${error.message}`, 'error');
    }
  };




  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(reservas.length / registrosPorPagina);
  const reservasPaginadas = reservas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [reservas]);

  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Reservas</h1>
              <p>Administra reservas de cabañas y servicios</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Reserva
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">5</div>
              <div className="stat-label-usuarios">Total Reservas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">4</div>
              <div className="stat-label-usuarios">Pendientes</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">$12,450</div>
              <div className="stat-label-usuarios">Ingresos Mes</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">12</div>
              <div className="stat-label-usuarios">Confirmadas</div>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Buscar usuarios..." id="userSearch"></input>
            </div>
            <select className="filter-select">
              <option value="">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="tesorero">Tesorero</option>
              <option value="seminarista">Seminarista</option>
            </select>
            <select id="statusFilter" className="filter-select">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="export-actions">
            <button className="btn-outline-tesorero" >
              <i className="fas fa-download"></i>
            </button>
            <button className="btn-outline-tesorero" >
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">

                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Cabaña</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Número de Personas</th>
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Correo Electrónico</th>
                    <th>Teléfono</th>
                    <th>Propósito de Estadía</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th>Solicitud</th>
                    <th>Activo</th>
                    <th>Fecha de creación</th>
                    <th>Fecha de actualización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {reservas.length === 0 ? (
                    <td colSpan={12} >No hay reservas</td>
                  ) : (
                    reservasPaginadas.map((reser) => (
                      <tr key={reser._id}>
                        <td>{reser._id}</td>
                        <td>
                          {typeof reser.usuario === "object"
                            ? reser.usuario?.username || reser.usuario?.nombre || reser.usuario?.correo || reser.usuario?._id || "N/A"
                            : reser.usuario || "N/A"}
                        </td>

                        <td>
                          {typeof reser.cabana === "object"
                            ? reser.cabana?.nombre || reser.cabana?._id || "N/A"
                            : reser.cabana || "N/A"}
                        </td>
                        <td>{reser.fechaInicio ? new Date(reser.fechaInicio).toLocaleDateString() : ""}</td>
                        <td>{reser.fechaFin ? new Date(reser.fechaFin).toLocaleDateString() : ""}</td>
                        <td>{reser.numeroPersonas || "N/A"}</td>
                        <td>{reser.tipoDocumento || "N/A"}</td>
                        <td>{reser.numeroDocumento || "N/A"}</td>
                        <td>{reser.correoElectronico || "N/A"}</td>
                        <td>{reser.telefono || "N/A"}</td>
                        <td>{reser.propositoEstadia || "N/A"}</td>

                        <td>
                          <span className={`badge-tesorero badge-tesorero-${reser.estado} `}>
                            {reser.estado}
                          </span>

                        </td>
                        <td>{reser.observaciones || "N/A"}</td>
                        <td>
                          {typeof reser.solicitud === "object"
                            ? reser.solicitud?._id || "N/A"
                            : reser.solicitud || "N/A"}
                        </td>
                       <td>
                          <span className={`status-badge status-${reser.activo ? 'Activo' : 'Desactivado'}`}>
                            {reser.activo ? 'Activo' : 'Desactivado'}
                          </span>
                        </td>
                       <td>{reser.createdAt ? new Date(reser.createdAt).toLocaleDateString() : "N/A"}</td>
                       <td>{reser.updatedAt ? new Date(reser.updatedAt).toLocaleDateString() : "N/A"}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(reser)}>
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {mostrarModal && (
          <ReservaModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            reservaSeleccionada={reservaSeleccionada}
            setReservaSeleccionada={setReservaSeleccionada}
            nuevaReserva={nuevaReserva}
            setNuevaReserva={setNuevaReserva}
            usuarios={usuarios}
            cabanas={cabanas}
            onClose={() => setMostrarModal(false)}
            onSubmit={(e) => modoEdicion ? actualizarReserva(e) : crearReserva(e)}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestionreserva;