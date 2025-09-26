import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './CursosSeminario.css'; // Estilos específicos para cursos
import './CabanasSeminario.css'; // Estilos base reutilizados
import Header from '../Shared/Header';
import Footer from '../../footer/Footer';
import { Heart, Star, BookOpen, Calendar, Users, Clock } from 'lucide-react';
import { cursosService } from '../../../services/cursosService';

const CursosSeminario = () => {
  const { user } = useAuthCheck('seminarista');
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [favorites, setFavorites] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [inscripcionLoading, setInscripcionLoading] = useState(false);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        // Obtener cursos y programas técnicos reales de la base de datos
        const response = await cursosService.obtenerCursosNavegables();
        if (response.success) {
          setCursos(response.data);
        } else {
          setError('No se pudieron cargar los cursos.');
        }
        setError(null);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setError('No se pudieron cargar los cursos.');
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        // Obtener cursos y programas técnicos reales de la base de datos
        const response = await cursosService.obtenerCursosNavegables();
        if (response.success) {
          setCursos(response.data);
        } else {
          setError('No se pudieron cargar los cursos.');
        }
        setError(null);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setError('No se pudieron cargar los cursos.');
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const toggleFavorite = (cursoId) => {
    setFavorites(prev => ({
      ...prev,
      [cursoId]: !prev[cursoId]
    }));
    showNotification('Curso agregado a favoritos');
  };

  const inscribirseEnCurso = async (cursoId) => {
    setInscripcionLoading(true);
    try {
      // Aquí se conectará con el servicio de inscripción
      // await inscripcionService.inscribirCurso(cursoId);
      const curso = cursos.find(c => c.id === cursoId);
      showNotification(`Te has inscrito exitosamente en ${curso?.nombre || 'el curso'}`);
    } catch (error) {
      console.error('Error al inscribirse:', error);
      showNotification('Error al inscribirse en el curso');
    } finally {
      setInscripcionLoading(false);
    }
  };

  const verDetalles = (curso) => {
    setCursoSeleccionado(curso);
  };

  const filterCursos = (categoria) => {
    setActiveFilter(categoria);
  };

  const cursosFiltrados = activeFilter === 'todos' 
    ? cursos 
    : cursos.filter(curso => curso.categoria === activeFilter);

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'Básico': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModalidadIcon = (modalidad) => {
    switch (modalidad) {
      case 'Presencial': return '🏫';
      case 'Virtual': return '💻';
      case 'Híbrido': return '🔄';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <>
        <Header user={user} breadcrumbPath={[{ name: 'Cursos', path: '/dashboard/seminarista/cursos' }]} />
        <div className="seminario-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando cursos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header user={user} breadcrumbPath={[{ name: 'Cursos', path: '/dashboard/seminarista/cursos' }]} />
        <div className="seminario-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="cabanas-seminario">
      <Header user={user} breadcrumbPath={[{ name: 'Cursos', path: '/dashboard/seminarista/cursos' }]} />
      
      <main className="main-content">
        {/* Notification */}
        {notification.show && (
          <div className="notification-banner">
            <p>{notification.message}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h1>Cursos Académicos</h1>
            <p>Descubre y participa en los cursos de formación académica y espiritual</p>
          </div>
          <div className="page-stats-seminario">
            <div className="stat-item-seminario">
              <span className="stat-number-seminario">{cursos.length}</span>
              <span className="stat-label-seminario">Cursos Totales</span>
            </div>
            <div className="stat-item-seminario">
              <span className="stat-number-seminario">{cursos.filter(c => c.categoria === 'biblico').length}</span>
              <span className="stat-label-seminario">Bíblico</span>
            </div>
            <div className="stat-item-seminario">
              <span className="stat-number-seminario">{cursos.filter(c => c.categoria === 'ministerial').length}</span>
              <span className="stat-label-seminario">Ministerial</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section-seminario">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Buscar cursos..." id="searchInput" />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
              onClick={() => filterCursos('todos')}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${activeFilter === 'biblico' ? 'active' : ''}`}
              onClick={() => filterCursos('biblico')}
            >
              Bíblico
            </button>
            <button
              className={`filter-btn ${activeFilter === 'ministerial' ? 'active' : ''}`}
              onClick={() => filterCursos('ministerial')}
            >
              Ministerial
            </button>
            <button
              className={`filter-btn ${activeFilter === 'liderazgo' ? 'active' : ''}`}
              onClick={() => filterCursos('liderazgo')}
            >
              Liderazgo
            </button>
            <button
              className={`filter-btn ${activeFilter === 'pastoral' ? 'active' : ''}`}
              onClick={() => filterCursos('pastoral')}
            >
              Pastoral
            </button>
            <button
              className={`filter-btn ${activeFilter === 'tecnologia' ? 'active' : ''}`}
              onClick={() => filterCursos('tecnologia')}
            >
              Tecnología
            </button>
            <button
              className={`filter-btn ${activeFilter === 'administracion' ? 'active' : ''}`}
              onClick={() => filterCursos('administracion')}
            >
              Administración
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="cabins-grid">
          {cursosFiltrados.map((curso) => (
            <div key={curso.id} className="cabin-card">
              <div className="cabin-image">
                <img
                  src={curso.imagen || '/api/placeholder/300/200'}
                  alt={curso.nombre}
                />
                <div className={`cabin-status ${curso.estado === 'activo' ? 'available' : 'reserved'}`}>
                  {curso.estado === 'activo' ? 'Disponible' : 'No Disponible'}
                </div>
                <div
                  className={`cabin-favorite ${favorites[curso.id] ? 'active' : ''}`}
                  onClick={() => toggleFavorite(curso.id)}
                >
                  <Heart />
                </div>
                <div className="cabin-gallery">
                  <span className="gallery-count">
                    {curso.tipo === 'curso' ? '📚 Curso' : '🎓 Programa'}
                  </span>
                </div>
              </div>
              
              <div className="cabin-content">
                <div className="cabin-header">
                  <div className="cabin-category">
                    {curso.categoria}
                  </div>
                  <div className="cabin-rating">
                    <Star size={15} />
                    <span>4.5</span>
                  </div>
                </div>

                <h3 className="cabin-title-cabana">{curso.nombre}</h3>
                <p className="cabin-description">
                  {curso.descripcion && curso.descripcion.length > 80 
                    ? curso.descripcion.substring(0, 80) + '...' 
                    : curso.descripcion || 'Sin descripción'
                  }
                </p>

                <div className="cabin-features">
                  <div className="feature-item">
                    <BookOpen size={16} />
                    <span>{curso.nivel}</span>
                  </div>
                  <div className="feature-item">
                    <Users size={16} />
                    <span>{curso.cupos?.disponibles || curso.cupos?.total || 'N/A'} cupos</span>
                  </div>
                  <div className="feature-item">
                    <Clock size={16} />
                    <span>
                      {curso.tipo === 'curso' 
                        ? `${curso.duracion?.semanas || curso.duracion?.horas || 'N/A'} ${curso.duracion?.semanas ? 'sem' : 'hrs'}` 
                        : `${curso.duracion?.meses || 'N/A'} meses`
                      }
                    </span>
                  </div>
                  <div className="feature-item">
                    <Calendar size={16} />
                    <span>{curso.modalidad}</span>
                  </div>
                </div>

                <div className="cabin-amenities">
                  <div className="amenity-tag">
                    👨‍🏫 {curso.instructor}
                  </div>
                  {curso.fechaInicio && (
                    <div className="amenity-tag">
                      📅 {new Date(curso.fechaInicio).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="cabin-footer">
                  <div className="cabin-price">
                    <span className="price">
                      ${curso.precio || 'Gratis'}
                    </span>
                    {curso.precio && <span className="price-period">/ curso</span>}
                  </div>
                  <div className="cabin-availability">
                    <span className={`availability-text ${(curso.cupos?.disponibles || 0) === 0 ? 'reserved' : ''}`}>
                      {(curso.cupos?.disponibles || curso.cupos?.total || 0) > 0 ? 'Disponible' : 'Lleno'}
                    </span>
                  </div>
                </div>

                <div className="cabin-actions">
                  <button 
                    className="cabin-btn secondary" 
                    onClick={() => verDetalles(curso)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ver Detalles
                  </button>
                  <button 
                    className="cabin-btn primary"
                    onClick={() => inscribirseEnCurso(curso.id)}
                    disabled={inscripcionLoading || (curso.cupos?.disponibles || 0) === 0}
                  >
                    {inscripcionLoading ? 'Inscribiendo...' : 
                     (curso.cupos?.disponibles || 0) === 0 ? 'Lleno' : 'Inscribirse'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cursosFiltrados.length === 0 && (
          <div className="no-results">
            <BookOpen size={64} />
            <h3>No hay cursos disponibles</h3>
            <p>No se encontraron cursos para la categoría seleccionada.</p>
          </div>
        )}

      {/* Modal de Detalles del Curso */}
      {cursoSeleccionado && (
        <div className="modal-overlay" onClick={() => setCursoSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>{cursoSeleccionado.nombre}</h2>
                <div className="modal-badges">
                  <span className="modal-badge tipo">
                    {cursoSeleccionado.tipo === 'curso' ? '📚 Curso' : '🎓 Programa Técnico'}
                  </span>
                  <span className="modal-badge categoria">
                    {cursoSeleccionado.categoria}
                  </span>
                  <span className="modal-badge nivel">
                    {cursoSeleccionado.nivel}
                  </span>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setCursoSeleccionado(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  src={cursoSeleccionado.imagen || '/api/placeholder/400/250'}
                  alt={cursoSeleccionado.nombre}
                  className="modal-image"
                />
                <div className="modal-rating">
                  <Star size={20} fill="currentColor" />
                  <span>4.5</span>
                </div>
              </div>
              
              <div className="modal-info">
                <div className="info-section">
                  <h3>📝 Descripción</h3>
                  <p>{cursoSeleccionado.descripcion}</p>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <h4>👨‍🏫 Instructor</h4>
                    <p>{cursoSeleccionado.instructor}</p>
                  </div>
                  
                  <div className="info-item">
                    <h4>⏱️ Duración</h4>
                    <p>
                      {cursoSeleccionado.tipo === 'curso' 
                        ? `${cursoSeleccionado.duracion?.horas || 'N/A'} horas (${cursoSeleccionado.duracion?.semanas || 'N/A'} semanas)`
                        : `${cursoSeleccionado.duracion?.meses || 'N/A'} meses (${cursoSeleccionado.duracion?.horas || 'N/A'} horas)`
                      }
                    </p>
                  </div>

                  <div className="info-item">
                    <h4>🎯 Modalidad</h4>
                    <p>{cursoSeleccionado.modalidad}</p>
                  </div>

                  <div className="info-item">
                    <h4>👥 Cupos</h4>
                    <p>
                      {cursoSeleccionado.cupos?.ocupados || 0} ocupados / {' '}
                      {cursoSeleccionado.cupos?.total || cursoSeleccionado.cupos?.disponibles || 'N/A'} totales
                    </p>
                  </div>

                  <div className="info-item">
                    <h4>📅 Fechas</h4>
                    <p>
                      <strong>Inicio:</strong> {cursoSeleccionado.fechaInicio ? new Date(cursoSeleccionado.fechaInicio).toLocaleDateString() : 'N/A'}<br/>
                      <strong>Fin:</strong> {cursoSeleccionado.fechaFin ? new Date(cursoSeleccionado.fechaFin).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="info-item">
                    <h4>💰 Precio</h4>
                    <p className="precio-modal">
                      {cursoSeleccionado.precio ? `$${cursoSeleccionado.precio}` : 'Gratis'}
                    </p>
                  </div>
                </div>

                {cursoSeleccionado.requisitos && (
                  <div className="info-section">
                    <h3>📋 Requisitos</h3>
                    <p>{cursoSeleccionado.requisitos}</p>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn-modal-secondary"
                    onClick={() => toggleFavorite(cursoSeleccionado.id)}
                  >
                    <Heart size={16} />
                    {favorites[cursoSeleccionado.id] ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                  </button>
                  <button
                    className="btn-modal-primary"
                    onClick={() => {
                      inscribirseEnCurso(cursoSeleccionado.id);
                      setCursoSeleccionado(null);
                    }}
                    disabled={inscripcionLoading || (cursoSeleccionado.cupos?.disponibles || 0) === 0}
                  >
                    {inscripcionLoading ? 'Inscribiendo...' : 
                     (cursoSeleccionado.cupos?.disponibles || 0) === 0 ? 'Sin Cupos' : 'Inscribirse Ahora'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>
      <Footer />
    </div>
  );
};

export default CursosSeminario;
