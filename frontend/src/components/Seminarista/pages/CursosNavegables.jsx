import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './CursosSeminario.css'; // Estilos específicos para cursos
import './CabanasSeminario.css'; // Estilos base reutilizados
import Header from '../Shared/Header';
import Footer from '../../footer/Footer';
import { Heart, Star, BookOpen, Calendar, Users, Clock } from 'lucide-react';
import { programasAcademicosService } from '../../../services/programasAcademicosService';
import FormularioInscripcion from '../pages/FormularioInscripcion';

const CursosSeminario = () => {
  const { user } = useAuthCheck('seminarista');
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [favorites, setFavorites] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [inscripcionLoading] = useState(false);

  // Effect para manejar el cierre del modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && cursoSeleccionado) {
        setCursoSeleccionado(null);
      }
    };

    if (cursoSeleccionado) {
      document.addEventListener('keydown', handleKeyDown);
      // Enfocar el botón de cerrar del modal para mejor accesibilidad
      const closeButton = document.querySelector('.modal-close-programas');
      if (closeButton) {
        closeButton.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cursoSeleccionado]);

  useEffect(() => {
  const cargarCursos = async () => {
    try {
      setLoading(true);
      // Obtener programas académicos reales de la base de datos
      const response = await programasAcademicosService.getAllProgramas();
      // Si la respuesta es un objeto con .data, usa .data, si es array, úsalo directo
      const cursosArray = Array.isArray(response) ? response : response.data;
      setCursos(Array.isArray(cursosArray) ? cursosArray : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar programas:', err);
      setError('No se pudieron cargar los programas.');
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

  const verDetalles = (curso) => {
    setCursoSeleccionado(curso);
  };

  const filterCursos = (categoria) => {
    setActiveFilter(categoria);
  };

  const cursosFiltrados = activeFilter === 'todos' 
    ? cursos 
    : cursos.filter(curso => curso.categoria?.nombre?.toLowerCase().includes(activeFilter.toLowerCase()));

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
            <button onClick={() => globalThis.location.reload()} className="retry-button">
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
              <span className="stat-number-seminario">{cursos.filter(c => c.categoria?.tipo === 'curso').length}</span>
              <span className="stat-label-seminario">Cursos</span>
            </div>
            <div className="stat-item-seminario">
              <span className="stat-number-seminario">{cursos.filter(c => c.categoria?.tipo === 'programa').length}</span>
              <span className="stat-label-seminario">Programas</span>
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
              className={`filter-btn ${activeFilter === 'tecnologia' ? 'active' : ''}`}
              onClick={() => filterCursos('tecnologia')}
            >
              Tecnología
            </button>
            <button
              className={`filter-btn ${activeFilter === 'idiomas' ? 'active' : ''}`}
              onClick={() => filterCursos('idiomas')}
            >
              Idiomas
            </button>
            <button
              className={`filter-btn ${activeFilter === 'negocios' ? 'active' : ''}`}
              onClick={() => filterCursos('negocios')}
            >
              Negocios
            </button>
            <button
              className={`filter-btn ${activeFilter === 'arte' ? 'active' : ''}`}
              onClick={() => filterCursos('arte')}
            >
              Arte
            </button>
            <button
              className={`filter-btn ${activeFilter === 'salud' ? 'active' : ''}`}
              onClick={() => filterCursos('salud')}
            >
              Salud
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="cabins-grid">
          {cursosFiltrados.map((curso) => {
            // Precompute labels to avoid nested ternaries / IIFEs inside JSX (mejora SonarQube)
            const tipoLabel = (() => {
              if (curso.categoria?.tipo === 'curso') return '📚 Curso';
              if (curso.categoria?.tipo === 'programa') return '🎓 Programa Técnico';
              return '🗂 Otro';
            })();

            const descripcionText = (() => {
              if (curso.descripcion && curso.descripcion.length > 80) return curso.descripcion.substring(0, 80) + '...';
              if (curso.descripcion) return curso.descripcion;
              return 'Sin descripción';
            })();

            const isLleno = (curso.cuposDisponibles || 0) === 0;
            const availabilityClass = isLleno ? 'reserved' : '';
            const availabilityText = isLleno ? 'Lleno' : 'Disponible';

            const inscribirLabel = (() => {
              if (inscripcionLoading) return 'Inscribiendo...';
              if (isLleno) return 'Lleno';
              return 'Inscribirse';
            })();

            return (
            <div key={curso._id} className="cabin-card">
              <div className="cabin-image">
                <img
                  src={curso.imagen || '/api/placeholder/300/200'}
                  alt={curso.nombre}
                />
                <div className={`cabin-status ${curso.estado === 'activo' ? 'available' : 'reserved'}`}>
                  {curso.estado === 'activo' ? 'Disponible' : 'No Disponible'}
                </div>
                <button
                  type="button"
                  className={`cabin-favorite ${favorites[curso._id] ? 'active' : ''}`}
                  aria-pressed={!!favorites[curso._id]}
                  tabIndex={0}
                  onClick={() => toggleFavorite(curso._id)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleFavorite(curso._id); }}
                >
                  <Heart/>
                </button>
                <div className="cabin-gallery">
                  <span className="gallery-count">
                    {tipoLabel}
                  </span>
                </div>
              </div>
              
              <div className="cabin-content">
                <div className="cabin-header">
                  <div className="cabin-category">
                    {curso.categoria?.nombre}
                  </div>
                  <div className="cabin-rating">
                    <Star size={15} />
                    <span>4.5</span>
                  </div>
                </div>

                <h3 className="cabin-title-cabana">{curso.nombre}</h3>
                <p className="cabin-description">{descripcionText}</p>

                <div className="cabin-features">
                  <div className="feature-item">
                    <BookOpen size={16} />
                    <span className={getNivelColor(curso.nivel)}>{curso.nivel}</span>
                  </div>
                  <div className="feature-item">
                    <Users size={16} />
                    <span>{curso.cuposDisponibles || 'N/A'} cupos</span>
                  </div>
                  <div className="feature-item">
                    <Clock size={16} />
                    <span>{curso.duracion || 'N/A'}</span>
                  </div>
                  <div className="feature-item">
                    <Calendar size={16} />
                    <span>{getModalidadIcon(curso.modalidad)} {curso.modalidad}</span>
                  </div>
                </div>

                <div className="cabin-amenities">
                  <div className="amenity-tag">
                    👨‍🏫 {curso.profesor || 'No asignado'}
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
                    <span className={`availability-text ${availabilityClass}`}>
                      {availabilityText}
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
                    onClick={() => {
                      setCursoSeleccionado(curso);
                      setMostrarFormulario(true);
                    }}
                    disabled={inscripcionLoading || isLleno}
                  >
                    {inscribirLabel}
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {cursosFiltrados.length === 0 && (
          <div className="no-results">
            <BookOpen size={64} />
            <h3>No hay cursos disponibles</h3>
            <p>No se encontraron cursos para la categoría seleccionada.</p>
          </div>
        )}

      {/* Modal de Detalles del Curso */}
      {cursoSeleccionado && !mostrarFormulario && (() => {
        // Precompute labels to avoid IIFEs inside JSX (mejora SonarQube)
        const tipoModalLabel = (() => {
          if (cursoSeleccionado.categoria?.tipo === 'curso') return '📚 Curso';
          if (cursoSeleccionado.categoria?.tipo === 'programa') return '🎓 Programa';
          return '🗂 Otro';
        })();

        const inscribirModalLabel = (() => {
          if (inscripcionLoading) return 'Inscribiendo...';
          if ((cursoSeleccionado.cuposDisponibles || 0) === 0) return 'Sin Cupos';
          return 'Inscribirse Ahora';
        })();

        const isModalDisabled = inscripcionLoading || (cursoSeleccionado.cuposDisponibles || 0) === 0;

        return (
        <div className="modal-overlay-programas">
          <button
            type="button"
            className="modal-backdrop"
            onClick={() => setCursoSeleccionado(null)}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'default',
              zIndex: 1
            }}
            aria-label="Cerrar modal"
          />
          <dialog 
            className="modal-content-programas" 
            open
            aria-labelledby="modal-title"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className="modal-header-programas">
              <div className="modal-title-section-programas">
                <h2 id="modal-title">{cursoSeleccionado.nombre}</h2>
                <div className="modal-badges-programas">
                  <span className="modal-badge-programas tipo">
                    {tipoModalLabel}
                  </span>
                  <span className="modal-badge-programas categoria">
                    {cursoSeleccionado.categoria?.nombre || 'Sin categoría'}
                  </span>
                  <span className="modal-badge-programas nivel">
                    {cursoSeleccionado.nivel}
                  </span>
                </div>
              </div>
              <button
                className="modal-close-programas"
                onClick={() => setCursoSeleccionado(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body-programas">
              <div className="modal-image-container-programas">
                <img
                  src={cursoSeleccionado.imagen || '/api/placeholder/400/250'}
                  alt={cursoSeleccionado.nombre}
                  className="modal-image-programas"
                />
                <div className="modal-rating-programas">
                  <Star size={20} fill="currentColor" />
                  <span>4.5</span>
                </div>
              </div>
              
              <div className="modal-info-programas">
                <div className="info-section-programas">
                  <h3>📝 Descripción</h3>
                  <p>{cursoSeleccionado.descripcion}</p>
                </div>

                <div className="info-grid-programas">
                  <div className="info-item-programas">
                    <h4>👨‍🏫 Profesor</h4>
                    <p>{cursoSeleccionado.profesor || 'No asignado'}</p>
                  </div>

                  <div className="info-item-programas">
                    <h4>⏱️ Duración</h4>
                    <p>{cursoSeleccionado.duracion || 'No especificada'}</p>
                  </div>

                  <div className="info-item-programas">
                    <h4>🎯 Modalidad</h4>
                    <p>{cursoSeleccionado.modalidad}</p>
                  </div>

                  <div className="info-item-programas">
                    <h4>👥 Cupos</h4>
                    <p>
                      {cursoSeleccionado.cuposOcupados || 0} ocupados / {' '}
                      {cursoSeleccionado.cuposDisponibles || 'N/A'} disponibles
                    </p>
                  </div>

                  <div className="info-item-programas">
                    <h4>📅 Fechas</h4>
                    <p>
                      <strong>Inicio:</strong> {cursoSeleccionado.fechaInicio ? new Date(cursoSeleccionado.fechaInicio).toLocaleDateString() : 'N/A'}<br/>
                      <strong>Fin:</strong> {cursoSeleccionado.fechaFin ? new Date(cursoSeleccionado.fechaFin).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="info-item-programas">
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
                    className="btn-modal-secondary-programas"
                    onClick={() => toggleFavorite(cursoSeleccionado._id)}
                  >
                    <Heart size={16} />
                    {favorites[cursoSeleccionado._id] ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                  </button>
                  <button
                    className="btn-modal-primary-programas"
                    onClick={() => {
                      // Abrir formulario de inscripción
                      setMostrarFormulario(true);
                    }}
                    disabled={isModalDisabled}
                  >
                    {inscribirModalLabel}
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        </div>
        );
      })()}

      {/* Formulario de Inscripción */}
      {mostrarFormulario && cursoSeleccionado && (
        <FormularioInscripcion
          programa={cursoSeleccionado}
          usuario={user}
          loading={inscripcionLoading}
          onClose={() => {
            setMostrarFormulario(false);
            setCursoSeleccionado(null);
          }}
        />
      )}

      </main>
      <Footer />
    </div>
  );
};

export default CursosSeminario;