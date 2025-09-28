import React, { useState, useEffect } from 'react';
import { programasAcademicosService } from "../../../services/programasAcademicosService";
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'

const Gestioncursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //obtener cursos
  const obtenerCursos = async () => {
  
  };

  // Función de búsqueda por nombre, instructor o categoría
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setCursosFiltrados(cursos);
    } else {
      const searchLower = searchValue.toLowerCase().trim();
      const filteredCursos = cursos.filter(curso => {
        const nombre = curso.nombre?.toLowerCase();
        const instructor = curso.instructor?.toLowerCase();
        const categoria = curso.categoria?.toLowerCase();
        
        return nombre?.includes(searchLower) ||
               instructor?.includes(searchLower) ||
               categoria?.includes(searchLower);
      });
      setCursosFiltrados(filteredCursos);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  // Efecto para actualizar cursos filtrados cuando cambia la lista de cursos
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      setCursosFiltrados(cursos);
    }
  }, [cursos]);

  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Cursos y Programas</h1>
              <p>Administra los cursos académicos y programas técnicos del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i>
            Nuevo Curso
          </button>
        </div>

        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalCursos">{cursos.length}</div>
              <div className="stat-label-usuarios">Total Cursos</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeCursos">
                {cursos.filter(c => c.estado === 'activo').length}
              </div>
              <div className="stat-label-usuarios">Cursos Activos</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="programasTecnicos">
                {cursos.filter(c => c.tipo === 'programa').length}
              </div>
              <div className="stat-label-usuarios">Programas Técnicos</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalInscritos">
                {cursos.reduce((total, curso) => total + (curso.inscritos || 0), 0)}
              </div>
              <div className="stat-label-usuarios">Total Inscritos</div>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Buscar por nombre, instructor o categoría..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select className="filter-select">
              <option value="">Todas las categorías</option>
              <option value="biblico">Bíblico</option>
              <option value="ministerial">Ministerial</option>
              <option value="liderazgo">Liderazgo</option>
              <option value="pastoral">Pastoral</option>
              <option value="tecnologia">Tecnología</option>
              <option value="administracion">Administración</option>
            </select>
            <select className="filter-select">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
          <div className="export-actions">
            <button className="btn-outline-tesorero">
              <i className="fas fa-download"></i>
            </button>
            <button className="btn-outline-tesorero">
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>

        <div className="table-container-tesorero">
          {searchTerm && (
            <div className="search-results-info" style={{
              padding: '10px 15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px',
              color: '#666'
            }}>
              {cursosFiltrados.length === 0 
                ? `No se encontraron cursos que coincidan con "${searchTerm}"`
                : `Se encontraron ${cursosFiltrados.length} curso${cursosFiltrados.length === 1 ? '' : 's'} que coinciden con "${searchTerm}"`
              }
            </div>
          )}
          
          <table className="users-table-tesorero">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" id="selectAll" />
                </th>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>TIPO</th>
                <th>CATEGORÍA</th>
                <th>INSTRUCTOR</th>
                <th>DURACIÓN</th>
                <th>MODALIDAD</th>
                <th>ESTADO</th>
                <th>CUPOS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    {searchTerm ? 'No se encontraron cursos con esos criterios' : 'No hay cursos para mostrar'}
                  </td>
                </tr>
              ) : (
                cursosFiltrados.map((curso) => (
                  <tr key={curso.id || curso._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{curso.id || curso._id}</td>
                    <td>{curso.nombre}</td>
                    <td>
                      <span className={`badge-tesorero ${curso.tipo === 'curso' ? 'badge-tesorero-curso' : 'badge-tesorero-programa'}`}>
                        {curso.tipo === 'curso' ? 'Curso' : 'Programa'}
                      </span>
                    </td>
                    <td>
                      <span className="role-badge">{curso.categoria}</span>
                    </td>
                    <td>{curso.instructor}</td>
                    <td>
                      {curso.tipo === 'curso' 
                        ? `${curso.duracion?.semanas || curso.duracion?.horas || 'N/A'} ${curso.duracion?.semanas ? 'sem' : 'hrs'}` 
                        : `${curso.duracion?.meses || 'N/A'} meses`
                      }
                    </td>
                    <td>{curso.modalidad}</td>
                    <td>
                      <span className={`badge-tesorero badge-tesorero-${curso.estado}`}>
                        {curso.estado}
                      </span>
                    </td>
                    <td>
                      <span className="cupos-info">
                        {curso.cupos?.disponibles || 0}/{curso.cupos?.total || 0}
                      </span>
                    </td>
                    <td className='actions-cell'>
                      <button className='action-btn view' title="Ver detalles">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className='action-btn edit'
                        onClick={() => {
                          setModalMode('edit');
                          setCurrentItem(curso);
                          setShowModal(true);
                        }}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className='action-btn delete' title="Eliminar">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal placeholder - se puede implementar más adelante */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{modalMode === 'create' ? 'Crear Nuevo Curso' : 'Editar Curso'}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <p>Modal de curso en desarrollo...</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestioncursos;
