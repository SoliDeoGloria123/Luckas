import React, { useState, useEffect } from 'react';
import { programasAcademicosService } from "../../../services/programasAcademicosService";
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import ProgramaModal from '../../Dashboard/Modales/ProgramaModal';
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

const Gestionprogramas = () => {
  // Usamos nombres coherentes: `programas` en lugar de `cursos`.
  const [programas, setProgramas] = useState([]);
  const [programasFiltrados, setProgramasFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  // `programas` es la lista principal (ya definida arriba).

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [nuevoPrograma, setNuevoPrograma] = useState({
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
    certificacion: '',
    imagen: '',
    destacado: false
  });
  const [estadisticas, setEstadisticas] = useState({
    totalProgramas: 0,
    totalCursos: 0,
    totalProgramasTecnicos: 0,
    programasActivos: 0,
    programasInactivos: 0,
    nuevosProgramasEsteMes: 0
  });
  const formatearPrecio = (precio) => `$${precio}`;

  // Helper function to format dates
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString();
  };


  const obtenerCursos = async () => {
    try {
      // No dependemos de una variable `filtros` no declarada.
      const response = await programasAcademicosService.getAllProgramas();
      // El servicio puede devolver directamente un array o un objeto { success, data }
      let lista = [];
      if (response) {
        if (Array.isArray(response)) lista = response;
        else if (response.success && Array.isArray(response.data)) lista = response.data;
        else if (response.data && Array.isArray(response.data)) lista = response.data;
        else if (response.data) lista = response.data;
      }
      // Ordenar por fecha de creación ascendente para que los programas nuevos aparezcan al final
      const listaOrdenada = Array.isArray(lista)
        ? lista.slice().sort((a, b) => (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0))
        : lista;
      setProgramas(listaOrdenada);
      // Obtener estadísticas aunque la lista venga vacía
      obtenerEstadisticas();
    } catch (error) {
      console.error('Error al cargar programas:', error);

    }
  };


  // Funciones auxiliares para procesar datos del formulario
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


  // Funciones del modal
  const abrirModalVer = (programa) => {
    setSelectedProgram(programa);
    setShowDetailModal(true);
  };



  const handleCreate = () => {
    setModoEdicion(false);
    setProgramaSeleccionado(null);
    setNuevoPrograma({
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
      certificacion: '',
      imagen: '',
      destacado: false
    });
    setMostrarModal(true);
  };

  // Helper function to extract categoria ID - fixes SonarQube S3358
  const extractCategoriaId = (categoria) => {
    if (!categoria) return '';
    if (typeof categoria === 'object') {
      return categoria._id || categoria.id || '';
    }
    return categoria;
  };

  const abrirModalEditar = (programa) => {
    handleEdit(programa);
  };


  const handleEdit = (programa) => {
    setModoEdicion(true);
    setProgramaSeleccionado(programa);
    // Configurar nuevoPrograma con los datos del programa seleccionado
    setNuevoPrograma({
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
      categoria: extractCategoriaId(programa.categoria),
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
      certificacion: programa.certificacion || '',
      imagen: programa.imagen || '',
      destacado: programa.destacado || false
    });
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearPrograma = async (e) => {
    e.preventDefault();
    try {
      // Convertir la estructura del formulario a la estructura del backend
      // Validaciones frontend: asegurar que categoría exista y que certificacion sea booleano
      if (!nuevoPrograma.categoria) {
        mostrarAlerta('ERROR', 'Seleccione una categoría para el programa', 'error');
        return;
      }
      const certificacionBool = (nuevoPrograma.certificacion === true || String(nuevoPrograma.certificacion).toLowerCase() === 'true');
      const programaData = {
        nombre: nuevoPrograma.titulo,
        descripcion: nuevoPrograma.descripcion,
        tipo: nuevoPrograma.tipo,
        modalidad: nuevoPrograma.modalidad,
        duracion: nuevoPrograma.duracion,
        precio: Number(nuevoPrograma.precio),
        fechaInicio: nuevoPrograma.fechaInicio,
        fechaFin: nuevoPrograma.fechaFin,
        cuposDisponibles: Number(nuevoPrograma.cupos),
        categoria: nuevoPrograma.categoria,
        profesor: nuevoPrograma.profesor,
        profesorBio: nuevoPrograma.profesorBio || '',
        requisitos: procesarRequisitos(nuevoPrograma.requisitos),
        pensum: nuevoPrograma.pensum || [],
        objetivos: procesarObjetivos(nuevoPrograma.objetivos),
        metodologia: nuevoPrograma.metodologia || '',
        evaluacion: nuevoPrograma.evaluacion || '',
        certificacion: certificacionBool,
        imagen: nuevoPrograma.imagen || '',
        destacado: nuevoPrograma.destacado || false
      };
      await programasAcademicosService.createPrograma(programaData);
      mostrarAlerta("¡Éxito!", "Programa creado exitosamente", 'success');
      setMostrarModal(false);
      obtenerCursos();
      obtenerEstadisticas();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear programa: ${error.message}`, 'error');
    }
  };

  //obtener estadiscas de programas 
  const obtenerEstadisticas = async () => {
    try {
      const stats = await programasAcademicosService.obtenerEstadisticasGenerales();
      // El backend devuelve { success: true, data: { ... } }
      const payload = stats && stats.data ? stats.data : stats;
      setEstadisticas(payload || {});
    } catch (err) {
      console.error("Error al obtener estadísticas: " + err.message);
    }
  };

  const actualizarPrograma = async (e) => {
    e.preventDefault();
    try {
      // Convertir la estructura del formulario a la estructura del backend
      const certificacionBool = (nuevoPrograma.certificacion === true || String(nuevoPrograma.certificacion).toLowerCase() === 'true');
      const programaData = {
        nombre: nuevoPrograma.titulo,
        descripcion: nuevoPrograma.descripcion,
        tipo: nuevoPrograma.tipo,
        modalidad: nuevoPrograma.modalidad,
        duracion: nuevoPrograma.duracion,
        precio: Number(nuevoPrograma.precio),
        fechaInicio: nuevoPrograma.fechaInicio,
        fechaFin: nuevoPrograma.fechaFin,
        cuposDisponibles: Number(nuevoPrograma.cupos),
        profesor: nuevoPrograma.profesor,
        profesorBio: nuevoPrograma.profesorBio || '',
        requisitos: procesarRequisitos(nuevoPrograma.requisitos),
        pensum: nuevoPrograma.pensum || [],
        objetivos: procesarObjetivos(nuevoPrograma.objetivos),
        metodologia: nuevoPrograma.metodologia || '',
        evaluacion: nuevoPrograma.evaluacion || '',
        certificacion: certificacionBool,
        categoria: nuevoPrograma.categoria || (programaSeleccionado && programaSeleccionado.categoria),
        imagen: nuevoPrograma.imagen || '',
        destacado: nuevoPrograma.destacado || false
      };
      await programasAcademicosService.updatePrograma(programaSeleccionado._id, programaData);
      mostrarAlerta("¡Éxito!", "Programa actualizado exitosamente", 'success');
      setMostrarModal(false);
      obtenerCursos();
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar programa: ${error.message}`, 'error');
    }
  };
  // Función de búsqueda por nombre, instructor o categoría
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    // Aplicamos filtros de forma centralizada
    applyFilters(searchValue, filterTipo, filterEstado, programas);
  };

  const extractText = (val) => {
    if (!val && val !== 0) return '';
    if (typeof val === 'object') {
      return (val.nombre || val.nombreCategoria || val.titulo || val.instructor || val.categoria || JSON.stringify(val)).toString();
    }
    return String(val);
  };

  const applyFilters = (search = searchTerm, tipo = filterTipo, estado = filterEstado, lista = programas) => {
    const s = (search || '').toString().trim().toLowerCase();
    const filtered = (Array.isArray(lista) ? lista : []).filter((programa) => {
      // filtro por tipo
      if (tipo && tipo !== 'todos') {
        if (String(programa.tipo || '').toLowerCase() !== String(tipo).toLowerCase()) return false;
      }
      // filtro por estado
      if (estado && estado !== 'todos') {
        if (String(programa.estado || '').toLowerCase() !== String(estado).toLowerCase()) return false;
      }

      if (!s) return true;

      const nombre = extractText(programa.nombre).toLowerCase();
      const profesor = extractText(programa.profesor).toLowerCase();
      const categoria = extractText(programa.categoria).toLowerCase();

      return nombre.includes(s) || profesor.includes(s) || categoria.includes(s);
    });

    setProgramasFiltrados(filtered);
  };

  useEffect(() => {
    obtenerCursos();
    obtenerEstadisticas();
  }, []);

  // Efecto para actualizar cursos filtrados cuando cambia la lista de cursos o filtros
  useEffect(() => {
    applyFilters(searchTerm, filterTipo, filterEstado, programas);
  }, [programas, searchTerm, filterTipo, filterEstado]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const totalPaginas = Math.ceil(programasFiltrados.length / registrosPorPagina);
  const programasPaginados = programasFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [programasFiltrados]);

  return (
    <>
      <Header/>
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
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
              <div className="stat-number-usuarios" id="totalCursos">{estadisticas.totalCursos}</div>
              <div className="stat-label-usuarios">Total Cursos</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeCursos">
                {programas.filter(c => c.estado === 'activo').length}
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
                {estadisticas.totalProgramasTecnicos}
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
                {programas.reduce((total, curso) => total + (curso.inscritos || 0), 0)}
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
                id="userSearch"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterTipo}
              onChange={(e) => {
                const val = e.target.value;
                setFilterTipo(val);
                applyFilters(searchTerm, val, filterEstado, programas);
              }}
            >
              <option value="todos">Todos los tipos</option>
              <option value="curso">Cursos</option>
              <option value="programa-tecnico">Programas Técnicos</option>
            </select>
            <select
              className="filter-select"
              value={filterEstado}
              onChange={(e) => {
                const val = e.target.value;
                setFilterEstado(val);
                applyFilters(searchTerm, filterTipo, val, programas);
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {

            if (programasPaginados.length > 0) {
              return (
                programasPaginados.map((programa) => (
                  <div key={programa._id} className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Header del programa */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const esCurso = programa.tipo === 'curso';
                          const gradientClass = esCurso
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            : 'bg-gradient-to-r from-purple-600 to-violet-600';
                          const IconComponent = esCurso ? BookOpen : GraduationCap;

                          return (
                            <div className={`p-3 rounded-xl ${gradientClass}`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                          );
                        })()}
                        <div>
                          {(() => {
                            const esCurso = programa.tipo === 'curso';
                            const badgeClass = esCurso
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800';
                            const tipoTexto = esCurso ? 'Curso' : 'Programa Técnico';

                            return (
                              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${badgeClass}`}>
                                {tipoTexto}
                              </span>
                            );
                          })()}
                          {(() => {
                            const estado = programa.estado;
                            let estadoClass = 'bg-amber-100 text-amber-800'; // Por defecto

                            if (estado === 'activo') {
                              estadoClass = 'bg-emerald-100 text-emerald-800';
                            } else if (estado === 'inactivo') {
                              estadoClass = 'bg-red-100 text-red-800';
                            }

                            return (
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${estadoClass}`}>
                                {estado}
                              </span>
                            );
                          })()}
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
                            Disponibles: {programa.cuposDisponibles ?? 'N/A'} / Ocupados: {programa.cuposOcupados ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-slate-600">
                            {(() => {
                              if (typeof programa.duracion === 'object') {
                                const horas = programa.duracion?.horas || 0;
                                const semanas = programa.duracion?.semanas || 0;
                                return `${horas}h - ${semanas} sem`;
                              }
                              return programa.duracion || 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-slate-600">
                            {programa.fechaInicio ? formatearFecha(programa.fechaInicio) : 'Por definir'}
                            {programa.fechaFin ? ` — ${formatearFecha(programa.fechaFin)}` : ''}
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200/50">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Profesor:</span> {programa.profesor || '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Modalidad:</span> {programa.modalidad || '—'}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Nivel:</span> {programa.nivel || '—'}</p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Inscripciones:</span> {Array.isArray(programa.inscripciones) ? programa.inscripciones.length : 0}
                        </p>
                        {programa.certificacion && (
                          <p className="text-sm mt-2 inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">Certificación disponible</p>
                        )}
                        {programa.destacado && (
                          <p className="text-sm mt-2 inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 ml-2">Destacado</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              );
            }


            return (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay programas académicos</h3>
                <p className="text-slate-500 mb-6">Comienza creando tu primer curso o programa técnico</p>
                <button
                  onClick={handleCreate}
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
        {mostrarModal && (
          <ProgramaModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            programaSeleccionado={programaSeleccionado}
            formData={nuevoPrograma}
            setFormData={setNuevoPrograma}
            onClose={() => setMostrarModal(false)}
            onSubmit={(e) => modoEdicion ? actualizarPrograma(e) : crearPrograma(e)}
          />
        )}

        {/* Modal de Detalles del Programa */}
        {showDetailModal && selectedProgram && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
              <div className="flex items-start justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">{selectedProgram.nombre}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedProgram.tipo ? String(selectedProgram.tipo).replace('-', ' ') : ''} • {selectedProgram.modalidad}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">{selectedProgram.estado || '—'}</span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">{selectedProgram.certificacion ? 'Con certificación' : 'Sin certificación'}</span>
                    {selectedProgram.destacado && <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Destacado</span>}
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md">
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedProgram.imagen && (
                      <img src={selectedProgram.imagen} alt="Imagen del programa" className="w-full h-44 object-cover rounded-lg mb-4" />
                    )}

                    <p className="text-sm text-slate-700 leading-relaxed">{selectedProgram.descripcion || 'Sin descripción'}</p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      <li><strong className="text-slate-800">Profesor:</strong> {selectedProgram.profesor || '—'}</li>
                      <li><strong className="text-slate-800">Duración:</strong> {selectedProgram.duracion || '—'}</li>
                      <li><strong className="text-slate-800">Precio:</strong> {formatearPrecio(selectedProgram.precio || 0)}</li>
                      <li><strong className="text-slate-800">Cupos disponibles:</strong> {selectedProgram.cuposDisponibles ?? '—'}</li>
                      <li><strong className="text-slate-800">Cupos ocupados:</strong> {selectedProgram.cuposOcupados ?? '—'}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-800">Objetivos</h4>
                      {selectedProgram.objetivos && selectedProgram.objetivos.length > 0 ? (
                        <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                          {selectedProgram.objetivos.map((obj) => (
                            <li key={String(obj)}>{obj}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500 mt-2">Ninguno</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-800">Requisitos</h4>
                      {selectedProgram.requisitos && selectedProgram.requisitos.length > 0 ? (
                        <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                          {selectedProgram.requisitos.map((req) => (
                            <li key={String(req)}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500 mt-2">Ninguno</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-800">Metodología</h4>
                      <p className="text-sm text-slate-700 mt-2">{selectedProgram.metodologia || 'No especificada'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-800">Evaluación</h4>
                      <p className="text-sm text-slate-700 mt-2">{selectedProgram.evaluacion || 'No especificada'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-slate-800">Inscripciones</h4>
                  {selectedProgram.inscripciones && selectedProgram.inscripciones.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {selectedProgram.inscripciones.map((insc) => (
                        <li key={insc._id || insc.usuario?._id || `${String(insc.usuario || '')}-${String(insc.fechaInscripcion || '')}`} className="p-2 rounded-md bg-slate-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-slate-800">{insc.usuario?.nombre || insc.usuario || 'Usuario anónimo'}</div>
                              <div className="text-xs text-slate-500">{insc.fechaInscripcion ? new Date(insc.fechaInscripcion).toLocaleDateString() : ''}</div>
                            </div>
                            <div className="text-sm text-slate-700">{insc.estado}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 mt-2">Ninguna</p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
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

export default Gestionprogramas;
