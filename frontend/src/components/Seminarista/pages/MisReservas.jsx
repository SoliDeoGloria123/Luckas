import React, { useEffect, useState } from 'react';
import './MisInscripciones.css';
import Header from '../Shared/Header';
import Footer from '../../footer/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { reservaService } from '../../../services/reservaService';

const MisReservas = () => {
  // Estados
  const [reservas, setReservas] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInscripcion, setCurrentInscripcion] = useState(null);
  const [stats, setStats] = useState({
    confirmadas: 0,
    pendientes: 0,
    canceladas: 0,
    total: 0
  });
  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();
  const userId = usuarioLogueado?._id || usuarioLogueado?.id;

  useEffect(() => {
    if (!userId) return;
    reservaService.getReservasPorUsuario(userId)
      .then(data => {
        // Si la respuesta viene como {success, data}, usa data
        const reservasData = Array.isArray(data) ? data : data.data;
        setReservas(reservasData);
      })
      .catch(err => {
        console.error('Error al obtener reservas:', err);
      });
  }, [userId]);

  // Actualizar estadísticas
  const updateStats = (data) => {
    setStats({
      confirmadas: data.filter(i => i.estado === 'Confirmada').length,
      pendientes: data.filter(i => i.estado === 'Pendiente').length,
      canceladas: data.filter(i => i.estado === 'Cancelada').length,
      total: data.length
    });
  };
  
