import React, { useState, useEffect } from 'react';
import CategorizacionModal from '../modal/CategorizacionModal';
import { categorizacionService } from '../../../services/categorizacionService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'


const Gestioncategorizacion = () => {
  const [categorias, setCategorias] = useState([]);
  const [modalMode, setModalMode] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };
  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (modalMode === "create") {
        await categorizacionService.create(data);
        mostrarAlerta("¡EXITO!", "Categoría creada exitosamente");
      } else {
        await categorizacionService.update(currentItem._id, data);
        mostrarAlerta("¡EXITO!", "Categoría actualizada exitosamente");
      }
      setShowModal(false);
      obtenerCategorias();
    } catch (error) {
      mostrarAlerta("ERROR", `Error: ${error.message}`, 'error');
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode("create");
    setCurrentItem(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (categoria) => {
    setModalMode("edit");
    setCurrentItem(categoria);
    setShowModal(true);
  };
  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
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
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo de categoria</th>
                <th>Codigo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={5}>no hay categorias para mostrar</td>
                </tr>
              ) : (
                categorias.map((cate) => (
                  <tr key={cate._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{cate._id}</td>
                    <td>{cate.nombre}</td>
                    <td>{cate.tipo}</td>
                    <td>{cate.codigo}</td>
                    <td>
                      <span className={`badge-tesorero badge-tesorero-${cate.activo ? 'activo' : 'desactivado'}`}>
                        {cate.activo ? 'activo' : 'desactivado'}
                      </span>
                    </td>

                    <td className='actions-cell'>
                      <button className='action-btn edit' onClick={() => handleEdit(cate)}>
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>

                ))
              )}
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
      <Footer />
    </>
  );
};

export default Gestioncategorizacion;