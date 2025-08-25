import React, { useState, useEffect } from 'react';
import { reservaService } from '../../../services/reservaService';
import { userService } from "../../../services/userService";
import { cabanaService } from "../../../services/cabanaService";
import { mostrarAlerta } from '../../utils/alertas';
import ReservaModal from '../modal/ReservaModal';


const Gestionreserva = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [showModalEvento, setshowModalEvento] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  //obtener reservas 
  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      let resvs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setReservas(resvs);
    } catch (err) {
      console.log("Error al obtener reservas: " + err.message);
    }
  };
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      let users = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setUsuarios(users);
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
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
    setModalMode('create');
    setCurrentItem(null);
    setshowModalEvento(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setshowModalEvento(true);
  };

  const handleSubmit = async (Reservadata) => {
    try {
      if (modalMode === 'create') {
        await reservaService.create(Reservadata);
        mostrarAlerta("¡Éxito!", "Reserva creada exitosamente");
      } else {
        await reservaService.update(currentItem._id, Reservadata);
        mostrarAlerta("¡Éxito!", "Reserva actualizada exitosamente");
      }
      setshowModalEvento(false);
      obtenerReservas();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    };
  };

  return (
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Reservas</h1>
            <p>Administra reservas de cabañas y servicios</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nueva Reserva
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios blue">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="totalUsers">5</div>
            <div className="stat-label-usuarios">Total Reservas</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios orange">
            <i class="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="activeUsers">4</div>
            <div className="stat-label-usuarios">Pendientes</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="adminUsers">$12,450</div>
            <div className="stat-label-usuarios">Ingresos Mes</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
            <i class="fas fa-check-circle"></i>
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
            <i class="fas fa-share"></i>
          </button>
        </div>
      </div>


      <div className="table-container-tesorero">
        <table className="users-table-tesorero">
          <thead>
            <tr>
              <th>
                <input type="checkbox" id="selectAll"></input>
              </th>
              <th>ID</th>
              <th>USUARIOS</th>
              <th>CABAÑA</th>
              <th>FECHA INCIO</th>
              <th>FECHA FIN</th>
              <th>PRECIO</th>
              <th>ESTADO</th>
              <th>OBSERVACION</th>
              <th>SOLICITUD</th>
              <th>ACTIVO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {reservas.length === 0 ? (
              <td colSpan={12} >No hay reservas</td>
            ) : (
              reservas.map((reser) => (
                <tr key={reser._id}>
                  <td>
                    <input type="checkbox" className="select-row"></input>
                  </td>
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
                  <td>{reser.precio}</td>
                  <td>{reser.estado}</td>
                  <td>{reser.observaciones}</td>
                  <td>
                    {typeof reser.solicitud === "object"
                      ? reser.solicitud?._id || "N/A"
                      : reser.solicitud || "N/A"}
                  </td>
                  <td>{reser.activo}</td>
                  <td className='actions-cell'>
                    <button className='action-btn edit' in onClick={() => handleEdit(reser)}>
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>


                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModalEvento && (
        <ReservaModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setshowModalEvento(false)}
          onSubmit={handleSubmit}
          usuarios={usuarios}
          cabanas={cabanas}
        />
      )}
    </main>
  );
};

export default Gestionreserva;