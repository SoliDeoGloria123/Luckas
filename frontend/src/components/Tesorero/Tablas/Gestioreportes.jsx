import React, {useState} from "react";

const Gestionreportes = () => {

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
                        <h1>Gestión de Reportes</h1>
                        <p>Generar informes del sistema</p>
                    </div>
                </div>

                <button className="btn-primary-tesorero" onClick={handleCreate}>
                    <i className="fas fa-plus"></i>
                     Nuevo Reporte
                </button>
            </div>
            <div className="stats-grid-solicitudes">
                <div className="stat-card-solicitudes">
                    <div className="stat--solicitudes">
                        <div className="stat-number-solicitudes">4</div>
                        <div className="stat-label-solicitudes">Total Reportes</div>
                    </div>
                    <div className="stat-icon-solicitudes purple">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                </div>

                <div className="stat-card-solicitudes">
                    <div className="stat--solicitudes">
                        <div className="stat-number-solicitudes">1</div>
                        <div className="stat-label-solicitudes">Disponibles</div>
                    </div>
                    <div className="stat-icon-solicitudes orange">
                        <i className="fas fa-check-circle"></i>
                    </div>
                </div>

                <div className="stat-card-solicitudes">
                    <div className="stat--solicitudes">
                        <div className="stat-number-solicitudes">1</div>
                        <div className="stat-label-solicitudes">Ocupadas</div>
                    </div>
                    <div className="stat-icon-solicitudes green">
                        <i class="fas fa-users"></i>
                    </div>
                </div>

                <div className="stat-card-solicitudes">
                    <div className="stat--solicitudes">
                        <div className="stat-number-solicitudes">2</div>
                        <div className="stat-label-solicitudes">En Mantenimiento</div>
                    </div>
                    <div className="stat-icon-solicitudes red">
                        <i class="fas fa-tools"></i>
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
        </main>
    )

}

export default Gestionreportes;
