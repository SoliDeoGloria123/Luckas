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
import { inscripcionService } from '../../../services/inscripcionService';

const MisInscripciones = () => {
  // Estados
  const [inscripciones, setInscripciones] = useState([]);
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

  // Datos de ejemplo (simulando API)
  useEffect(() => {
        if (!userId) return;
         inscripcionService.getIncripcionesPorUsuario(userId)
          .then(data => {
            // Si la respuesta viene como {success, data}, usa data
            const inscripcionData = Array.isArray(data) ? data : data.data;
            setInscripciones(inscripcionData);
      })
      .catch(err => {
        console.error('Error al obtener las inscripciones:', err);
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

  // Filtrar inscripciones
  const filterInscripciones = (filter) => {
    setActiveFilter(filter);
  };

  // Abrir modal
  const openModal = (inscripcion) => {
    setCurrentInscripcion(inscripcion);
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

  // Inscripciones filtradas
  const filteredInscripciones = activeFilter === 'Todas'
    ? inscripciones
    : inscripciones.filter(i => i.estado === activeFilter);
  return (

    <main className="main-content-seminario-inscripciones">
      <Header />
      <div className="container-seminario-inscripciones">
        {/* Encabezado */}
        <div className="page-header-seminario-inscripciones">
          <h1 className="page-title-seminario-inscripciones">Mis Inscripciones</h1>
          <p className="page-subtitle">Gestiona y revisa el estado de tus inscripciones a eventos</p>
        </div>

        {/* Tarjetas de estadísticas */}
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
          {filteredInscripciones.length === 0 && (
            <div className='no-data-container-misinscripciones'>
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin reservas" style={{width: '120px', marginBottom: '20px', opacity: 0.7}} />
              <div>No tienes inscripciones registradas.</div>
              <div style={{fontSize: '0.95em', color: '#888', marginTop: '8px'}}>¡Haz tu primera inscripción y disfruta la experiencia!</div>
            </div>
          )}

        {/* Lista de inscripciones */}
        {filteredInscripciones.map((inscripcion) => (
        <div className="inscripciones-container-misinscripciones">
          <div className="inscripcion-card-misinscripciones" key={inscripcion.id}>
            <div className="inscripcion-content-misinscripciones">
              {/* Carrusel de imágenes en la tarjeta */}
              <div className="inscripcion-image-gallery">
                <CardImageCarousel images={inscripcion.evento?.imagen} />
              </div>
              <div className="inscripcion-body-misinscripciones">
                <div className="header-misinscripciones">
                  <div className="inscripcion-title-section-misinscripciones">
                    <div className="inscripcion-title-row-misinscripciones">
                      <h3 className="inscripcion-title-misinscripciones">{inscripcion.evento?.nombre || 'Evento'}</h3>
                      <span className={`status-badge-misinscripciones ${inscripcion.estado.toLowerCase()}`}>{inscripcion.estado}</span>
                    </div>
                    {/* Si tienes categoría, puedes mostrarla aquí */}
                    {/* <span className={`categoria-badge ${inscripcion.categoria?.toLowerCase()}`}>{inscripcion.categoria}</span> */}
                  </div>
                  <div className="inscripcion-price-section-misinscripciones">
                    <div className="inscripcion-price-misinscripciones">{inscripcion.evento?.precio || 'Precio no disponible'}</div>
                    <div className="inscripcion-date-misinscripciones">Inscrito: {new Date(inscripcion.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="inscripcion-details-misinscripciones">
                  <div className="detail-row-misinscripciones">
                    <i className="fas fa-calendar"></i>
                    <span>{new Date(inscripcion.evento?.fechaEvento).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row-misinscripciones">
                    <i className="fas fa-clock"></i>
                    <span>Hora Inicio: {inscripcion.evento?.horaInicio || 'Horario no disponible'} - Hora Fin: {inscripcion.evento?.horaFin || 'Horario no disponible'}</span>
                  </div>
                  <div className="detail-row-misinscripciones">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{inscripcion.evento?.lugar || 'Ubicación no disponible'}</span>
                  </div>
                </div>
                <div className="inscripcion-footer-misinscripciones">
                  <div className="status-info-misinscripciones">
                    <i className={`fas status-icon-misinscripciones ${inscripcion.estado.toLowerCase()}`}></i>
                    <span className="status-text-misinscripciones">{inscripcion.estado}</span>
                  </div>
                  <div className="inscripcion-actions-misinscripciones">
                    <button className="btn-outline-misinscripciones" onClick={() => openModal(inscripcion)}>
                      <i className="fas fa-eye"></i>
                      Ver Detalles
                    </button>
                    <button className="btn-danger-misinscripciones">Cancelar</button>
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
                {/* Carrusel de imágenes en el modal */}
                <div className="modal-image-gallery">
                  {Array.isArray(currentInscripcion.evento?.imagen) && currentInscripcion.evento.imagen.length > 0 ? (
                    <ModalImageCarousel images={currentInscripcion.evento.imagen} />
                  ) : (
                    <img
                      src={'https://nupec.com/wp-content/uploads/2022/02/cat-watching-2021-08-26-15-42-24-utc.jpg'}
                      alt="Imagen del evento"
                      className="modal-image-misinscripciones"
                    />
                  )}
                </div>
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

                <h2 id="modalTitle" className="modal-title-misinscripciones">{currentInscripcion.titulo}</h2>

                <div className="modal-details-grid-misinscripciones">
                  <div className="modal-section-misinscripciones">
                    <h3 className="section-title-misinscripciones">Detalles del Evento</h3>
                    <div className="detail-item-misinscripciones">
                      <FontAwesomeIcon icon={faCalendar} className="detail-icon-misinscripciones" />
                      <span id="modalFecha">{currentInscripcion.fecha}</span>
                    </div>
                    <div className="detail-item-misinscripciones">
                      <FontAwesomeIcon icon={faClock} className="detail-icon-misinscripciones" />
                      <span id="modalHorario">{currentInscripcion.horario}</span>
                    </div>
                    <div className="detail-item-misinscripciones">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon-misinscripciones" />
                      <span >{currentInscripcion.ubicacion}</span>
                    </div>
                  </div>

                  <div className="modal-section-misinscripciones">
                    <h3 className="section-title-misinscripciones">Información de Inscripción</h3>
                    <div className="detail-item-misinscripciones">
                      <FontAwesomeIcon icon={faCheckCircle} className="detail-icon-misinscripciones" />
                      <span>Estado: <span id="modalEstadoText">{currentInscripcion.estado}</span></span>
                    </div>
                    <div className="detail-item-misinscripciones">
                      <FontAwesomeIcon icon={faCalendar} className="detail-icon-misinscripciones" />
                      <span>Inscrito: <span id="modalFechaInscripcion">{currentInscripcion.fechaInscripcion}</span></span>
                    </div>
                    <div className="detail-item-misinscripciones">
                      <span className="detail-icon-misinscripciones">💰</span>
                      <span>Precio: <span id="modalPrecioText">{currentInscripcion.precio}</span></span>
                    </div>
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
                      Cancelar Inscripción
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

export default MisInscripciones;

// Carrusel simple para el modal
function ModalImageCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="modal-carousel-wrapper">
      <button className="carousel-arrow left" onClick={prev}>&lt;</button>
      <img
        src={`http://localhost:3000/uploads/eventos/${images[index]}`}
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

// Carrusel para las imágenes en la tarjeta de inscripción
function CardImageCarousel({ images }) {
  const [index, setIndex] = useState(0);
  if (!Array.isArray(images) || images.length === 0) {
    return (
      <img
        src={'https://nupec.com/wp-content/uploads/2022/02/cat-watching-2021-08-26-15-42-24-utc.jpg'}
        alt="Imagen del evento"
        className="inscripcion-image-misinscripciones"
      />
    );
  }
  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="card-carousel-wrapper">
      <button className="carousel-arrow left" onClick={prev}>&lt;</button>
      <img
        src={`http://localhost:3000/uploads/eventos/${images[index]}`}
        alt={`Imagen ${index + 1}`}
        className="inscripcion-image-misinscripciones"
        style={{ maxHeight: '160px', borderRadius: '10px' }}
      />
      <button className="carousel-arrow right" onClick={next}>&gt;</button>
      <div className="carousel-indicator">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
