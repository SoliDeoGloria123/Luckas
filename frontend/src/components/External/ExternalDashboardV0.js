import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import externalService from '../../services/externalService';
import PaymentModal from '../../components/External/PaymentModal';
import SeminaristaForm from '../../components/External/SeminaristaForm';
import ProfilePanel from '../../components/External/ProfilePanel';
import ShaderBackground from '../../components/External/ShaderBackground';
import PulsingCircle from '../../components/External/PulsingCircle';
import PremiumHeader from '../../components/External/PremiumHeader';
import './ExternalDashboardV0.css';
import { reservaService } from '../../services/reservaService';

const ExternalDashboardV0 = () => {
  const [reservaStatus, setReservaStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSeminaristaForm, setShowSeminaristaForm] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      let userData = null;
      try {
        userData = localStorage.getItem('usuario') ? 
          JSON.parse(localStorage.getItem('usuario')) : 
          (localStorage.getItem('externalUser') ? 
           JSON.parse(localStorage.getItem('externalUser')) : null);
      } catch (e) {
        userData = null;
      }
      if (userData && userData._id) {
        setUser(userData);
        return userData;
      } else {
        navigate('/external/login');
        return null;
      }
    };

    const loadData = async (userData) => {
      try {
        setLoading(true);
        const [programasResponse, eventosResponse, cabanasResponse, inscripcionesResponse] = await Promise.all([
          externalService.getProgramasAcademicos(),
          externalService.getEventos(),
          externalService.getCabanas(),
          userData && userData._id ? externalService.getMisInscripciones(userData._id) : Promise.resolve({ success: true, data: [] })
        ]);
        const programasData = Array.isArray(programasResponse) ? programasResponse : (programasResponse.data || []);
        const eventosData = Array.isArray(eventosResponse) ? eventosResponse : (eventosResponse.data || []);
        const cabanasData = Array.isArray(cabanasResponse) ? cabanasResponse : (cabanasResponse.data || []);
        setProgramas(programasData);
        setEventos(eventosData);
        setCabanas(cabanasData);
        setInscripciones(inscripcionesResponse.data || inscripcionesResponse || []);
      } catch (error) {
        setProgramas([]);
        setEventos([]);
        setCabanas([]);
        setInscripciones([]);
      } finally {
        setLoading(false);
      }
    };

    const userData = loadUserData();
    if (userData) {
      loadData(userData);
    }

    // Cargar preferencia de dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [navigate]);

  useEffect(() => {
    console.log('🌓 Aplicando dark mode:', darkMode);
    const dashboard = document.querySelector('.external-dashboard-v0');
    if (dashboard) {
      if (darkMode) {
        dashboard.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      } else {
        dashboard.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
      }
      console.log('✅ Dark mode aplicado al dashboard');
    } else {
      console.log('❌ No se encontró el dashboard');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('externalUser');
    localStorage.removeItem('token');
    navigate('/external/login');
  };

  const handleReservarCabana = async (cabana) => {
    setReservaStatus(null);
    try {
      const reserva = {
        cabana: cabana._id,
        usuario: user?._id,
        fechaInicio: new Date(), // Por ahora, reserva inmediata
        fechaFin: new Date(Date.now() + 86400000), // 1 día después
      };
      const response = await reservaService.create(reserva);
      if (response.success) {
        setReservaStatus('Reserva realizada con éxito');
      } else {
        setReservaStatus('No se pudo realizar la reserva');
      }
    } catch (error) {
      setReservaStatus('Error al reservar la cabaña');
    }
  };

  const handleInscribirse = (item, tipo) => {
    setSelectedItem({ ...item, tipo });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSeminaristaForm(true);
  };

  const handleSeminaristaSuccess = () => {
    setShowSeminaristaForm(false);
    loadInscripciones();
  };

  const loadInscripciones = async () => {
    try {
      const response = await externalService.getMisInscripciones();
      setInscripciones(response.data || []);
    } catch (error) {
      console.error('Error loading inscripciones:', error);
      setInscripciones([]);
    }
  };

  const isInscrito = (itemId, tipo) => {
    if (!inscripciones || inscripciones.length === 0) {
      return false;
    }
    return inscripciones.some(inscripcion => 
      (tipo === 'programa' && inscripcion.programaAcademicoId === itemId) ||
      (tipo === 'curso' && inscripcion.cursoId === itemId) ||
      (tipo === 'evento' && inscripcion.eventoId === itemId)
    );
  };

  const handleAvatarClick = () => {
    setShowProfilePanel(true);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    console.log('🌓 Cambiando dark mode a:', newMode);
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const renderCard = (item, tipo) => {
    const inscrito = isInscrito(item._id, tipo);
    let badge = '📚 CURSO';
    if (tipo === 'evento') badge = '🎯 EVENTO';
    if (tipo === 'cabana') badge = '🏡 CABAÑA';
    if (tipo === 'programa') badge = '🎓 PROGRAMA';
    return (
      <div key={item._id} className="premium-card">
        <div className="card-glow"></div>
        <div className="card-content">
          <div className="card-header">
            <div className="card-badge">{badge}</div>
            <h3 className="card-title">{item.titulo || item.nombre}</h3>
            <div className="card-meta">
              {tipo === 'evento' && item.fechaInicio && (
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  {new Date(item.fechaInicio).toLocaleDateString()}
                </span>
              )}
              {(item.precio || item.costo) && (
                <span className="meta-item price">
                  <span className="meta-icon">💰</span>
                  ${item.precio || item.costo}
                </span>
              )}
              {tipo === 'cabana' && item.capacidad && (
                <span className="meta-item">
                  <span className="meta-icon">👥</span>
                  {item.capacidad} personas
                </span>
              )}
            </div>
          </div>
          <div className="card-body">
            <p className="card-description">{item.descripcion}</p>
            {item.duracion && (
              <div className="card-detail">
                <span className="detail-label">Duración:</span>
                <span className="detail-value">
                  {typeof item.duracion === 'object' ? 
                    `${item.duracion.horas} horas (${item.duracion.semanas} semanas)` : 
                    item.duracion
                  }
                </span>
              </div>
            )}
            {item.modalidad && (
              <div className="card-detail">
                <span className="detail-label">Modalidad:</span>
                <span className="detail-value">{item.modalidad}</span>
              </div>
            )}
            {tipo === 'cabana' && item.ubicacion && (
              <div className="card-detail">
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">{item.ubicacion}</span>
              </div>
            )}
          </div>
          <div className="card-footer">
            {tipo === 'cabana' ? (
              <button
                className="premium-button"
                onClick={() => handleReservarCabana(item)}
              >
                <span className="button-gradient"></span>
                <span className="button-content">
                  <span className="button-text">Reservar</span>
                  <span className="button-arrow">→</span>
                </span>
              </button>
            ) : inscrito ? (
              <div className="status-badge inscrito">
                <span className="status-icon">✓</span>
                Inscrito
              </div>
            ) : (
              <button
                className="premium-button"
                onClick={() => handleInscribirse(item, tipo)}
              >
                <span className="button-gradient"></span>
                <span className="button-content">
                  <span className="button-text">Inscribirse</span>
                  <span className="button-arrow">→</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="external-dashboard-v0">
        <ShaderBackground />
        <div className="loading-container">
          <div className="premium-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Cargando experiencia premium...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`external-dashboard-v0 ${darkMode ? 'dark-mode' : ''}`}>
      {/* Fondo con Shaders Animados */}
      <ShaderBackground />
      
      {/* Header Premium */}
      <PremiumHeader
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onAvatarClick={handleAvatarClick}
        onLogout={handleLogout}
      />

      {/* Mensaje de estado de reserva */}
      {reservaStatus && (
        <div className="reserva-status-notification">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            {reservaStatus}
            <button 
              className="notification-close"
              onClick={() => setReservaStatus(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            {/* Badge Premium */}
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              Transformando el futuro educativo
            </div>
            
            {/* Título con tipografías combinadas */}
            <h1 className="hero-title">
              <span className="title-sans">Portal</span>{' '}
              <span className="title-serif">Educativo</span>
            </h1>
            
            {/* Subtítulo */}
            <p className="hero-subtitle">
              Descubre cursos y eventos diseñados para transformar tu futuro académico y 
              profesional con la mejor experiencia de aprendizaje del país.
            </p>
            
            {/* Botones de Acción */}
            <div className="hero-actions">
              <button className="hero-button hero-button-outline">
                <span className="button-content">
                  <span className="button-text">Explorar Contenido</span>
                  <span className="button-icon">📚</span>
                </span>
              </button>
              <button className="hero-button hero-button-solid">
                <span className="button-gradient"></span>
                <span className="button-content">
                  <span className="button-text">Comenzar Ahora</span>
                  <span className="button-icon">🚀</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Círculo Pulsante Decorativo */}
        <PulsingCircle 
          position="bottom-right"
          text="EDUCACIÓN • INNOVACIÓN • FUTURO • TRANSFORMACIÓN • "
          centerIcon="→"
        />
      </section>

      {/* Sección de Contenido */}
      <section className="content-section">
        <div className="content-container">
          {/* Programas Académicos */}
          <div id="programas" className="content-section-block">
            <div className="section-header">
              <div className="section-badge">
                <span className="badge-icon">🎓</span>
                Programas Académicos
              </div>
              <h2 className="section-title">Programas Académicos</h2>
              <p className="section-subtitle">
                Programas de formación diseñados para desarrollarte profesionalmente
              </p>
            </div>
            <div className="cards-container">
              {programas.length > 0 ? (
                programas.map(programa => renderCard(programa, 'programa'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎓</div>
                  <h3 className="empty-title">No hay programas académicos disponibles</h3>
                  <p className="empty-subtitle">Pronto tendremos nuevos programas para ti</p>
                </div>
              )}
            </div>
          </div>
          {/* Eventos */}
          <div id="eventos" className="content-section-block">
            <div className="section-header">
              <div className="section-badge">
                <span className="badge-icon">🎯</span>
                Experiencias Únicas
              </div>
              <h2 className="section-title">Eventos y Seminarios</h2>
              <p className="section-subtitle">
                Experiencias educativas especializadas y eventos de networking
              </p>
            </div>
            <div className="cards-container">
              {eventos.length > 0 ? (
                eventos.map(evento => renderCard(evento, 'evento'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <h3 className="empty-title">No hay eventos disponibles</h3>
                  <p className="empty-subtitle">Mantente atento a nuestros próximos eventos</p>
                </div>
              )}
            </div>
          </div>
          {/* Cabañas */}
          <div id="cabanas" className="content-section-block">
            <div className="section-header">
              <div className="section-badge">
                <span className="badge-icon">🏡</span>
                Alojamientos Premium
              </div>
              <h2 className="section-title">Cabañas Disponibles</h2>
              <p className="section-subtitle">
                Hospedaje para vacacionar y retiros espirituales
              </p>
            </div>
            <div className="cards-container">
              {cabanas.length > 0 ? (
                cabanas.map(cabana => renderCard(cabana, 'cabana'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🏡</div>
                  <h3 className="empty-title">No hay cabañas disponibles</h3>
                  <p className="empty-subtitle">Pronto tendremos nuevos alojamientos para ti</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modales */}
      {showPaymentModal && selectedItem && (
        <PaymentModal
          item={selectedItem}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showSeminaristaForm && selectedItem && (
        <SeminaristaForm
          item={selectedItem}
          onClose={() => setShowSeminaristaForm(false)}
          onSuccess={handleSeminaristaSuccess}
        />
      )}

      {showProfilePanel && (
        <ProfilePanel
          isOpen={showProfilePanel}
          currentUser={user}
          onClose={() => setShowProfilePanel(false)}
          onUserUpdate={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('usuario', JSON.stringify(updatedUser));
          }}
        />
      )}
    </div>
  );
};

export default ExternalDashboardV0;
