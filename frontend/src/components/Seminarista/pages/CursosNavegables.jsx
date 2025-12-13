import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './CursosSeminario.css'; // Estilos específicos para cursos
import './CabanasSeminario.css'; // Estilos base reutilizados
import Header from '../Shared/Header';
import Footer from '../../footer/Footer';
import {  Star, BookOpen, Calendar, Users, Clock, Search, Eye } from 'lucide-react';
import { programasAcademicosService } from '../../../services/programasAcademicosService';
import FormularioInscripcion from '../pages/FormularioInscripcion';

const CursosSeminario = () => {
  const { user } = useAuthCheck('seminarista');
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [inscripcionLoading] = useState(false);
  const [misInscripciones, setMisInscripciones] = useState([]);

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
      // Obtener programas académicos reales de la base de datos
      const response = await programasAcademicosService.getAllProgramas();
      // Si la respuesta es un objeto con .data, usa .data, si es array, úsalo directo
      const cursosArray = Array.isArray(response) ? response : response.data;
      setCursos(Array.isArray(cursosArray) ? cursosArray : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar programas:', err);
      setError('No se pudieron cargar los programas.');
    } 
  };
  cargarCursos();
}, []);

// Cargar inscripciones del usuario
useEffect(() => {
  const cargarInscripciones = async () => {
    try {
      const { inscripcionService } = require('../../../services/inscripcionService');
      const inscripciones = await inscripcionService.getAll();
      const inscripcionesArray = Array.isArray(inscripciones) ? inscripciones : inscripciones.data || [];
      setMisInscripciones(inscripcionesArray);
    } catch (err) {
      console.error('Error al cargar inscripciones:', err);
    }
  };
  if (user) {
    cargarInscripciones();
  }
}, [user]);


  
  const verDetalles = (curso) => {
    setCursoSeleccionado(curso);
  };

  // Verificar si el usuario ya está inscrito en un curso
  const estaInscrito = (cursoId) => {
    return misInscripciones.some(
      insc =>
      (insc.tipoReferencia === 'ProgramaAcademico' &&
        (insc.referencia === cursoId || insc.referencia?._id === cursoId))
    );
  };

  const filterCursos = (categoria) => {
    setActiveFilter(categoria);
  };

  // Filtrado según categoría seleccionada
  const cursosFiltrados = activeFilter === 'todos'
    ? cursos
    : cursos.filter(curso => curso.categoria?.nombre?.toLowerCase().includes(activeFilter.toLowerCase()));

  // Paginación (se coloca después de cursosFiltrados para evitar TDZ)
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Cuando cambia el filtro, volver a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [activeFilter]);

  // Ajustar página si la cantidad de elementos cambia
  useEffect(() => {
    const newTotal = cursosFiltrados.length === 0 ? 0 : Math.ceil(cursosFiltrados.length / registrosPorPagina);
    setPaginaActual((prev) => {
      if (newTotal === 0) return 1;
      return Math.min(prev, newTotal);
    });
  }, [cursosFiltrados.length]);

  const totalPaginas = cursosFiltrados.length === 0 ? 0 : Math.ceil(cursosFiltrados.length / registrosPorPagina);
  const cursosPaginados = cursosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Placeholder SVG data URL (uses project palette colors)
  const getPlaceholderDataUrl = (title = '') => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
        <defs>
          <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0' stop-color='#2563eb'/>
            <stop offset='1' stop-color='#8b5cf6'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#g)' />
        <g fill='rgba(255,255,255,0.95)' font-family='Segoe UI, Roboto, Arial' font-weight='600'>
          <text x='50%' y='45%' fill='rgba(255,255,255,0.95)' text-anchor='middle' font-size='48'>📚</text>
          <text x='50%' y='62%' fill='rgba(255,255,255,0.95)' text-anchor='middle' font-size='28'>${title ? title.substring(0,30) : 'Sin imagen'}</text>
        </g>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

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
    <div className="cursos-seminario">
      <Header/>
      <main className="main-content-cursos">
        {/* Page Header */}
        <div className="page-header-cursos">
          <div className="page-title-seminarista">
            <h1>Cursos Académicos</h1>
            <p>Descubre y participa en los cursos de formación académica y espiritual</p>
          </div>
          <div className="page-stats-cursos">
            <div className="stat-item-cursos">
              <span className="stat-number-cursos">{cursos.length}</span>
              <span className="stat-label-cursos">Cursos Totales</span>
            </div>
            <div className="stat-item-cursos">
              <span className="stat-number-cursos">{cursos.filter(c => c.categoria?.tipo === 'curso').length}</span>
              <span className="stat-label-cursos">Cursos</span>
            </div>
            <div className="stat-item-cursos">
              <span className="stat-number-cursos">{cursos.filter(c => c.categoria?.tipo === 'programa').length}</span>
              <span className="stat-label-cursos">Programas</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section-cursos">
          <div className="search-bar-cursos">
            <Search className="search-icon-cursos" size={20} />
            <input type="text" placeholder="Buscar cursos..." id="searchInput" />
          </div>

          <div className="filter-buttons-cursos">
            <button
              className={`filter-btn-cursos ${activeFilter === 'todos' ? 'active' : ''}`}
              onClick={() => filterCursos('todos')}
            >
              Todos
            </button>
            <button
              className={`filter-btn-cursos ${activeFilter === 'tecnologia' ? 'active' : ''}`}
              onClick={() => filterCursos('tecnologia')}
            >
              Tecnología
            </button>
            <button
              className={`filter-btn-cursos ${activeFilter === 'idiomas' ? 'active' : ''}`}
              onClick={() => filterCursos('idiomas')}
            >
              Idiomas
            </button>
            <button
              className={`filter-btn-cursos ${activeFilter === 'negocios' ? 'active' : ''}`}
              onClick={() => filterCursos('negocios')}
            >
              Negocios
            </button>
            <button
              className={`filter-btn-cursos ${activeFilter === 'arte' ? 'active' : ''}`}
              onClick={() => filterCursos('arte')}
            >
              Arte
            </button>
            <button
              className={`filter-btn-cursos ${activeFilter === 'salud' ? 'active' : ''}`}
              onClick={() => filterCursos('salud')}
            >
              Salud
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="cabins-grid-cursos">
          {cursosPaginados.map((curso) => {
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

            const inscrito = estaInscrito(curso._id);
            const isLleno = (curso.cuposDisponibles || 0) === 0;
            const availabilityClass = isLleno ? 'reserved' : '';
            
            // Extraer ternario anidado a variable independiente (mejora SonarQube)
            const availabilityText = (() => {
              if (isLleno) return 'Lleno';
              if (inscrito) return 'Inscrito';
              return 'Disponible';
            })();

            const inscribirLabel = (() => {
              if (inscripcionLoading) return 'Inscribiendo...';
              if (inscrito) return 'Ya inscrito';
              if (isLleno) return 'Lleno';
              return 'Inscribirse';
            })();

            return (
            <div key={curso._id} className="cabin-card-cursos">
              <div className="cabin-image-cursos">
                <img
                  src={curso.imagen || getPlaceholderDataUrl(curso.nombre)}
                  alt={curso.nombre}
                  onError={(e) => {
                    // evitar bucle si el placeholder falla
                    e.target.onerror = null;
                    e.target.src = getPlaceholderDataUrl(curso.nombre);
                  }}
                />
                <div className={`cabin-status ${curso.estado === 'activo' ? 'available' : 'reserved'}`}>
                  {curso.estado === 'activo' ? 'Disponible' : 'No Disponible'}
                </div>
               
                <div className="cabin-gallery-cursos">
                  <span className="gallery-count-cursos">
                    {tipoLabel}
                  </span>
                </div>
              </div>
              
              <div className="cabin-content-cursos">
                <div className="cabin-header-cursos">
                  <div className="cabin-category-cursos">
                    {curso.categoria?.nombre}
                  </div>
                  <div className="cabin-rating-cursos">
                    <Star size={15} />
                    <span>4.5</span>
                  </div>
                </div>

                <h3 className="cabin-title-cursos">{curso.nombre}</h3>
                <p className="cabin-description-cursos">{descripcionText}</p>

                <div className="cabin-features-cursos">
                  <div className="feature-item-cursos">
                    <BookOpen size={16} />
                    <span className={getNivelColor(curso.nivel)}>{curso.nivel}</span>
                  </div>
                  <div className="feature-item-cursos">
                    <Users size={16} />
                    <span>{curso.cuposDisponibles || 'N/A'} cupos</span>
                  </div>
                  <div className="feature-item-cursos">
                    <Clock size={16} />
                    <span>{curso.duracion || 'N/A'}</span>
                  </div>
                  <div className="feature-item-cursos">
                    <Calendar size={16} />
                    <span>{getModalidadIcon(curso.modalidad)} {curso.modalidad}</span>
                  </div>
                </div>

                <div className="cabin-amenities-cursos">
                  <div className="amenity-tag-cursos">
                    👨‍🏫 {curso.profesor || 'No asignado'}
                  </div>
                  {curso.fechaInicio && (
                    <div className="amenity-tag-cursos">
                      📅 {new Date(curso.fechaInicio).toLocaleDateString()}
                    </div>
                  )}
                </div>

                  <div className="cabin-footer-cursos">
                  <div className="cabin-price-cursos">
                    <span className="price-cursos">
                      ${curso.precio || 'Gratis'}
                    </span>
                    {curso.precio && <span className="price-period-cursos">/ curso</span>}
                  </div>
                  <div className="cabin-availability-cursos">
                    <span className={`availability-text ${availabilityClass}`}>
                      {availabilityText}
                    </span>
                  </div>
                </div>

                <div className="cabin-actions-cursos">
                  <button 
                    className="cabin-btn-cursos secondary" 
                    onClick={() => verDetalles(curso)}
                  >
                      <Eye size={16} />
                    Ver Detalles
                  </button>
                  <button 
                    className="cabin-btn-cursos primary"
                    onClick={() => {
                      if (!inscrito) {
                        setCursoSeleccionado(curso);
                        setMostrarFormulario(true);
                      }
                    }}
                    disabled={inscripcionLoading || isLleno || inscrito}
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
        {totalPaginas > 1 && (
        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual >= totalPaginas}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        )}
      </main>
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

      {/* Modal de Detalles del Curso */}
      {cursoSeleccionado && !mostrarFormulario && (() => {
        // Precompute labels to avoid IIFEs inside JSX (mejora SonarQube)
        const tipoModalLabel = (() => {
          if (cursoSeleccionado.categoria?.tipo === 'curso') return '📚 Curso';
          if (cursoSeleccionado.categoria?.tipo === 'programa') return '🎓 Programa';
          return '🗂 Otro';
        })();

        const inscribirModalLabel = (() => {
          if (estaInscrito(cursoSeleccionado._id)) return 'Ya inscrito';
          if (inscripcionLoading) return 'Inscribiendo...';
          if ((cursoSeleccionado.cuposDisponibles || 0) === 0) return 'Sin Cupos';
          return 'Inscribirse Ahora';
        })();

        const isModalDisabled = inscripcionLoading || (cursoSeleccionado.cuposDisponibles || 0) === 0 || estaInscrito(cursoSeleccionado._id);

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
              <div className="modal-info-programas modal-info-noimage">
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
      <Footer />
    </div>
  );
};

export default CursosSeminario;