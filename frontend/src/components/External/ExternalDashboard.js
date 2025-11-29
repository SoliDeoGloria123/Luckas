import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import externalService from '../../services/externalService';
import PaymentModal from '../../components/External/PaymentModal';
import SeminaristaForm from '../../components/External/SeminaristaForm';
import ProfilePanel from '../../components/External/ProfilePanel';
import './ExternalDashboard.css';

const ExternalDashboard = () => {
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
      const userData = localStorage.getItem('usuario') ? 
        JSON.parse(localStorage.getItem('usuario')) : 
        (localStorage.getItem('externalUser') ? 
         JSON.parse(localStorage.getItem('externalUser')) : null);
      
      if (userData) {
        setUser(userData);
      } else {
        navigate('/external/login');
        return;
      }
    };

    const loadData = async () => {
      try {
        setLoading(true);
        
        const [programasResponse, eventosResponse, cabanasResponse, inscripcionesResponse] = await Promise.all([
          externalService.getProgramasAcademicos(),
          externalService.getEventos(),
          externalService.getCabanas(),
          externalService.getMisInscripciones()
        ]);

        setProgramas(programasResponse || []);
        setEventos(eventosResponse.data || eventosResponse || []);
        setCabanas(cabanasResponse || []);
        setInscripciones(inscripcionesResponse.data || inscripcionesResponse || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadData();

    // Cargar preferencia de dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('externalUser');
    localStorage.removeItem('token');
    navigate('/external/login');
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
    // Recargar inscripciones
    loadInscripciones();
  };

  const loadInscripciones = async () => {
    try {
      const response = await externalService.getMisInscripciones();
      setInscripciones(response.data || []);
    } catch (error) {
      console.error('Error loading inscripciones:', error);
    }
  };

  const isInscrito = (itemId, tipo) => {
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
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const renderCard = (item, tipo) => {
    const inscrito = isInscrito(item._id, tipo);
    let badge = '📚 CURSO';
    if (tipo === 'evento') badge = '🎯 EVENTO';
    if (tipo === 'cabana') badge = '🏡 CABAÑA';
    if (tipo === 'programa') badge = '🎓 PROGRAMA';
    return (
      <div key={item._id} className="content-card">
        <div className="card-header">
          <div className="card-badge">{badge}</div>
          <h3>{item.titulo || item.nombre}</h3>
          <div className="card-meta">
            {tipo === 'evento' && item.fechaInicio && (
              <span className="date">
                📅 {new Date(item.fechaInicio).toLocaleDateString()}
              </span>
            )}
            {(item.precio || item.costo) && (
              <span className="price">💰 ${item.precio || item.costo}</span>
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
          <p>{item.descripcion}</p>
          {item.duracion && <p><strong>Duración:</strong> {item.duracion}</p>}
          {item.modalidad && <p><strong>Modalidad:</strong> {item.modalidad}</p>}
          {tipo === 'cabana' && item.ubicacion && (
            <p><strong>Ubicación:</strong> {item.ubicacion}</p>
          )}
        </div>
        <div className="card-footer">
          {inscrito ? (
            <span className="inscrito-badge">✓ Inscrito</span>
          ) : (
            <button
              className="inscribirse-btn"
              onClick={() => handleInscribirse(item, tipo)}
            >
              Inscribirse
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="external-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-text">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`external-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header translúcido con backdrop-blur */}
      <header className="hero-header">
        <button className="hero-logo" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Luckas</button>
        <nav className="hero-nav">
          <a href="#cursos">Cursos</a>
          <a href="#eventos">Eventos</a>
          <a href="#nosotros">Nosotros</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleDarkMode} className="dark-mode-toggle" style={{ 
            background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '6px', 
            padding: '0.5rem', 
            color: '#fff',
            cursor: 'pointer'
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          {user && (
            <div className="user-avatar" onClick={handleAvatarClick} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer' 
            }}>
              {user.fotoPerfil ? (
                <img src={user.fotoPerfil} alt="Perfil" style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }} />
              ) : (
                <div style={{ color: '#fff', fontWeight: 'bold' }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          )}
          <button className="hero-cta" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Sección Hero Premium con diseño asimétrico */}
      <section className="hero-section">
        {/* Contenido principal en esquina inferior izquierda */}
        <div className="hero-content">
          {/* Badge translúcido */}
          <div className="hero-badge">
            ✨ Transformando el futuro educativo
          </div>
          
          {/* Título principal combinando sans-serif y serif */}
          <h1 className="hero-title">
            <span className="sans">Portal</span>{' '}
            <span className="serif">Educativo</span>
          </h1>
          
          {/* Descripción con opacidad reducida */}
          <p className="hero-subtitle">
            Descubre cursos y eventos diseñados para transformar tu futuro académico y 
            profesional con la mejor experiencia de aprendizaje.
          </p>
          
          {/* Dos botones contrastantes */}
          <div className="hero-buttons">
            <button className="hero-btn-outline">Explorar Contenido</button>
            <button className="hero-btn-solid">Comenzar Ahora</button>
          </div>
        </div>

        {/* Círculo pulsante decorativo en esquina inferior derecha */}
        <div className="hero-circle">
          <div className="hero-circle-text">
            <svg viewBox="0 0 200 200">
              <path
                id="circle-path"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill="none"
              />
              <text fontSize="12">
                <textPath href="#circle-path">
                  EDUCACIÓN • INNOVACIÓN • FUTURO • TRANSFORMACIÓN • 
                </textPath>
              </text>
            </svg>
          </div>
          <div className="hero-circle-center">→</div>
        </div>
      </section>

      {/* Sección de Contenido */}
      <section className="content-section">
        <div className="content-container">
          {/* Programas Académicos */}
          <div id="programas" className="section">
            <div className="section-header">
              <h2>Programas Académicos</h2>
              <p>Programas de formación diseñados para desarrollarte profesionalmente</p>
            </div>
            <div className="cards-grid">
              {programas.length > 0 ? (
                programas.map(programa => renderCard(programa, 'programa'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎓</div>
                  <h3>No hay programas académicos disponibles</h3>
                  <p>Pronto tendremos nuevos programas para ti</p>
                </div>
              )}
            </div>
          </div>

          {/* Cabañas Disponibles */}
          <div id="cabanas" className="section">
            <div className="section-header">
              <h2>Cabañas Disponibles</h2>
              <p>Alojamientos para participantes y visitantes</p>
            </div>
            <div className="cards-grid">
              {cabanas.length > 0 ? (
                cabanas.map(cabana => renderCard(cabana, 'cabana'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🏡</div>
                  <h3>No hay cabañas disponibles</h3>
                  <p>Pronto tendremos nuevos alojamientos para ti</p>
                </div>
              )}
            </div>
          </div>

          {/* Eventos y Seminarios */}
          <div id="eventos" className="section">
            <div className="section-header">
              <h2>Eventos y Seminarios</h2>
              <p>Experiencias educativas especializadas y eventos de networking</p>
            </div>
            <div className="cards-grid">
              {eventos.length > 0 ? (
                eventos.map(evento => renderCard(evento, 'evento'))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎯</div>
                  <h3>No hay eventos disponibles</h3>
                  <p>Mantente atento a nuestros próximos eventos</p>
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
          user={user}
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

export default ExternalDashboard;
