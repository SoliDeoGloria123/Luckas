import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProgramasAcademicos.css';

const ProgramasAcademicos = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const programasData = {
    licenciaturas: [
      {
        id: 'licenciatura-teologia',
        titulo: 'Licenciatura en Teología',
        categoria: 'licenciatura',
        nivel: 'pregrado',
        duracion: '8 semestres',
        creditos: 160,
        modalidad: 'Presencial',
        precio: '$3,200 USD',
        descripcion: 'Programa integral de formación teológica con énfasis en fundamentos bíblicos, hermenéutica, y ministerio pastoral.',
        requisitos: [
          'Bachillerato completo',
          'Ser cristiano bautizado',
          'Carta de recomendación pastoral',
          'Entrevista personal',
          'Examen médico'
        ],
        materias: [
          'Introducción a la Teología',
          'Hermenéutica Bíblica',
          'Historia de la Iglesia',
          'Teología Sistemática',
          'Homilética',
          'Consejería Pastoral',
          'Evangelismo y Misiones',
          'Administración Eclesiástica'
        ],
        perfil: 'Pastores, líderes ministeriales, misioneros',
        imagen: '/static/img/licenciatura-teologia.jpg'
      },
      {
        id: 'licenciatura-educacion-cristiana',
        titulo: 'Licenciatura en Educación Cristiana',
        categoria: 'licenciatura',
        nivel: 'pregrado',
        duracion: '8 semestres',
        creditos: 160,
        modalidad: 'Presencial/Virtual',
        precio: '$3,000 USD',
        descripcion: 'Formación especializada en educación cristiana, pedagogía bíblica y desarrollo de materiales educativos.',
        requisitos: [
          'Bachillerato completo',
          'Experiencia en educación (preferible)',
          'Carta de recomendación',
          'Entrevista personal'
        ],
        materias: [
          'Pedagogía Bíblica',
          'Psicología del Desarrollo',
          'Métodos de Enseñanza',
          'Desarrollo Curricular',
          'Educación de Adultos',
          'Tecnología Educativa',
          'Administración Educativa',
          'Evaluación del Aprendizaje'
        ],
        perfil: 'Educadores cristianos, directores de educación',
        imagen: '/static/img/licenciatura-educacion.jpg'
      }
    ],
    carreras_tecnicas: [
      {
        id: 'tecnico-musica-sacra',
        titulo: 'Técnico en Música Sacra',
        categoria: 'tecnica',
        nivel: 'tecnico',
        duracion: '4 semestres',
        creditos: 80,
        modalidad: 'Presencial',
        precio: '$1,800 USD',
        descripcion: 'Formación técnica especializada en música para el culto cristiano, dirección coral y acompañamiento instrumental.',
        requisitos: [
          'Bachillerato completo',
          'Conocimientos básicos de música',
          'Audición musical',
          'Carta de recomendación pastoral'
        ],
        materias: [
          'Teoría Musical',
          'Armonía',
          'Dirección Coral',
          'Piano Funcional',
          'Historia de la Música Sacra',
          'Himnología',
          'Adoración y Liturgia',
          'Tecnología Musical'
        ],
        perfil: 'Directores de música, pianistas, cantantes',
        imagen: '/static/img/tecnico-musica.jpg'
      },
      {
        id: 'tecnico-trabajo-social',
        titulo: 'Técnico en Trabajo Social Cristiano',
        categoria: 'tecnica',
        nivel: 'tecnico',
        duracion: '4 semestres',
        creditos: 80,
        modalidad: 'Presencial',
        precio: '$1,600 USD',
        descripcion: 'Programa orientado al trabajo social comunitario con fundamento cristiano y enfoque en desarrollo humano.',
        requisitos: [
          'Bachillerato completo',
          'Vocación de servicio social',
          'Entrevista personal',
          'Referencias personales'
        ],
        materias: [
          'Fundamentos del Trabajo Social',
          'Sociología Cristiana',
          'Psicología Social',
          'Métodos de Intervención',
          'Desarrollo Comunitario',
          'Ética Cristiana',
          'Gestión de Proyectos',
          'Práctica Profesional'
        ],
        perfil: 'Trabajadores sociales, líderes comunitarios',
        imagen: '/static/img/tecnico-social.jpg'
      }
    ],
    cursos_especializacion: [
      {
        id: 'especializacion-consejeria',
        titulo: 'Especialización en Consejería Bíblica',
        categoria: 'especializacion',
        nivel: 'posgrado',
        duracion: '3 semestres',
        creditos: 45,
        modalidad: 'Virtual/Presencial',
        precio: '$2,500 USD',
        descripcion: 'Especialización avanzada en consejería bíblica, técnicas de intervención y acompañamiento pastoral.',
        requisitos: [
          'Licenciatura en Teología o afín',
          'Experiencia ministerial mínima 2 años',
          'Carta de recomendación',
          'Proyecto de investigación'
        ],
        materias: [
          'Consejería Bíblica Avanzada',
          'Psicopatología',
          'Técnicas de Intervención',
          'Consejería Familiar',
          'Consejería Grupal',
          'Ética en la Consejería',
          'Investigación Aplicada',
          'Práctica Supervisada'
        ],
        perfil: 'Pastores, consejeros, psicólogos cristianos',
        imagen: '/static/img/especializacion-consejeria.jpg'
      }
    ]
  };

  const allPrograms = [
    ...programasData.licenciaturas,
    ...programasData.carreras_tecnicas,
    ...programasData.cursos_especializacion
  ];

  const filteredPrograms = allPrograms.filter(programa => {
    const matchesCategory = selectedCategory === 'todos' || programa.categoria === selectedCategory;
    const matchesLevel = selectedLevel === 'todos' || programa.nivel === selectedLevel;
    const matchesSearch = programa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programa.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const openModal = (programa) => {
    setSelectedProgram(programa);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  return (
    <div className="programas-academicos">
      {/* Header Section */}
      <div className="programas-header">
        <h1>Programas Académicos</h1>
        <p>Descubre nuestra oferta educativa diseñada para formar líderes con fundamento bíblico</p>
      </div>

      {/* Filters Section */}
      <div className="programas-filters">
        <div className="filter-group">
          <label>Buscar programa:</label>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Categoría:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todas las categorías</option>
            <option value="licenciatura">Licenciaturas</option>
            <option value="tecnica">Carreras Técnicas</option>
            <option value="especializacion">Especializaciones</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Nivel:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los niveles</option>
            <option value="pregrado">Pregrado</option>
            <option value="tecnico">Técnico</option>
            <option value="posgrado">Posgrado</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="programas-grid">
        {filteredPrograms.map((programa) => (
          <div key={programa.id} className="programa-card">
            <div className="programa-imagen">
              <img src={programa.imagen} alt={programa.titulo} />
              <div className="programa-badge">{programa.categoria}</div>
            </div>
            
            <div className="programa-content">
              <h3>{programa.titulo}</h3>
              <p className="programa-descripcion">{programa.descripcion}</p>
              
              <div className="programa-info">
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>{programa.duracion}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{programa.creditos} créditos</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-laptop"></i>
                  <span>{programa.modalidad}</span>
                </div>
              </div>
              
              <div className="programa-precio">
                <span className="precio">{programa.precio}</span>
                <span className="precio-nota">Programa completo</span>
              </div>
              
              <div className="programa-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => openModal(programa)}
                >
                  Ver Detalles
                </button>
                <Link 
                  to={`/app/inscripcion?programa=${programa.id}`}
                  className="btn-primary"
                >
                  Inscribirme
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No se encontraron programas</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && selectedProgram && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProgram.titulo}</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedProgram.imagen} alt={selectedProgram.titulo} />
              </div>
              
              <div className="modal-details">
                <div className="detail-section">
                  <h3>Descripción del Programa</h3>
                  <p>{selectedProgram.descripcion}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Información General</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Duración:</strong> {selectedProgram.duracion}
                    </div>
                    <div className="detail-item">
                      <strong>Créditos:</strong> {selectedProgram.creditos}
                    </div>
                    <div className="detail-item">
                      <strong>Modalidad:</strong> {selectedProgram.modalidad}
                    </div>
                    <div className="detail-item">
                      <strong>Inversión:</strong> {selectedProgram.precio}
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Perfil de Egresado</h3>
                  <p>{selectedProgram.perfil}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Requisitos de Admisión</h3>
                  <ul>
                    {selectedProgram.requisitos.map((requisito, index) => (
                      <li key={index}>{requisito}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h3>Plan de Estudios</h3>
                  <div className="materias-grid">
                    {selectedProgram.materias.map((materia, index) => (
                      <div key={index} className="materia-item">
                        <i className="fas fa-book"></i>
                        <span>{materia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cerrar
              </button>
              <Link 
                to={`/app/inscripcion?programa=${selectedProgram.id}`}
                className="btn-primary"
              >
                Solicitar Admisión
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="programas-cta">
        <h2>¿No encuentras lo que buscas?</h2>
        <p>Contáctanos para conocer más sobre nuestros programas especiales y opciones de formación continua.</p>
        <div className="cta-buttons">
          <Link to="/app/contact" className="btn-primary">Contáctanos</Link>
          <Link to="/app/cursos" className="btn-secondary">Ver Cursos Cortos</Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramasAcademicos;