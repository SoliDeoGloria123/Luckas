import React, { useState } from 'react';
import SolicitudModal from '../modal/SolicitudModal';
const Gestionsolicitud = () => {
  // Datos de ejemplo
  const users = [
    {
      id: "GSI0405100d800b0f9b2c5656",
      username: "pedrasa",
      email: "admin@gmail.com",
      phone: "3115524272",
      docType: "Cédula de ciudadanía",
      docNumber: "117200207",
      role: "(Administrador)",
      status: "ACTIVO",
      date: "2/8/2025"
    },
    {
      id: "GSI0405100d800b0f9b2c5667",
      username: "perera",
      email: "sabat@mail.com",
      phone: "1311354354",
      docType: "Cédula de ciudadanía",
      docNumber: "12135434354",
      role: "(Tesorero)",
      status: "ACTIVO",
      date: "2/8/2025"
    },
    // Más usuarios...
  ];

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    if (modalMode === 'create') {
      // Lógica para crear
    } else {
      // Lógica para editar
    }
  };


  return (
    <main className="main--solicitudes-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Solicitudes</h1>
            <p>dministra y procesa todas las solicitudes del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nueva Solicitud
        </button>
      </div>

      <div className="stats-grid-solicitudes">
        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">4</div>
            <div className="stat-label-solicitudes">Total Solicitudes</div>
          </div>
          <div className="stat-icon-solicitudes purple">
            <i className="fas fa-file-alt"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Pendientes</div>
          </div>
          <div className="stat-icon-solicitudes orange">
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Aprobadas</div>
          </div>
          <div className="stat-icon-solicitudes green">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">2</div>
            <div className="stat-label-solicitudes">Alta Prioridad</div>
          </div>
          <div className="stat-icon-solicitudes red">
            <i className="fas fa-exclamation-triangle"></i>
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
          <button className="btn-outline-tesorero" id="exportBtn">
            <i className="fas fa-download"></i>
          </button>
          <button className="btn-outline-tesorero" id="importBtn">
            <i className="fas fa-upload"></i>
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
              <th>USUARIO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>ÚLTIMA ACTIVIDAD</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">

          </tbody>
        </table>
      </div>

      {showModal && (
        <SolicitudModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />

      )}
    </main>
  );
};

export default Gestionsolicitud;