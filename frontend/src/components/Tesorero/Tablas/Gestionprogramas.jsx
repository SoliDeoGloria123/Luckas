import React, { useState, useEffect } from 'react';
import { programasAcademicosService } from "../../../services/programasAcademicosService";
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import ProgramaModal from '../modal/ProgramasModa';
import {
  Plus,
  Edit,
  Eye,
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';

const Gestioncursos = () => {
  // --- CREAR Y EDITAR PROGRAMA ---
  // formData: { titulo, descripcion, tipo, modalidad, duracion, precio, fechaInicio, fechaFin, cupos, profesor, ... }
  const handleGuardarPrograma = async (formData, modoEdicion, idPrograma) => {
    // Procesar arrays de objetos a arrays de strings
    const procesarRequisitos = (requisitos) => {
      if (!Array.isArray(requisitos)) return [];
      return requisitos
        .map(req => typeof req === 'object' ? req.value : req)
        .filter(req => req && req.trim() !== '');
    };

    const procesarObjetivos = (objetivos) => {
      if (!Array.isArray(objetivos)) return [];
      return objetivos
        .map(obj => typeof obj === 'object' ? obj.value : obj)
        .filter(obj => obj && obj.trim() !== '');
    };

    // Adaptar los campos del formulario al modelo del backend
    const payload = {
      nombre: formData.titulo,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      modalidad: formData.modalidad,
      duracion: formData.duracion,
      precio: Number(formData.precio),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      cuposDisponibles: Number(formData.cupos),
      profesor: formData.profesor,
      profesorBio: formData.profesorBio || '',
      requisitos: procesarRequisitos(formData.requisitos),
      pensum: formData.pensum || [],
      objetivos: procesarObjetivos(formData.objetivos),
      metodologia: formData.metodologia || '',
      evaluacion: formData.evaluacion || '',
      certificacion: Boolean(formData.certificacion) || false,
      imagen: formData.imagen || ''
    };

    // Solo agregar destacado si está definido
    if (formData.destacado !== undefined) {
      payload.destacado = formData.destacado;
    }
    
    // Usar un ObjectId válido por defecto para categoría
    // Este debe existir en la base de datos o el backend debe manejarlo
    payload.categoria = '507f1f77bcf86cd799439011'; // ObjectId válido genérico
    try {
      setCargando(true);
      if (modoEdicion && idPrograma) {
        // Editar
        await programasAcademicosService.updatePrograma(idPrograma, payload);
        mostrarAlerta('¡Éxito!', 'Programa actualizado correctamente');
      } else {
        // Crear
        await programasAcademicosService.createPrograma(payload);
        mostrarAlerta('¡Éxito!', 'Programa creado correctamente');
      }
      // Refrescar lista
      obtenerCursos();
      setShowModal(false);
    } catch (error) {
      mostrarAlerta('Error', `Hubo un problema al guardar el programa: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const obtenerCursos = () => { };
  const formatearPrecio = (precio) => `$${precio}`;
  const [filtros] = useState({ // setFiltros commented as unused
    tipo: '',
    modalidad: '',
    busqueda: ''
  });
  const [cursos, setCursos] = useState([]);
  const setProgramas = setCursos;
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const programas = cursos;

  // Estado para el formulario del modal
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'curso',
    modalidad: 'presencial',
    duracion: '',
    precio: '',
    fechaInicio: '',
    fechaFin: '',
    cupos: '',
    profesor: '',
    profesorBio: '',
    requisitos: [{ id: 'req_0', value: '' }],
    pensum: [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
    objetivos: [{ id: 'obj_0', value: '' }],
    metodologia: '',
    evaluacion: '',
    certificacion: false,
    imagen: '',
    destacado: false
  });

  // Funciones del modal
  const abrirModalVer = (programa) => {
    setSelectedProgram(programa);
    setShowDetailModal(true);
  };

  const abrirModalEditar = (programa) => {
    setModalMode('edit');
    setCurrentItem(programa);
    // Llenar formData con datos del programa seleccionado
    setFormData({
      titulo: programa.nombre || '',
      descripcion: programa.descripcion || '',
      tipo: programa.tipo || 'curso',
      modalidad: programa.modalidad || 'presencial',
      duracion: programa.duracion || '',
      precio: programa.precio || '',
      fechaInicio: programa.fechaInicio ? programa.fechaInicio.split('T')[0] : '',
      fechaFin: programa.fechaFin ? programa.fechaFin.split('T')[0] : '',
      cupos: programa.cuposDisponibles || '',
      profesor: programa.profesor || '',
      profesorBio: programa.profesorBio || '',
      requisitos: Array.isArray(programa.requisitos) 
        ? programa.requisitos.map((req, i) => ({ id: `req_${i}`, value: req }))
        : [{ id: 'req_0', value: '' }],
      pensum: Array.isArray(programa.pensum) 
        ? programa.pensum.map((mod, i) => ({ id: `pen_${i}`, ...mod }))
        : [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
      objetivos: Array.isArray(programa.objetivos)
        ? programa.objetivos.map((obj, i) => ({ id: `obj_${i}`, value: obj }))
        : [{ id: 'obj_0', value: '' }],
      metodologia: programa.metodologia || '',
      evaluacion: programa.evaluacion || '',
      certificacion: programa.certificacion || false,
      imagen: programa.imagen || '',
      destacado: programa.destacado || false
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setModalMode('create');
    setCurrentItem(null);
    // Limpiar formData para crear nuevo
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'curso',
      modalidad: 'presencial',
      duracion: '',
      precio: '',
      fechaInicio: '',
      fechaFin: '',
      cupos: '',
      profesor: '',
      profesorBio: '',
      requisitos: [{ id: 'req_0', value: '' }],
      pensum: [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
      objetivos: [{ id: 'obj_0', value: '' }],
      metodologia: '',
      evaluacion: '',
      certificacion: false,
      imagen: '',
      destacado: false
    });
    setShowModal(true);
  };

  // Función para manejar el submit del modal
  const handleSubmitModal = async (e) => {
    e.preventDefault();
    const modoEdicion = modalMode === 'edit';
    const idPrograma = currentItem?._id;
    await handleGuardarPrograma(formData, modoEdicion, idPrograma);
  };

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //obtener cursos

  const cargarProgramas = async () => {
  setCargando(true);
    try {
      const response = await programasAcademicosService.getAllProgramas(filtros);
      if (response.success) {
        setProgramas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar programas:', error);
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    cargarProgramas();
  }, []);

  // Función de búsqueda por nombre, instructor o categoría
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const trimmedValue = searchValue.trim();
    if (trimmedValue.length === 0) {
      setCursosFiltrados(cursos);
      return;
    }
    const searchLower = trimmedValue.toLowerCase();
    const filteredCursos = cursos.filter(curso => {
      const nombre = curso.nombre?.toLowerCase();
      const instructor = curso.instructor?.toLowerCase();
      const categoria = curso.categoria?.toLowerCase();
      return nombre?.includes(searchLower) ||
        instructor?.includes(searchLower) ||
        categoria?.includes(searchLower);
    });
    setCursosFiltrados(filteredCursos);
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

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const totalPaginas = Math.ceil(cursosFiltrados.length / registrosPorPagina);
  const cursosPaginados = cursosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [cursosFiltrados]);

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
              <h1>Gestión Programas</h1>
              <p>Administra los cursos académicos y programas técnicos del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            if (cargando) {
              return (
                <div className="col-span-full text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Cargando programas académicos...</p>
                </div>
              );
            }
            
            if (programas.length > 0) {
              return cursosPaginados.map((programa) => {
                // Determinar clases para el tipo de programa
                const tipoClases = programa.tipo === 'curso'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600';

                const tipoLabelClases = programa.tipo === 'curso'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800';

                // Determinar clases para el estado del programa
                let estadoClases = 'bg-amber-100 text-amber-800';
                if (programa.estado === 'activo') {
                  estadoClases = 'bg-emerald-100 text-emerald-800';
                } else if (programa.estado === 'inactivo') {
                  estadoClases = 'bg-red-100 text-red-800';
                }

                return (
                <div key={programa._id} className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Header del programa */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${tipoClases}`}>
                        {programa.tipo === 'curso' ? (
                          <BookOpen className="w-6 h-6 text-white" />
                        ) : (
                          <GraduationCap className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${tipoLabelClases}`}>
                          {programa.tipo === 'curso' ? 'Curso' : 'Programa Técnico'}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${estadoClases}`}>
                          {programa.estado}
                        </span>
                      </div>
                    </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => abrirModalVer(programa)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => abrirModalEditar(programa)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                  </div>
                </div>

                {/* Contenido del programa */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{programa.nombre}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{programa.descripcion}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">
                        {formatearPrecio(programa.precio)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-600">
                        Max. {programa.capacidadMaxima || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-600">
                        {typeof programa.duracion === 'object'
                          ? `${programa.duracion?.horas || 0}h - ${programa.duracion?.semanas || 0} sem`
                          : programa.duracion || 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-slate-600">
                        {programa.fechaInicio ? new Date(programa.fechaInicio).toLocaleDateString() : 'Por definir'}
                      </span>
                    </div>
                  </div>

                  {programa.instructor && (
                    <div className="pt-3 border-t border-slate-200/50">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Instructor:</span> {programa.instructor}
                      </p>
                    </div>
                  )}
                </div>
              </div>
                );
              });
            }
            
            return (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay programas académicos</h3>
                <p className="text-slate-500 mb-6">Comienza creando tu primer curso o programa técnico</p>
                <button
                  onClick={abrirModalCrear}
                  className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Crear Programa Académico
                </button>
              </div>
            );
          })()}
        </div>



        {/* Modal de Programas */}
        {showModal && (
          <ProgramaModal
            mostrar={showModal}
            modoEdicion={modalMode === 'edit'}
            programaSeleccionado={currentItem}
            formData={formData}
            setFormData={setFormData}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmitModal}
          />
        )}

        {/* Modal de Detalles del Programa */}
        {showDetailModal && selectedProgram && (
          <div className="modal-overlay-tesorero">
            <div className="tesorero-modal">
              <div className="modal-header-tesorero">
                <h2>Detalle del Programa</h2>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
              </div>
              <div className="modal-body-tesorero">
                <div className="programa-detalle-card">
                  {selectedProgram.imagen && (
                    <div className="programa-detalle-imagen">
                      <img src={selectedProgram.imagen} alt="Imagen del programa" style={{maxWidth:'100%',borderRadius:'8px',marginBottom:'1rem'}} />
                    </div>
                  )}
                  <div className="programa-detalle-info">
                    <div className="detalle-row"><span className="detalle-label">Título:</span> <span>{selectedProgram.nombre}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Tipo:</span> <span>{selectedProgram.tipo === 'curso' ? 'Curso' : 'Programa Técnico'}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Descripción:</span> <span>{selectedProgram.descripcion}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Modalidad:</span> <span>{selectedProgram.modalidad}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Duración:</span> <span>{selectedProgram.duracion}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Fecha de Inicio:</span> <span>{selectedProgram.fechaInicio ? selectedProgram.fechaInicio.split('T')[0] : 'No definida'}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Fecha de Fin:</span> <span>{selectedProgram.fechaFin ? selectedProgram.fechaFin.split('T')[0] : 'No definida'}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Precio:</span> <span>${selectedProgram.precio}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Cupos Disponibles:</span> <span>{selectedProgram.cuposDisponibles}</span></div>
                    <div className="detalle-row"><span className="detalle-label">Profesor:</span> <span>{selectedProgram.profesor}</span></div>
                    {selectedProgram.profesorBio && <div className="detalle-row"><span className="detalle-label">Biografía del Profesor:</span> <span>{selectedProgram.profesorBio}</span></div>}
                    {selectedProgram.metodologia && <div className="detalle-row"><span className="detalle-label">Metodología:</span> <span>{selectedProgram.metodologia}</span></div>}
                    {selectedProgram.evaluacion && <div className="detalle-row"><span className="detalle-label">Sistema de Evaluación:</span> <span>{selectedProgram.evaluacion}</span></div>}
                    {selectedProgram.certificacion && <div className="detalle-row"><span className="detalle-label">Certificación:</span> <span>{selectedProgram.certificacion}</span></div>}
                    <div className="detalle-row"><span className="detalle-label">Programa Destacado:</span> <span>{selectedProgram.destacado ? 'Sí' : 'No'}</span></div>
                    {selectedProgram.requisitos && selectedProgram.requisitos.length > 0 && (
                      <div className="detalle-row">
                        <span className="detalle-label">Requisitos:</span>
                        <ul style={{margin:0,paddingLeft:'1.2em'}}>
                          {selectedProgram.requisitos.map((req, index) => req && <li key={`req-${index}-${req.substring(0, 10)}`}>{req}</li>)}
                        </ul>
                      </div>
                    )}
                    {selectedProgram.objetivos && selectedProgram.objetivos.length > 0 && (
                      <div className="detalle-row">
                        <span className="detalle-label">Objetivos:</span>
                        <ul style={{margin:0,paddingLeft:'1.2em'}}>
                          {selectedProgram.objetivos.map((obj, index) => obj && <li key={`obj-${index}-${obj.substring(0, 10)}`}>{obj}</li>)}
                        </ul>
                      </div>
                    )}
                    {selectedProgram.pensum && selectedProgram.pensum.length > 0 && (
                      <div className="detalle-row">
                        <span className="detalle-label">Pensum Académico:</span>
                        <ul style={{margin:0,paddingLeft:'1.2em'}}>
                          {selectedProgram.pensum.map((mod, index) => (
                            <li key={`pensum-${index}-${(mod.modulo || '').substring(0, 10)}`}><b>{mod.modulo}</b>: {mod.descripcion} ({mod.horas} horas)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer-tesorero" style={{marginTop:'2rem'}}>
                    <button type="button" className="cancel-btn" onClick={() => setShowDetailModal(false)}>Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <button
            className="pagination-btn-admin"
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gestioncursos;
