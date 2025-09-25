import React, { useEffect, useState } from 'react';
import SolicitudModal from '../modal/SolicitudModal';
import { solicitudService } from '../../../services/solicirudService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
const Gestionsolicitud = () => {

  const [solicitudes, setSolicitudes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalModeSolicitud, setModalMode] = useState('create');
  const [currentItemSolicitud, setCurrentItem] = useState(null);


  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      mostrarAlerta("Error", "Error al obtener solicitudes");
    }
  };
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

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

  const handleSubmit = async (dataSolicitud) => {
    try {
      if (modalModeSolicitud === 'create') {
        await solicitudService.create(dataSolicitud);
         mostrarAlerta("¡EXITO!", "Solciitud creada exitosamente");
      } else {
        await solicitudService.update(currentItemSolicitud._id, dataSolicitud);
        mostrarAlerta("¡EXITO!", "Solicitud actualizada exitosamente");
      }
      setShowModal(false);
      obtenerSolicitudes();
    }catch (error){
      mostrarAlerta("ERROR", `Error: ${error.message}`,'error');
    }
   
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
            <input type="text" placeholder="Buscar Solicitudes..." id="userSearch"></input>
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
              <th>NOMBRE SOLICITANTE </th>
              <th>CORREO SOLICITANTE</th>
              <th>TELEFONO SOLICITANTE</th>
              <th>ROL SOLICITANTE</th>
              <th>TIPO SOLICITUD</th>
              <th>CATEGORIA</th>
              <th>ORIGEN</th>
              <th>ESTADO</th>
              <th>PRIORIDAD</th>
              <th>FECHA SOLICITUD</th>
              <th>RESPONSABLE</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {(solicitudes || []).map((soli) => (
              <tr key={soli._id}>
                <td>
                  <input type="checkbox" className="select-row"></input>
                </td>
                <td>{soli._id}</td>
                <td>{soli.solicitante?.username || soli.solicitante?.nombre || soli.solicitante?.correo || soli.solicitante?._id || "N/A"}</td>
                <td>{soli.solicitante?.correo || soli.correo || "N/A"}</td>
                <td>{soli.solicitante?.telefono || soli.telefono || "N/A"}</td>
                <td>
                  <span className={`role-badge-tesorero role-tesorero-${soli.solicitante?.role}`}>
                   {soli.solicitante?.role || "N/A"}
                  </span>
                 
                  </td>
                <td>{soli.tipoSolicitud || "N/A"}</td>
                <td>{soli.categoria?.nombre || soli.categoria?._id || "N/A"}</td>
                <td>{soli.modeloReferencia || "N/A"}</td>
                <td>
                  <span className={`badge-tesorero badge-tesorero-${soli.estado}`}>
                  
                    {soli.estado || "N/A"}
                  </span>
                </td>
                <td>
                  <span className={`priority-tesorero priority-tesorero-${soli.prioridad}`}>
                    {soli.prioridad || "N/A"}
                  </span>
                 
                  </td>
                <td>{new Date(soli.fechaSolicitud).toLocaleDateString()}</td>
                <td>{soli.responsable?.nombre || soli.responsable?.username || soli.responsable?.email || soli.responsable?._id || "N/A"
                }</td>
                <td className="actions-cell">
                  <button className="action-btn edit" onClick={() => handleEdit(soli)}>
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {showModal && (
        <SolicitudModal
          mode={modalModeSolicitud}
          initialData={currentItemSolicitud || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />

      )}
    </main>
    <Footer/>
    </>
  );
};

export default Gestionsolicitud;