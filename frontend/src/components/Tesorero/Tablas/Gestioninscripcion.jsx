import React, { useState } from 'react';
import InscripcionModal from '../modal/InscripcionModal';

const Gestioninscripcion = () => {
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
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="dashboard-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Inscripciones</h1>
            <p>Procesar inscripciones y categorizar</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
        Nueva Inscripción
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios blue">
          <i class="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="totalUsers">5</div>
            <div className="stat-label-usuarios">Total Inscripciones</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
              <i class="fas fa-calendar-plus"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="activeUsers">4</div>
            <div className="stat-label-usuarios">Nuevas Esta Semana</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
          <i class="fas fa-check-double"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="adminUsers">1</div>
            <div className="stat-label-usuarios">Aprobadas</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios orange">
             <i class="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="newUsers">12</div>
            <div className="stat-label-usuarios">Pendientes</div>
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
        <InscripcionModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
};

export default Gestioninscripcion;