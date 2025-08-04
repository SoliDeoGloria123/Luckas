import React, { useState, useEffect } from 'react';
import { cursosService } from '../../services/cursosService';
import CursoModal from './Modales/CursoModal';
import CursoTabla from './Tablas/CursoTabla';


const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    estado: '',
    modalidad: '',
    nivel: ''
  });
  const [estadisticas, setEstadisticas] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoCurso, setNuevoCurso] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'biblico',
    nivel: 'basico',
    duracion: {
      horas: '',
      semanas: ''
    },
    modalidad: 'presencial',
    instructor: '',
    fechaInicio: '',
    fechaFin: '',
    horario: {
      dias: [],
      horaInicio: '',
      horaFin: ''
    },
    cuposDisponibles: '',
    costo: '',
    requisitos: [],
    material: [],
    estado: 'activo'
  });

  useEffect(() => {
    cargarCursos();
    cargarEstadisticas();
  }, [filtros]);

  const cargarCursos = async () => {
    try {
      setCargando(true);
      const response = await cursosService.obtenerCursos(filtros);
      setCursos(response.data);
    } catch (error) {
      setMensajeError('Error al cargar cursos: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await cursosService.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const abrirModal = (curso = null) => {
    console.log('abrirModal llamado con:', curso);
    if (curso) {
      setModoEdicion(true);
      setCursoSeleccionado(curso);
      setNuevoCurso({
        ...curso,
        fechaInicio: formatearFechaParaInput(curso.fechaInicio),
        fechaFin: formatearFechaParaInput(curso.fechaFin)
      });
    } else {
      setModoEdicion(false);
      setCursoSeleccionado(null);
      setNuevoCurso({
        nombre: '',
        descripcion: '',
        categoria: 'biblico',
        nivel: 'basico',
        duracion: {
          horas: '',
          semanas: ''
        },
        modalidad: 'presencial',
        instructor: '',
        fechaInicio: '',
        fechaFin: '',
        horario: {
          dias: [],
          horaInicio: '',
          horaFin: ''
        },
        cuposDisponibles: '',
        costo: '',
        requisitos: [],
        material: [],
        estado: 'activo'
      });
    }
    console.log('Estableciendo mostrarModal a true');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMensajeError('');
    setMensajeExito('');
  };

  const formatearFechaParaInput = (fecha) => {
    return new Date(fecha).toISOString().split('T')[0];
  };

  const manejarCambio = (campo, valor) => {
    if (campo.includes('.')) {
      const [padre, hijo] = campo.split('.');
      setNuevoCurso(prev => ({
        ...prev,
        [padre]: {
          ...prev[padre],
          [hijo]: valor
        }
      }));
    } else {
      setNuevoCurso(prev => ({
        ...prev,
        [campo]: valor
      }));
    }
  };

  const manejarCambioDias = (dia) => {
    const diasActuales = nuevoCurso.horario.dias;
    const nuevosDias = diasActuales.includes(dia)
      ? diasActuales.filter(d => d !== dia)
      : [...diasActuales, dia];
    
    manejarCambio('horario.dias', nuevosDias);
  };

  const agregarElementoLista = (campo, valor) => {
    if (valor.trim()) {
      setNuevoCurso(prev => ({
        ...prev,
        [campo]: [...prev[campo], valor.trim()]
      }));
    }
  };

  const eliminarElementoLista = (campo, indice) => {
    setNuevoCurso(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== indice)
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await cursosService.actualizarCurso(cursoSeleccionado._id, nuevoCurso);
        setMensajeExito('Curso actualizado exitosamente');
      } else {
        await cursosService.crearCurso(nuevoCurso);
        setMensajeExito('Curso creado exitosamente');
      }
      cargarCursos();
      cargarEstadisticas();
      setTimeout(() => {
        cerrarModal();
      }, 2000);
    } catch (error) {
      setMensajeError(error.message || 'Error al guardar el curso');
    }
  };

  const eliminarCurso = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await cursosService.eliminarCurso(id);
        setMensajeExito('Curso eliminado exitosamente');
        cargarCursos();
        cargarEstadisticas();
      } catch (error) {
        setMensajeError(error.message || 'Error al eliminar el curso');
      }
    }
  };

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  if (cargando) {
    return <div className="loading">Cargando cursos...</div>;
  }

  return (
    <div className="cursos-container">
      <div className="page-header-Academicos">
        <h1 className="titulo-admin">Gestión de Cursos</h1>
        <button className="btn-admin" onClick={() => abrirModal()}>
          Crear Nuevo Curso
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas-grid">
          <div className="stat-card">
            <h4>Total Cursos</h4>
            <p>{estadisticas.totales.cursos}</p>
          </div>
          <div className="stat-card">
            <h4>Cursos Activos</h4>
            <p>{estadisticas.totales.cursosActivos}</p>
          </div>
          <div className="stat-card">
            <h4>Finalizados</h4>
            <p>{estadisticas.totales.cursosFinalizados}</p>
          </div>
          <div className="stat-card">
            <h4>Total Inscripciones</h4>
            <p>{estadisticas.totales.inscripciones}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros-container">
        <select
          value={filtros.categoria}
          onChange={(e) => manejarCambioFiltro('categoria', e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="biblico">Bíblico</option>
          <option value="ministerial">Ministerial</option>
          <option value="liderazgo">Liderazgo</option>
          <option value="evangelismo">Evangelismo</option>
          <option value="pastoral">Pastoral</option>
          <option value="otros">Otros</option>
        </select>

        <select
          value={filtros.nivel}
          onChange={(e) => manejarCambioFiltro('nivel', e.target.value)}
        >
          <option value="">Todos los niveles</option>
          <option value="basico">Básico</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <select
          value={filtros.modalidad}
          onChange={(e) => manejarCambioFiltro('modalidad', e.target.value)}
        >
          <option value="">Todas las modalidades</option>
          <option value="presencial">Presencial</option>
          <option value="virtual">Virtual</option>
          <option value="semipresencial">Semipresencial</option>
        </select>

        <select
          value={filtros.estado}
          onChange={(e) => manejarCambioFiltro('estado', e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Tabla de cursos */}
      <CursoTabla
        cursos={cursos}
        abrirModal={abrirModal}
        eliminarCurso={eliminarCurso}
      />

      {/* Modal */}
      <CursoModal
        mostrarModal={mostrarModal}
        modoEdicion={modoEdicion}
        cerrarModal={cerrarModal}
        mensajeError={mensajeError}
        mensajeExito={mensajeExito}
        manejarEnvio={manejarEnvio}
        nuevoCurso={nuevoCurso}
        manejarCambio={manejarCambio}
        manejarCambioDias={manejarCambioDias}
      />
    </div>
  );
};

export default Cursos;
