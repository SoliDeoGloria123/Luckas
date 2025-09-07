import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionProgramasAcademicosAdmin = () => {
  const [programas, setProgramas] = useState([]);
  const [filtros, setFiltros] = useState({ busqueda: '', tipo: 'todos', estado: 'todos' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [nuevoPrograma, setNuevoPrograma] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'curso', // 'curso' o 'programa-tecnico'
    duracion: '',
    precio: '',
    capacidadMaxima: '',
    fechaInicio: '',
    fechaFin: '',
    instructor: '',
    requisitos: '',
    modalidad: 'presencial', // 'presencial', 'virtual', 'mixta'
    categoria: '',
    imagen: '',
    estado: 'activo',
    contenido: [{ modulo: '', descripcion: '', duracion: '' }]
  });

  useEffect(() => {
    obtenerProgramas();
  }, []);

  const obtenerProgramas = async () => {
    setCargando(true);
    try {
      // Obtener cursos
      const cursosRes = await fetch('http://localhost:3001/api/cursos', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Obtener programas técnicos
      const programasRes = await fetch('http://localhost:3001/api/programas-tecnicos', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (cursosRes.ok && programasRes.ok) {
        const cursosData = await cursosRes.json();
        const programasData = await programasRes.json();
        
        const cursosConTipo = (cursosData.data || []).map(curso => ({ ...curso, tipo: 'curso' }));
        const programasConTipo = (programasData.data || []).map(programa => ({ ...programa, tipo: 'programa-tecnico' }));
        
        setProgramas([...cursosConTipo, ...programasConTipo]);
      }
    } catch (error) {
      console.error('Error al obtener programas:', error);
      mostrarAlerta('Error', 'No se pudieron cargar los programas académicos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const crearPrograma = async () => {
    try {
      const endpoint = nuevoPrograma.tipo === 'curso' 
        ? 'http://localhost:3001/api/cursos'
        : 'http://localhost:3001/api/programas-tecnicos';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevoPrograma)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', `${nuevoPrograma.tipo === 'curso' ? 'Curso' : 'Programa Técnico'} creado exitosamente`);
        setMostrarModal(false);
        resetFormulario();
        obtenerProgramas();
      } else {
        throw new Error('Error al crear el programa');
      }
    } catch (error) {
      mostrarAlerta('Error', `Error al crear el ${nuevoPrograma.tipo}`, 'error');
    }
  };

  const actualizarPrograma = async () => {
    try {
      const endpoint = programaSeleccionado.tipo === 'curso'
        ? `http://localhost:3001/api/cursos/${programaSeleccionado._id}`
        : `http://localhost:3001/api/programas-tecnicos/${programaSeleccionado._id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(programaSeleccionado)
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Programa actualizado exitosamente');
        setMostrarModal(false);
        setProgramaSeleccionado(null);
        setModoEdicion(false);
        obtenerProgramas();
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al actualizar el programa', 'error');
    }
  };

  const eliminarPrograma = async (programa) => {
    const confirmado = await mostrarConfirmacion(
      '¿Estás seguro?',
      `Esta acción eliminará el ${programa.tipo} "${programa.nombre}" permanentemente.`
    );

    if (!confirmado) return;

    try {
      const endpoint = programa.tipo === 'curso'
        ? `http://localhost:3001/api/cursos/${programa._id}`
        : `http://localhost:3001/api/programas-tecnicos/${programa._id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        mostrarAlerta('¡Éxito!', 'Programa eliminado exitosamente');
        obtenerProgramas();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Error al eliminar el programa', 'error');
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    resetFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (programa) => {
    setModoEdicion(true);
    setProgramaSeleccionado({ ...programa });
    setMostrarModal(true);
  };

  const resetFormulario = () => {
    setNuevoPrograma({
      nombre: '',
      descripcion: '',
      tipo: 'curso',
      duracion: '',
      precio: '',
      capacidadMaxima: '',
      fechaInicio: '',
      fechaFin: '',
      instructor: '',
      requisitos: '',
      modalidad: 'presencial',
      categoria: '',
      imagen: '',
      estado: 'activo',
      contenido: [{ modulo: '', descripcion: '', duracion: '' }]
    });
  };

  const programasFiltrados = programas.filter(programa => {
    const cumpleBusqueda = programa.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          programa.instructor?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleTipo = filtros.tipo === 'todos' || programa.tipo === filtros.tipo;
    const cumpleEstado = filtros.estado === 'todos' || programa.estado === filtros.estado;
    
    return cumpleBusqueda && cumpleTipo && cumpleEstado;
  });

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Programas Académicos</h1>
          <p className="text-slate-600">Administra cursos y programas técnicos del seminario</p>
        </div>
        <button
          onClick={abrirModalCrear}
          className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Programa</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar programas..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los tipos</option>
            <option value="curso">Cursos</option>
            <option value="programa-tecnico">Programas Técnicos</option>
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="borrador">Borrador</option>
          </select>

          <div className="text-sm text-slate-600 flex items-center">
            <span className="font-medium">{programasFiltrados.length}</span> programa(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Lista de Programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando programas académicos...</p>
          </div>
        ) : programasFiltrados.length > 0 ? (
          programasFiltrados.map((programa) => (
            <div key={programa._id} className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Header del programa */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    programa.tipo === 'curso' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                      : 'bg-gradient-to-r from-purple-600 to-violet-600'
                  }`}>
                    {programa.tipo === 'curso' ? (
                      <BookOpen className="w-6 h-6 text-white" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                      programa.tipo === 'curso' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {programa.tipo === 'curso' ? 'Curso' : 'Programa Técnico'}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${
                      programa.estado === 'activo' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : programa.estado === 'inactivo' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {programa.estado}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => abrirModalEditar(programa)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => eliminarPrograma(programa)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
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
          ))
        ) : (
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
        )}
      </div>

      {/* Modal para crear/editar programa */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {modoEdicion ? 'Editar Programa Académico' : 'Nuevo Programa Académico'}
                </h2>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setProgramaSeleccionado(null);
                    setModoEdicion(false);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100/80"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Programa *
                  </label>
                  <select
                    value={modoEdicion ? programaSeleccionado?.tipo : nuevoPrograma.tipo}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, tipo: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, tipo: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="curso">Curso</option>
                    <option value="programa-tecnico">Programa Técnico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={modoEdicion ? programaSeleccionado?.estado : nuevoPrograma.estado}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, estado: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, estado: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="borrador">Borrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Programa *
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? programaSeleccionado?.nombre || '' : nuevoPrograma.nombre}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, nombre: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, nombre: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej: Fundamentos de Teología"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? programaSeleccionado?.instructor || '' : nuevoPrograma.instructor}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, instructor: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, instructor: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Nombre del instructor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? programaSeleccionado?.precio || '' : nuevoPrograma.precio}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, precio: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, precio: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    value={modoEdicion ? programaSeleccionado?.capacidadMaxima || '' : nuevoPrograma.capacidadMaxima}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, capacidadMaxima: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, capacidadMaxima: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Número de estudiantes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={modoEdicion ? programaSeleccionado?.duracion || '' : nuevoPrograma.duracion}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, duracion: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, duracion: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej: 3 meses, 40 horas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Modalidad
                  </label>
                  <select
                    value={modoEdicion ? programaSeleccionado?.modalidad || 'presencial' : nuevoPrograma.modalidad}
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, modalidad: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, modalidad: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="mixta">Mixta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={modoEdicion ? 
                      (programaSeleccionado?.fechaInicio ? programaSeleccionado.fechaInicio.split('T')[0] : '') : 
                      nuevoPrograma.fechaInicio
                    }
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, fechaInicio: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, fechaInicio: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={modoEdicion ? 
                      (programaSeleccionado?.fechaFin ? programaSeleccionado.fechaFin.split('T')[0] : '') : 
                      nuevoPrograma.fechaFin
                    }
                    onChange={(e) => {
                      if (modoEdicion) {
                        setProgramaSeleccionado({ ...programaSeleccionado, fechaFin: e.target.value });
                      } else {
                        setNuevoPrograma({ ...nuevoPrograma, fechaFin: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={modoEdicion ? programaSeleccionado?.descripcion || '' : nuevoPrograma.descripcion}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setProgramaSeleccionado({ ...programaSeleccionado, descripcion: e.target.value });
                    } else {
                      setNuevoPrograma({ ...nuevoPrograma, descripcion: e.target.value });
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Describe el programa académico, objetivos y metodología..."
                />
              </div>

              {/* Requisitos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requisitos
                </label>
                <textarea
                  value={modoEdicion ? programaSeleccionado?.requisitos || '' : nuevoPrograma.requisitos}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setProgramaSeleccionado({ ...programaSeleccionado, requisitos: e.target.value });
                    } else {
                      setNuevoPrograma({ ...nuevoPrograma, requisitos: e.target.value });
                    }
                  }}
                  rows={3}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Requisitos previos para el programa..."
                />
              </div>

              {/* URL de imagen */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={modoEdicion ? programaSeleccionado?.imagen || '' : nuevoPrograma.imagen}
                  onChange={(e) => {
                    if (modoEdicion) {
                      setProgramaSeleccionado({ ...programaSeleccionado, imagen: e.target.value });
                    } else {
                      setNuevoPrograma({ ...nuevoPrograma, imagen: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="sticky bottom-0 glass-card border-t border-white/20 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setProgramaSeleccionado(null);
                    setModoEdicion(false);
                  }}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100/80 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={modoEdicion ? actualizarPrograma : crearPrograma}
                  className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'} Programa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProgramasAcademicosAdmin;
