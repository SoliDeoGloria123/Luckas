import React, { useState, useEffect } from 'react';
import { tareaService } from "../../../services/tareaService";
import { userService } from "../../../services/userService";
import TareaModal from '../modal/TareaModal';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'


const Gestiontarea = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModalTarea] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItemTarea, setcurrentItemTarea] = useState(null);


  // Obtener tareas y usuarios
  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      setTareas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error al obtener tareas: " + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };
  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const handleSubmit = async (Tareadata) => {
    try {
      if (modalMode === 'create') {
        await tareaService.create(Tareadata);
        mostrarAlerta("¡Éxito!", "Tarea creada exitosamente");
      } else {
        await tareaService.update(currentItemTarea._id, Tareadata);
        mostrarAlerta("¡Éxito!", "Tarea actualizada exitosamente");

      }
      setShowModalTarea(false);
      obtenerTareas();
    } catch (error) {
      mostrarAlerta("Error", "Error al procesar la tarea: " + error.message);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setcurrentItemTarea(null);
    setShowModalTarea(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setcurrentItemTarea(item);
    setShowModalTarea(true);
  };


  return (
    <>
    <Header/>
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Tareas</h1>
            <p>Asignar y supervisar tareas del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nueva Tarea
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
            <i class="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="totalUsers">5</div>
            <div className="stat-label-usuarios">Total Tareas</div>
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
          <div className="stat-icon-usuarios blue     ">
            <i class="fas fa-spinner"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="adminUsers">1</div>
            <div className="stat-label-usuarios">En Progreso</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
            <i class="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="newUsers">12</div>
            <div className="stat-label-usuarios">Completadas</div>
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
              <th>TITULO</th>
              <th>DESCRIPCION</th>
              <th>ESTADO</th>
              <th>PRIORIDAD</th>
              <th>ASIGNADO A </th>
              <th>ASIGNADO A ROL</th>
              <th>ASIGNADO POR</th>
              <th>ASIGANADO POR ROL </th>
              <th>FECHA LIMITE</th>
              <th>FECHA CREACION</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {tareas.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay tareas para mostrar</td>
              </tr>
            ) : (
              tareas.map((tarea) => (
                <tr key={tarea._id}>
                  <td>
                    <input type="checkbox" value={tarea._id}></input>
                  </td>
                  <td>{tarea._id}</td>
                  <td>{tarea.titulo}</td>
                  <td>{tarea.descripcion}</td>
                  <td>
                    <span className={`badge-tesorero badge-tesorero-${tarea.estado} `}>
                      {tarea.estado}
                    </span>
                  </td>
                  <td>{tarea.prioridad}</td>
                  <td>{tarea.asignadoA?.nombre || "N/A"}</td>
                  <td>{tarea.asignadoA?.role || "N/A"}</td>
                  <td>{tarea.asignadoPor?.nombre || "N/A"}</td>
                  <td>{tarea.asignadoPor?.role || "N/A"}</td>
                  <td>{tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}</td>
                  <td>
                    {tarea.updatedAt ? new Date(tarea.updatedAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className='actions-cell'>
                    <button className="action-btn edit" onClick={() => handleEdit(tarea)}>
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
        <TareaModal
          mode={modalMode}
          initialData={currentItemTarea || {}}
          onClose={() => setShowModalTarea(false)}
          onSubmit={handleSubmit}
          usuarios={usuarios}
        />
      )}
    </main>
    <Footer/>
    </>
  );
};

export default Gestiontarea;