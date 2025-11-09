import React, { useState, useEffect } from 'react';
import {  FaFileAlt,  FaTimes, FaCheckCircle, FaClock, FaExclamationCircle, FaHashtag, FaCalendar, FaUser as FaUserIcon, FaComment, FaEye, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import './MisSolicitudes.css'; // Asegúrate de tener un archivo CSS para los estilos
import Header from '../Shared/Header'
import Footer from '../../footer/Footer';
import {solicitudService} from '../../../services/solicirudService';
// Datos de ejemplo para las solicitudes
const requestsData = [
  {
    id: 'SOL-2025-001',
    title: 'Permiso de Salida',
    description: 'Solicitud de permiso para visitar a la familia durante el fin de semana',
    status: 'aprobada',
    priority: 'normal',
    category: 'permisos',
    dateSubmitted: '2025-02-28',
    dateResponded: '2025-03-02',
    responsible: 'Padre Director',
    comments: 'Aprobado para el fin de semana del 15-17 de marzo'
  },
  // ... (resto de los datos de ejemplo)
];

const MisSolicitudes = () => {
  const [currentRequests, setCurrentRequests] = useState([]);
  const [currentStatusFilter, setCurrentStatusFilter] = useState('all');
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [toasts, setToasts] = useState([]);

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
    if(!userId) return;
    solicitudService.getSolicitudesPorUsuario(userId)
      .then(data => {
        const solicitudData = Array.isArray(data.data) ? data.data : [];
        setCurrentRequests(solicitudData);

      })
      .catch(error => {
        console.error("Error al obtener solicitudes:", error);
      });

  }, [userId]);

  useEffect(() => {
    filterRequests();
  }, [currentStatusFilter, currentCategoryFilter, currentRequests]);
  const handleStatusFilter = (status) => {
    setCurrentStatusFilter(status);
  };

  const handleCategoryFilter = (category) => {
    setCurrentCategoryFilter(category);
  };

  const filterRequests = () => {
    // Filtrar sobre currentRequests (que ahora viene del backend)
    const filtered = currentRequests.filter(request => {
      const statusMatch = currentStatusFilter === 'all' || request.estado === currentStatusFilter;
      const categoryMatch = currentCategoryFilter === 'all' || (request.categoria && request.categoria.nombre === currentCategoryFilter);
      return statusMatch && categoryMatch;
    });
    setCurrentRequests(filtered);
  };

  const showRequestDetails = (requestId) => {
    const request = requestsData.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowRequestModal(true);
    }
  };

  const showCancelConfirmation = (requestId) => {
    setShowRequestModal(false);
    setSelectedRequest(requestsData.find(r => r.id === requestId));
    setShowConfirmModal(true);
  };

  const cancelRequest = (requestId) => {
    const requestIndex = requestsData.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      requestsData[requestIndex].status = 'rechazada';
      requestsData[requestIndex].dateResponded = new Date().toISOString().split('T')[0];
      requestsData[requestIndex].comments = 'Cancelada por el usuario';
      
      filterRequests();
      setShowConfirmModal(false);
      showToast('Solicitud cancelada', 'La solicitud ha sido cancelada exitosamente.', 'success');
    }
  };

  const showToast = (title, message, type = 'info') => {
    const newToast = {
      id: Date.now(),
      title,
      message,
      type
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Funciones de utilidad
  const getStatusText = (status) => {
    const statusMap = {
      'aprobada': 'Aprobada',
      'revision': 'En Revisión',
      'pendiente': 'Pendiente',
      'rechazada': 'Rechazada'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'aprobada': <FaCheckCircle style={{ color: '#16a34a' }} />,
      'revision': <FaClock style={{ color: '#7c3aed' }} />,
      'pendiente': <FaExclamationCircle style={{ color: '#f59e0b' }} />,
      'rechazada': <FaTimes style={{ color: '#dc2626' }} />
    };
    return iconMap[status] || null;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'alta': 'Alta',
      'normal': 'Normal',
      'baja': 'Baja'
    };
    return priorityMap[priority] || priority;
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'permisos': 'Permisos',
      'academico': 'Académico',
      'recursos': 'Recursos',
      'eventos': 'Eventos',
      'bienestar': 'Bienestar'
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pendiente';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Estadísticas
  const stats = {
    approved: currentRequests.filter(r => r.status === 'aprobada').length,
    review: currentRequests.filter(r => r.status === 'revision').length,
    pending: currentRequests.filter(r => r.status === 'pendiente').length,
    total: currentRequests.length
  };

  return (
    <div className="app">
      {/* Header */}
      <Header/>
      {/* Main Content */}
      <main className="main-content-misolicitudes">
        <div className="container-misolicitudes">
          {/* Page Header */}
          <div className="page-header-misolicitudes">
            <h1 className="page-title-misolicitudes">Mis Solicitudes</h1>
            <p className="page-subtitle-misolicitudes">Gestiona y revisa el estado de todas tus solicitudes</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid-misolicitudes">
            <div className="stat-card-misolicitudes approved">
              <div className="stat-icon-misolicitudes">
                <FaCheckCircle />   
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.approved}</div>
                <div className="stat-label">Aprobadas</div>
              </div>
            </div>

            <div className="stat-card-misolicitudes review">
              <div className="stat-icon-misolicitudes">
                <FaClock />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.review}</div>
                <div className="stat-label">En Revisión</div>
              </div>
            </div>

            <div className="stat-card-misolicitudes pending">
              <div className="stat-icon-misolicitudes">
                <FaExclamationCircle />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pendientes</div>
              </div>
            </div>

            <div className="stat-card-misolicitudes total">
              <div className="stat-icon-misolicitudes">
                <FaFileAlt />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor='estado' className="filter-label">Estado:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${currentStatusFilter === 'all' ? 'active' : ''}`} 
                  onClick={() => handleStatusFilter('all')}
                >
                  Todas
                </button>
                <button 
                  className={`filter-btn ${currentStatusFilter === 'pendiente' ? 'active' : ''}`} 
                  onClick={() => handleStatusFilter('pendiente')}
                >
                  Pendiente
                </button>
                <button 
                  className={`filter-btn ${currentStatusFilter === 'revision' ? 'active' : ''}`} 
                  onClick={() => handleStatusFilter('revision')}
                >
                  En Revisión
                </button>
                <button 
                  className={`filter-btn ${currentStatusFilter === 'aprobada' ? 'active' : ''}`} 
                  onClick={() => handleStatusFilter('aprobada')}
                >
                  Aprobada
                </button>
                <button 
                  className={`filter-btn ${currentStatusFilter === 'rechazada' ? 'active' : ''}`} 
                  onClick={() => handleStatusFilter('rechazada')}
                >
                  Rechazada
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor='categoria' className="filter-label">Categoría:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'all' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('all')}
                >
                  Todos
                </button>
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'permisos' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('permisos')}
                >
                  Permisos
                </button>
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'academico' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('academico')}
                >
                  Académico
                </button>
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'recursos' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('recursos')}
                >
                  Recursos
                </button>
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'eventos' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('eventos')}
                >
                  Eventos
                </button>
                <button 
                  className={`filter-btn ${currentCategoryFilter === 'bienestar' ? 'active' : ''}`} 
                  onClick={() => handleCategoryFilter('bienestar')}
                >
                  Bienestar
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="requests-list">
            {currentRequests.length === 0 ? (
              <div className="empty-state">
                <FaFileAlt />
                <h3>No se encontraron solicitudes</h3>
                <p>No hay solicitudes que coincidan con los filtros seleccionados.</p>
              </div>
            ) : (
              currentRequests.map(request => (
                <div className="request-card" key={request.id} data-id={request.id}>
                  <div className="request-header">
                    <div className="request-title-section">
                      <h3 className="request-title">
                        {/*request.title*/}
                        {getStatusIcon(request.estado)}
                      </h3>
                      <p className="request-description">{request.descripcion}</p>
                    </div>
                  </div>

                  <div className="request-badges">
                    <span className={`status-badge ${request.estado}`}>
                      {getStatusText(request.estado)}
                    </span>
                    <span className={`priority-badge ${request.prioridad}`}>
                      {getPriorityText(request.prioridad)}
                    </span>
                  </div>

                  <div className="request-meta">
                    <div className="meta-item">
                      <FaHashtag />
                      <span>{request.id}</span>
                    </div>
                    <div className="meta-item">
                      <FaCalendar />
                      <span>Enviada: {formatDate(request.dateSubmitted)}</span>
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      <span>Respondida: {request.dateResponded ? formatDate(request.dateResponded) : 'Pendiente'}</span>
                    </div>
                    <div className="meta-item">
                      <FaUserIcon />
                      <span>Responsable: {request.responsible}</span>
                    </div>
                  </div>

                  {request.comments && (
                    <div className="request-comments">
                      <div className="comments-title">
                        <FaComment />
                        Comentarios:
                      </div>
                      <div className="comments-text">{request.comments}</div>
                    </div>
                  )}

                  <div className="request-actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => showRequestDetails(request.id)}
                    >
                      <FaEye />
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="modal-overlay-misolicitudes show-misolicitudes">
          <div className="modal-content-misolicitudes">
            <div className="modal-header-misolicitudes">
              <h2 className="modal-title-misolicitudes">Detalles de: {selectedRequest.title}</h2>
              <button className="modal-close-misolicitudes" onClick={() => setShowRequestModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body-misolicitudes">
              <div className="request-details">
                <div className="detail-section">
                  <h4>Información General</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label htmlFor='id'>ID de Solicitud:</label>
                      <span>{selectedRequest.id}</span>
                    </div>
                    <div className="detail-item">
                      <label htmlFor='estado'>Estado:</label>
                      <span className={`status-badge ${selectedRequest.status}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label htmlFor='prioridad'>Prioridad:</label>
                      <span className={`priority-badge ${selectedRequest.priority}`}>
                        {getPriorityText(selectedRequest.priority)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label htmlFor='categoria'>Categoría:</label>
                      <span>{getCategoryText(selectedRequest.category)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Descripción</h4>
                  <p>{selectedRequest.description}</p>
                </div>

                <div className="detail-section">
                  <h4>Fechas</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label htmlFor='fechaEnvio'>Fecha de Envío:</label>
                      <span>{formatDate(selectedRequest.dateSubmitted)}</span>
                    </div>
                    <div className="detail-item">
                      <label htmlFor='fechaRespuesta'>Fecha de Respuesta:</label>
                      <span>{selectedRequest.dateResponded ? formatDate(selectedRequest.dateResponded) : 'Pendiente'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Responsable</h4>
                  <p>{selectedRequest.responsible}</p>
                </div>

                {selectedRequest.comments && (
                  <div className="detail-section">
                    <h4>Comentarios</h4>
                    <div className="comments-box">
                      {selectedRequest.comments}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer-misolicitudes">
              <button 
                className="btn-misolicitudes btn-secondary-misolicitudes" 
                onClick={() => setShowRequestModal(false)}
              >
                Cerrar
              </button>
              {(selectedRequest.status === 'pendiente' || selectedRequest.status === 'revision') && (
                <button 
                  className="btn-misolicitudes btn-danger-misolicitudes" 
                  onClick={() => showCancelConfirmation(selectedRequest.id)}
                >
                  Cancelar Solicitud
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRequest && (
        <div className="modal-overlay-misolicitudes show-misolicitudes">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Cancelación</h2>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowRequestModal(true);
                }}
              >
                No, mantener
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => cancelRequest(selectedRequest.id)}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <FaCheckCircle />}
              {toast.type === 'error' && <FaExclamationCircle />}
              {toast.type === 'warning' && <FaExclamationTriangle />}
              {toast.type === 'info' && <FaInfoCircle />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default MisSolicitudes;