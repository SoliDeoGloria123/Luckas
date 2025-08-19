import React, { useState } from 'react';
import CategorizacionModal from '../modal/CategorizacionModal';


const Gestioncategorizacion = () => {
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

    } else {

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
            <h1>Gestión de Categorías</h1>
            <p>Administra y organiza las categorías del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nueva Categoría
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios blue">
            <i class="fas fa-tags"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios">4</div>
            <div className="stat-label-usuarios">Total Categorías</div>
          </div>
        </div>

        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
            <i class="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios">1</div>
            <div className="stat-label-usuarios">Activas</div>
          </div>
          
        </div>

        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
            <i class="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios">1</div>
            <div className="stat-label-usuarios">Principales</div>
          </div>
        
        </div>

        <div className="stat-card-usuarios">
           <div className="stat-icon-usuarios orange">
           <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios">2</div>
            <div className="stat-label-usuarios">Nuevas Este Mes</div>
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
        <CategorizacionModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
};

export default Gestioncategorizacion;