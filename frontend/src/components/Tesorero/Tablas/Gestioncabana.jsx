import React, { useState, useEffect } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { categorizacionService } from '../../../services/categorizacionService';
import { useNavigate } from "react-router-dom";
import { mostrarAlerta } from '../../utils/alertas';
import CabanaModal from '../modal/CabanaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';

const Gestioncabana = () => {
  const [cabanas, setCabanas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalCabana] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
  const [modalImagen, setModalImagen] = useState({ abierto: false, imagenes: [], actual: 0 });

  const handleVerImagenes = (imagenes) => {
    if (Array.isArray(imagenes) && imagenes.length > 0) {
      setModalImagen({ abierto: true, imagenes, actual: 0 });
    }
  };
  const handleNext = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual + 1) % prev.imagenes.length
    }));
  };

  const handlePrev = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual - 1 + prev.imagenes.length) % prev.imagenes.length
    }));
  };

  const cerrarModalImagen = () => {
    setModalImagen({ abierto: false, imagenes: [], actual: 0 });
  };

  const ataras = () => {
    navigate('/tesorero');
  };

  // Obtener cabañas
  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCabanas(cabs);
    } catch (err) {
      console.log("Error al obtener cabañas: " + err.message);
    }
  };
  const obtenerCategorias = async () => {
    try {
      const data = await categorizacionService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCategorias(cats);
    } catch (err) {
      console.log("Error", "Error al obtener categorías: " + err.message);
    }
  };
  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  const handleSubmit = async (data) => {
    if (modalMode === 'create') {
      try {
        await cabanaService.create(data);
        mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente")
        obtenerCabanas();
      } catch (error) {
        mostrarAlerta("Error", "Error al crear la cabaña: " + error.message, "error");
      }
    } else {
      try {
        await cabanaService.update(currentItem._id, data);
        mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente");
        obtenerCabanas();
      } catch (err) {
        mostrarAlerta("Error", "Error al actualizar cabaña: " + err.message);
      }
    }
  };


  const handleCreate = () => {
    setModalCabana('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleDeleteCabana = async (id) => {
    if (!id) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta cabaña?')) return;
    try {
      await cabanaService.delete(id);
      mostrarAlerta('¡Éxito!', 'Cabaña eliminada exitosamente');
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta('Error', 'Error al eliminar cabaña: ' + err.message);
    }
  };

  return (
    <>
    <Header/>
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero" onClick={ataras}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Cabañas</h1>
            <p>Administra reservas y disponibilidad de cabañas</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nueva Cabaña
        </button>
      </div>
      <div className="stats-grid-solicitudes">
        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">4</div>
            <div className="stat-label-solicitudes">Total Cabañas</div>
          </div>
          <div className="stat-icon-solicitudes purple">
            <i className="fas fa-home"></i>
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
              <th>ID</th>
              <th>NOMBRE</th>
              <th>DESCRIPCION</th>
              <th>CAPACIDAD</th>
              <th>CATEGORIA</th>
              <th>PRECIO</th>
              <th>ESTADO</th>
              <th>CREADOR POR</th>
              <th>IMAGEN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {cabanas.length === 0 ? (
              <tr>

                <td colSpan={7}>No hay cabañas disponible</td>
              </tr>
            ) : (
              cabanas.map((caba) => (
                <tr key={caba._id}>
                  <td><input type="checkbox" /></td>
                  <td>{caba._id}</td>
                  <td>{caba.nombre}</td>
                  <td>{caba.descripcion}</td>
                  <td>{caba.capacidad}</td>
                  <td>{caba.categoria?.nombre || caba.categoria || 'N/A' }</td>
                  <td>{caba.precio}</td>
                  <td>
                    <span className={`badge-tesorero badge-tesorero-${caba.estado} `}>
                       {caba.estado}
                    </span>
                 
                    </td>
                  <td>{caba.creadoPor?.nombre || caba.creadoPor || 'N/A'}</td>
                  <td>
                    {Array.isArray(caba.imagen) && caba.imagen.length > 0 ? (
                      <button onClick={() => handleVerImagenes(caba.imagen)} className="btn-image-tesorero">
                       <i class="fas fa-eye"></i>
                      </button>
                    ) : (
                      <span class="no-image-tesorero">Sin imagen</span>
                    )}

                  </td>
                  <td className='actions-cell'>
                    <button className='action-btn edit' onClick={() => {
                      setModalCabana('edit');
                      setCurrentItem(caba);
                      setShowModal(true);
                    }}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className='action-btn delete' onClick={() => handleDeleteCabana(caba._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {modalImagen.abierto && (
          <div className="modal-overlay-admin" onClick={cerrarModalImagen}>
            <div className="modal-imagines modal-imagines" onClick={(e) => e.stopPropagation()}>
              <button className="btn-cerrar" onClick={cerrarModalImagen}>✖</button>
              <button className="btn-flecha izquierda" onClick={handlePrev}>◀</button>
              <img
                src={`http://localhost:3000/uploads/cabanas/${modalImagen.imagenes[modalImagen.actual]}`}
                alt="Imagen del evento"
                className="imagen-modal"
              />
              <button className="btn-flecha derecha" onClick={handleNext}>▶</button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <CabanaModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          categorias={categorias}
        />
      )}
    </main>
    <Footer/>
    </>
  );
};

export default Gestioncabana;