// Carrusel simple para el modal
const ModalImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="modal-carousel-wrapper">
      <button className="carousel-arrow left" onClick={prev}>&lt;</button>
      <img
        src={`http://localhost:3000/uploads/cabanas/${images[index]}`}
        alt={`Imagen ${index + 1}`}
        className="modal-image-misinscripciones"
        style={{ maxHeight: '260px', borderRadius: '12px' }}
      />
      <button className="carousel-arrow right" onClick={next}>&gt;</button>
      <div className="carousel-indicator">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

  // Filtrar inscripciones
  const filterInscripciones = (filter) => {
    setActiveFilter(filter);
  };

  // Abrir modal
  const openModal = (reserva) => {
    setCurrentInscripcion(reserva);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Cancelar inscripción
  const cancelarInscripcion = () => {
    alert(`Inscripción a "${currentInscripcion.titulo}" cancelada`);
    closeModal();
  };

  // Reservas filtradas
  const filteredReservas = activeFilter === 'Todas'
    ? reservas
    : reservas.filter(r => r.estado === activeFilter);
  return (

    <main className="main-content-seminario-inscripciones">
      <Header />
      <div className="container-seminario-inscripciones">
        {/* Encabezado */}
        <div className="page-header-seminario-inscripciones">
          <h1 className="page-title-seminario-inscripciones">Mis Reservas</h1>
          <p className="page-subtitle">Gestiona y revisa el estado de tus reservas de cabañas</p>
        </div>

        <div className="stats-grid-inscripciones-semianrista">
          <div className="stat-card-misolicitudes">
            <div className="stat-icon-inscripciones-semianrista confirmed">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="confirmadasCount">0</div>
              <div className="stat-label">Confirmadas</div>
            </div>
          </div>

          <div className="stat-card-misolicitudes">
            <div className="stat-icon-inscripciones-semianrista pending">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="pendientesCount">0</div>
              <div className="stat-label">Pendientes</div>
            </div>
          </div>

          <div className="stat-card-misolicitudes">
            <div className="stat-icon-inscripciones-semianrista cancelled">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="canceladasCount">0</div>
              <div className="stat-label">Canceladas</div>
            </div>
          </div>

          <div className="stat-card-misolicitudes">
            <div className="stat-icon-inscripciones-semianrista total">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="totalCount">0</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-card-inscripciones-semianrista">
          <div className="filters-content-inscripciones-semianrista">
            <span className="filter-label-inscripciones-semianrista">Filtrar por estado:</span>
            <div className="filter-buttons-inscripciones-semianrista">
              <button
                className={`filter-btn-inscripciones-semianrista ${activeFilter === 'Todas' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Todas')}
              >
                Todas
              </button>
              <button
                className={`filter-btn-inscripciones-semianrista ${activeFilter === 'Confirmada' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Confirmada')}
              >
                Confirmada
              </button>
              <button
                className={`filter-btn-inscripciones-semianrista ${activeFilter === 'Pendiente' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Pendiente')}
              >
                Pendiente
              </button>
              <button
                className={`filter-btn-inscripciones-semianrista ${activeFilter === 'Cancelada' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Cancelada')}
              >
                Cancelada
              </button>
            </div>
          </div>
        </div>

        {/* Lista de inscripciones */}
          {filteredReservas.length === 0 && (
            <div className='no-data-container-misinscripciones'>
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin reservas" style={{width: '120px', marginBottom: '20px', opacity: 0.7}} />
              <div>No tienes reservas registradas.</div>
              <div style={{fontSize: '0.95em', color: '#888', marginTop: '8px'}}>¡Haz tu primera reserva y disfruta la experiencia!</div>
            </div>
          )}
        {filteredReservas.map((reserva) => (
          <div className="inscripciones-container-misinscripciones">
            <div className="inscripcion-card-misinscripciones" key={reserva.id}>
              <div className="inscripcion-content-misinscripciones">
                {Array.isArray(reserva.cabana?.imagen) && reserva.cabana.imagen.length > 0 ? (
                  <img
                    src={
                      reserva.cabana.imagen[0].startsWith('http')
                        ? reserva.cabana.imagen[0]
                        : `http://localhost:3000/uploads/cabanas/${reserva.cabana.imagen[0]}`
                    }
                    alt={reserva.cabana?.nombre || 'Imagen de la cabaña'}
                    className="modal-image-misinscripciones"
                     
                  />
                ) : (
                  <p>Imagen no disponible</p>
                )}
                <div className="inscripcion-body-misinscripciones">
                  <div className="header-misinscripciones">
                    <div className="inscripcion-title-section-misinscripciones">
                      <div className="inscripcion-title-row-misinscripciones">
                        <h3 className="inscripcion-title-misinscripciones">{reserva.cabana?.nombre || 'Cabaña'}</h3>
                        <span className={`status-badge-misinscripciones ${reserva.estado.toLowerCase()}`}>{reserva.estado}</span>
                      </div>
                      {/* Si tienes categoría, puedes mostrarla aquí */}
                      {/* <span className={`categoria-badge ${inscripcion.categoria?.toLowerCase()}`}>{inscripcion.categoria}</span> */}
                    </div>
                    <div className="inscripcion-price-section-misinscripciones">
                      <div className="inscripcion-price-misinscripciones">{reserva.precio}</div>
                      <div className="inscripcion-date-misinscripciones">Fecha de Reserva: {new Date(reserva.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="inscripcion-details-misinscripciones">
                    <div className="detail-row-misinscripciones">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(reserva.createdAt).toLocaleDateString()} - {new Date(reserva.fechaFin).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row-misinscripciones">
                      <i className="fas fa-clock"></i>
                      <span>{reserva.cabana?.capacidad || 'No especificada'} </span>
                    </div>
                    <div className="detail-row-misinscripciones">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{reserva.cabana?.ubicacion}</span>
                    </div>
                  </div>
                  <div className="inscripcion-footer-misinscripciones">
                    <div className="status-info-misinscripciones">
                      <i className={`fas status-icon-misinscripciones-${reserva.estado.toLowerCase()}`}></i>
                      <span className="status-text-misinscripciones">{reserva.estado}</span>
                    </div>
                    <div className="inscripcion-actions-misinscripciones">
                      <button className="btn-outline-misinscripciones" onClick={() => openModal(reserva)}>
                        <i className="fas fa-eye"></i>
                        Ver Detalles
                      </button>
                      {/*<button className="btn-danger-misinscripciones">Cancelar</button>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Modal de Detalles */}
        {isModalOpen && currentInscripcion && (
          <div className="modal-overlay-misinscripciones show" onClick={closeModal}>
            <div className="modal-container-misinscripciones" onClick={e => e.stopPropagation()}>
              <div className="modal-header-misinscripciones">
                {Array.isArray(currentInscripcion.cabana?.imagen) && currentInscripcion.cabana.imagen.length > 0 ? (
                  <img
                    src={
                      currentInscripcion.cabana.imagen[0].startsWith('http')
                        ? currentInscripcion.cabana.imagen[0]
                        : `http://localhost:3000/uploads/cabanas/${currentInscripcion.cabana.imagen[0]}`
                    }
                    alt={currentInscripcion.cabana?.nombre || 'Imagen de la cabaña'}
                    className="modal-image-misinscripciones"
                    style={{ maxHeight: '260px', borderRadius: '12px' }}
                  />
                ) : (
                  <p>Imagen no disponible</p>
                )}
                <button className="modal-close-misinscripciones" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-content-misinscripciones">
                <div className="modal-status-price-misinscripciones">
                  <span id="modalStatus" className={`status-badge-misinscripciones ${currentInscripcion.estado.toLowerCase()}`}>
                    {currentInscripcion.estado}
                  </span>
                  <span id="modalPrice" className="modal-price-misinscripciones">
                    {currentInscripcion.precio}
                  </span>
                </div>
                <h2 id="modalTitle" className="modal-title-misinscripciones">{currentInscripcion.cabana?.nombre}</h2>
                <div className="modal-details-grid-misinscripciones">
                  <div className="modal-section-misinscripciones">
                    <h3 className="section-title-misinscripciones">Datos de la Cabaña</h3>
                    <div className="detail-item-misinscripciones"><strong>Descripción:</strong> {currentInscripcion.cabana?.descripcion}</div>
                    <div className="detail-item-misinscripciones"><strong>Ubicación:</strong> {currentInscripcion.cabana?.ubicacion}</div>
                    <div className="detail-item-misinscripciones"><strong>Capacidad:</strong> {currentInscripcion.cabana?.capacidad}</div>
                    <div className="detail-item-misinscripciones"><strong>Precio:</strong> {currentInscripcion.cabana?.precio}</div>
                  </div>
                  <div className="modal-section-misinscripciones">
                    <h3 className="section-title-misinscripciones">Datos de la Reserva</h3>
                    <div className="detail-item-misinscripciones"><strong>Fecha de Reserva:</strong> {new Date(currentInscripcion.createdAt).toLocaleDateString()}</div>
                    <div className="detail-item-misinscripciones"><strong>Fechas de estadía:</strong> {new Date(currentInscripcion.fechaInicio).toLocaleDateString()} - {new Date(currentInscripcion.fechaFin).toLocaleDateString()}</div>
                    <div className="detail-item-misinscripciones"><strong>Personas:</strong> {currentInscripcion.numeroPersonas}</div>
                    <div className="detail-item-misinscripciones"><strong>Estado:</strong> {currentInscripcion.estado}</div>
                    <div className="detail-item-misinscripciones"><strong>Observaciones:</strong> {currentInscripcion.observaciones}</div>
                  </div>
                </div>
                <div className="modal-actions-misinscripciones">
                  <button className="btn-secondary-misinscripciones" onClick={closeModal}>Cerrar</button>
                  {currentInscripcion.estado === 'Confirmada' && (
                    <button
                      id="cancelarBtn"
                      className="btn-danger-misinscripciones"
                      onClick={cancelarInscripcion}
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default MisReservas;
