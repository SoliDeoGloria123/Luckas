import React, { useState, useEffect } from 'react';
import { cursosService } from '../../services/cursosService';
import './Cursos.css';

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
      <div className="cursos-header">
        <h2>Gestión de Cursos</h2>
        <button className="btn-crear" onClick={() => abrirModal()}>
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
      <div className="tabla-container">
        <table className="cursos-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Nivel</th>
              <th>Modalidad</th>
              <th>Instructor</th>
              <th>Cupos</th>
              <th>Fecha Inicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso._id}>
                <td>{curso.nombre}</td>
                <td>{curso.categoria}</td>
                <td>{curso.nivel}</td>
                <td>{curso.modalidad}</td>
                <td>{curso.instructor}</td>
                <td>{curso.cuposOcupados}/{curso.cuposDisponibles}</td>
                <td>{new Date(curso.fechaInicio).toLocaleDateString()}</td>
                <td>
                  <span className={`estado ${curso.estado}`}>
                    {curso.estado}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar" 
                    onClick={() => abrirModal(curso)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => eliminarCurso(curso._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {console.log('Estado mostrarModal:', mostrarModal)}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>{modoEdicion ? 'Editar Curso' : 'Crear Nuevo Curso'}</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>×</button>
            </div>

            {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
            {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

            <form onSubmit={manejarEnvio} className="curso-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Curso</label>
                  <input
                    type="text"
                    value={nuevoCurso.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    type="text"
                    value={nuevoCurso.instructor}
                    onChange={(e) => manejarCambio('instructor', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={nuevoCurso.descripcion}
                  onChange={(e) => manejarCambio('descripcion', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={nuevoCurso.categoria}
                    onChange={(e) => manejarCambio('categoria', e.target.value)}
                    required
                  >
                    <option value="biblico">Bíblico</option>
                    <option value="ministerial">Ministerial</option>
                    <option value="liderazgo">Liderazgo</option>
                    <option value="evangelismo">Evangelismo</option>
                    <option value="pastoral">Pastoral</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nivel</label>
                  <select
                    value={nuevoCurso.nivel}
                    onChange={(e) => manejarCambio('nivel', e.target.value)}
                    required
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Modalidad</label>
                  <select
                    value={nuevoCurso.modalidad}
                    onChange={(e) => manejarCambio('modalidad', e.target.value)}
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="semipresencial">Semipresencial</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Horas de Duración</label>
                  <input
                    type="number"
                    value={nuevoCurso.duracion.horas}
                    onChange={(e) => manejarCambio('duracion.horas', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Semanas</label>
                  <input
                    type="number"
                    value={nuevoCurso.duracion.semanas}
                    onChange={(e) => manejarCambio('duracion.semanas', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cupos Disponibles</label>
                  <input
                    type="number"
                    value={nuevoCurso.cuposDisponibles}
                    onChange={(e) => manejarCambio('cuposDisponibles', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Costo</label>
                  <input
                    type="number"
                    value={nuevoCurso.costo}
                    onChange={(e) => manejarCambio('costo', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={nuevoCurso.fechaInicio}
                    onChange={(e) => manejarCambio('fechaInicio', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    value={nuevoCurso.fechaFin}
                    onChange={(e) => manejarCambio('fechaFin', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hora de Inicio</label>
                  <input
                    type="time"
                    value={nuevoCurso.horario.horaInicio}
                    onChange={(e) => manejarCambio('horario.horaInicio', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora de Fin</label>
                  <input
                    type="time"
                    value={nuevoCurso.horario.horaFin}
                    onChange={(e) => manejarCambio('horario.horaFin', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Días de la Semana</label>
                <div className="dias-checkbox">
                  {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                    <label key={dia} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={nuevoCurso.horario.dias.includes(dia)}
                        onChange={() => manejarCambioDias(dia)}
                      />
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {modoEdicion ? 'Actualizar' : 'Crear'} Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cursos;
