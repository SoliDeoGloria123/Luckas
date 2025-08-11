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

  // Datos de ejemplo (simulando API)
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        titulo: "Retiro Espiritual en Montaña",
        imagen: "https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97?fm=webp&w=612",
        fecha: "2023-11-15",
        horario: "8:00 AM - 5:00 PM",
        ubicacion: "Centro de Retiros La Paz, Antioquia",
        estado: "Confirmada",
        fechaInscripcion: "2023-10-10",
        precio: "$120,000 COP"
      },
      {
        id: 2,
        titulo: "Taller de Meditación",
        imagen: "/placeholder.svg",
        fecha: "2023-12-05",
        horario: "9:00 AM - 12:00 PM",
        ubicacion: "Centro Cultural de la Ciudad",
        estado: "Pendiente",
        fechaInscripcion: "2023-11-20",
        precio: "$80,000 COP"
      },
      {
        id: 3,
        titulo: "Conferencia de Mindfulness",
        imagen: "/placeholder.svg",
        fecha: "2023-10-28",
        horario: "3:00 PM - 6:00 PM",
        ubicacion: "Auditorio Principal",
        estado: "Cancelada",
        fechaInscripcion: "2023-09-15",
        precio: "$50,000 COP"
      }
    ];

    setInscripciones(mockData);
    updateStats(mockData);
  }, []);

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
          <h1 className="page-title-seminario-inscripciones">Mis Reservas</h1>
          <p className="page-subtitle">Gestiona y revisa el estado de tus reservas de cabañas</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon confirmed">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="confirmadasCount">0</div>
              <div className="stat-label">Confirmadas</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="pendientesCount">0</div>
              <div className="stat-label">Pendientes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cancelled">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="canceladasCount">0</div>
              <div className="stat-label">Canceladas</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="stat-content">
              <div className="stat-number" id="totalCount">0</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-card">
          <div className="filters-content">
            <span className="filter-label">Filtrar por estado:</span>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === 'Todas' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Todas')}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${activeFilter === 'Confirmada' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Confirmada')}
              >
                Confirmada
              </button>
              <button
                className={`filter-btn ${activeFilter === 'Pendiente' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Pendiente')}
              >
                Pendiente
              </button>
              <button
                className={`filter-btn ${activeFilter === 'Cancelada' ? 'active' : ''}`}
                onClick={() => filterInscripciones('Cancelada')}
              >
                Cancelada
              </button>
            </div>
          </div>
        </div>

        {/* Lista de inscripciones */}
        {filteredInscripciones.map((inscripcion) => (
        <div class="inscripciones-container-seminario-inscripciones">
          <div className="inscripcion-card-semianrio-inscripciones" key={inscripcion.id}>
            <div className="inscripcion-content-seminario-inscripciones">
              <img src="https://nupec.com/wp-content/uploads/2022/02/cat-watching-2021-08-26-15-42-24-utc.jpg"  class="inscripcion-image"></img>
              <div className="inscripcion-body-seminario-inscripciones">
                <div className="header-seminario-inscripciones">
                  <div className="inscripcion-title-section-seminario-inscripciones">
                    <div className="inscripcion-title-row-seminario-inscripciones">
                      <h3 className="inscripcion-title">{inscripcion.titulo}</h3>
                      <span className={`status-badge ${inscripcion.estado.toLowerCase()}`}>{inscripcion.estado}</span>
                    </div>
                    {/* Si tienes categoría, puedes mostrarla aquí */}
                    {/* <span className={`categoria-badge ${inscripcion.categoria?.toLowerCase()}`}>{inscripcion.categoria}</span> */}
                  </div>
                  <div className="inscripcion-price-section">
                    <div className="inscripcion-price">{inscripcion.precio}</div>
                    <div className="inscripcion-date">Inscrito: {inscripcion.fechaInscripcion}</div>
                  </div>
                </div>
                <div className="inscripcion-details">
                  <div className="detail-row">
                    <i className="fas fa-calendar"></i>
                    <span>{inscripcion.fecha}</span>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-clock"></i>
                    <span>{inscripcion.horario}</span>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{inscripcion.ubicacion}</span>
                  </div>
                </div>
                <div className="inscripcion-footer">
                  <div className="status-info">
                    <i className={`fas status-icon ${inscripcion.estado.toLowerCase()}`}></i>
                    <span className="status-text">{inscripcion.estado}</span>
                  </div>
                  <div className="inscripcion-actions">
                    <button className="btn-outline" onClick={() => openModal(inscripcion)}>
                      <i className="fas fa-eye"></i>
                      Ver Detalles
                    </button>
                    <button className="btn-danger">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}
        {/* Modal de Detalles */}
        {isModalOpen && currentInscripcion && (
          <div className="" id="modalOverlay" onClick={closeModal}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <img
                  id="modalImage"
                  src={currentInscripcion.imagen}
                  alt=""
                  className="modal-image"
                />
                <button className="modal-close" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-status-price">
                  <span id="modalStatus" className={`status-badge ${currentInscripcion.estado.toLowerCase()}`}>
                    {currentInscripcion.estado}
                  </span>
                  <span id="modalPrice" className="modal-price">
                    {currentInscripcion.precio}
                  </span>
                </div>

                <h2 id="modalTitle" className="modal-title">{currentInscripcion.titulo}</h2>

                <div className="modal-details-grid">
                  <div className="modal-section">
                    <h3 className="section-title">Detalles del Evento</h3>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                      <span id="modalFecha">{currentInscripcion.fecha}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faClock} className="detail-icon" />
                      <span id="modalHorario">{currentInscripcion.horario}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                      <span id="modalUbicacion">{currentInscripcion.ubicacion}</span>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="section-title">Información de Inscripción</h3>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faCheckCircle} className="detail-icon" />
                      <span>Estado: <span id="modalEstadoText">{currentInscripcion.estado}</span></span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                      <span>Inscrito: <span id="modalFechaInscripcion">{currentInscripcion.fechaInscripcion}</span></span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span>Precio: <span id="modalPrecioText">{currentInscripcion.precio}</span></span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cerrar</button>
                  {currentInscripcion.estado === 'Confirmada' && (
                    <button
                      id="cancelarBtn"
                      className="btn-danger"
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
