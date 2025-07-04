import React, { useState, useEffect } from 'react';
import { programasTecnicosService } from '../../services/programasTecnicosService';
import './ProgramasTecnicos.css';

const ProgramasTecnicos = () => {
  const [programas, setProgramas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    area: '',
    estado: '',
    modalidad: '',
    nivel: ''
  });
  const [estadisticas, setEstadisticas] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [nuevoPrograma, setNuevoPrograma] = useState({
    nombre: '',
    descripcion: '',
    area: 'tecnologia',
    nivel: 'tecnico_laboral',
    duracion: {
      meses: '',
      horas: ''
    },
    modalidad: 'presencial',
    coordinador: '',
    fechaInicio: '',
    fechaFin: '',
    horarios: [],
    cuposDisponibles: '',
    costo: {
      matricula: '',
      mensualidad: '',
      certificacion: ''
    },
    requisitos: {
      academicos: [],
      documentos: [],
      otros: []
    },
    competencias: [],
    modulos: [],
    estado: 'activo'
  });

  useEffect(() => {
    cargarProgramas();
    cargarEstadisticas();
  }, [filtros]);

  const cargarProgramas = async () => {
    try {
      setCargando(true);
      const response = await programasTecnicosService.obtenerProgramasTecnicos(filtros);
      setProgramas(response.data);
    } catch (error) {
      setMensajeError('Error al cargar programas técnicos: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await programasTecnicosService.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const abrirModal = (programa = null) => {
    if (programa) {
      setModoEdicion(true);
      setProgramaSeleccionado(programa);
      setNuevoPrograma({
        ...programa,
        fechaInicio: formatearFechaParaInput(programa.fechaInicio),
        fechaFin: formatearFechaParaInput(programa.fechaFin)
      });
    } else {
      setModoEdicion(false);
      setProgramaSeleccionado(null);
      setNuevoPrograma({
        nombre: '',
        descripcion: '',
        area: 'tecnologia',
        nivel: 'tecnico_laboral',
        duracion: {
          meses: '',
          horas: ''
        },
        modalidad: 'presencial',
        coordinador: '',
        fechaInicio: '',
        fechaFin: '',
        horarios: [],
        cuposDisponibles: '',
        costo: {
          matricula: '',
          mensualidad: '',
          certificacion: ''
        },
        requisitos: {
          academicos: [],
          documentos: [],
          otros: []
        },
        competencias: [],
        modulos: [],
        estado: 'activo'
      });
    }
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
      const partes = campo.split('.');
      if (partes.length === 2) {
        const [padre, hijo] = partes;
        setNuevoPrograma(prev => ({
          ...prev,
          [padre]: {
            ...prev[padre],
            [hijo]: valor
          }
        }));
      } else if (partes.length === 3) {
        const [abuelo, padre, hijo] = partes;
        setNuevoPrograma(prev => ({
          ...prev,
          [abuelo]: {
            ...prev[abuelo],
            [padre]: Array.isArray(prev[abuelo][padre]) 
              ? prev[abuelo][padre] 
              : {
                  ...prev[abuelo][padre],
                  [hijo]: valor
                }
          }
        }));
      }
    } else {
      setNuevoPrograma(prev => ({
        ...prev,
        [campo]: valor
      }));
    }
  };

  const agregarElementoLista = (campo, valor) => {
    if (valor.trim()) {
      const partes = campo.split('.');
      if (partes.length === 2) {
        const [padre, hijo] = partes;
        setNuevoPrograma(prev => ({
          ...prev,
          [padre]: {
            ...prev[padre],
            [hijo]: [...prev[padre][hijo], valor.trim()]
          }
        }));
      } else {
        setNuevoPrograma(prev => ({
          ...prev,
          [campo]: [...prev[campo], valor.trim()]
        }));
      }
    }
  };

  const eliminarElementoLista = (campo, indice) => {
    const partes = campo.split('.');
    if (partes.length === 2) {
      const [padre, hijo] = partes;
      setNuevoPrograma(prev => ({
        ...prev,
        [padre]: {
          ...prev[padre],
          [hijo]: prev[padre][hijo].filter((_, i) => i !== indice)
        }
      }));
    } else {
      setNuevoPrograma(prev => ({
        ...prev,
        [campo]: prev[campo].filter((_, i) => i !== indice)
      }));
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await programasTecnicosService.actualizarProgramaTecnico(programaSeleccionado._id, nuevoPrograma);
        setMensajeExito('Programa técnico actualizado exitosamente');
      } else {
        await programasTecnicosService.crearProgramaTecnico(nuevoPrograma);
        setMensajeExito('Programa técnico creado exitosamente');
      }
      cargarProgramas();
      cargarEstadisticas();
      setTimeout(() => {
        cerrarModal();
      }, 2000);
    } catch (error) {
      setMensajeError(error.message || 'Error al guardar el programa técnico');
    }
  };

  const eliminarPrograma = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este programa técnico?')) {
      try {
        await programasTecnicosService.eliminarProgramaTecnico(id);
        setMensajeExito('Programa técnico eliminado exitosamente');
        cargarProgramas();
        cargarEstadisticas();
      } catch (error) {
        setMensajeError(error.message || 'Error al eliminar el programa técnico');
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
    return <div className="loading">Cargando programas técnicos...</div>;
  }

  return (
    <div className="programas-tecnicos-container">
      <div className="programas-header">
        <h2>Gestión de Programas Técnicos</h2>
        <button className="btn-crear" onClick={() => abrirModal()}>
          Crear Nuevo Programa Técnico
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas-grid">
          <div className="stat-card">
            <h4>Total Programas</h4>
            <p>{estadisticas.totales.programas}</p>
          </div>
          <div className="stat-card">
            <h4>Programas Activos</h4>
            <p>{estadisticas.totales.programasActivos}</p>
          </div>
          <div className="stat-card">
            <h4>En Proceso</h4>
            <p>{estadisticas.totales.programasEnProceso}</p>
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
          value={filtros.area}
          onChange={(e) => manejarCambioFiltro('area', e.target.value)}
        >
          <option value="">Todas las áreas</option>
          <option value="tecnologia">Tecnología</option>
          <option value="administracion">Administración</option>
          <option value="oficios">Oficios</option>
          <option value="arte_diseno">Arte y Diseño</option>
          <option value="salud">Salud</option>
          <option value="otros">Otros</option>
        </select>

        <select
          value={filtros.nivel}
          onChange={(e) => manejarCambioFiltro('nivel', e.target.value)}
        >
          <option value="">Todos los niveles</option>
          <option value="tecnico_laboral">Técnico Laboral</option>
          <option value="tecnico_profesional">Técnico Profesional</option>
          <option value="especializacion_tecnica">Especialización Técnica</option>
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
          <option value="en_proceso">En Proceso</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Tabla de programas */}
      <div className="tabla-container">
        <table className="programas-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Área</th>
              <th>Nivel</th>
              <th>Modalidad</th>
              <th>Coordinador</th>
              <th>Duración</th>
              <th>Cupos</th>
              <th>Fecha Inicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {programas.map(programa => (
              <tr key={programa._id}>
                <td>{programa.nombre}</td>
                <td>{programa.area}</td>
                <td>{programa.nivel.replace('_', ' ')}</td>
                <td>{programa.modalidad}</td>
                <td>{programa.coordinador}</td>
                <td>{programa.duracion.meses} meses</td>
                <td>{programa.cuposOcupados}/{programa.cuposDisponibles}</td>
                <td>{new Date(programa.fechaInicio).toLocaleDateString()}</td>
                <td>
                  <span className={`estado ${programa.estado}`}>
                    {programa.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar" 
                    onClick={() => abrirModal(programa)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => eliminarPrograma(programa._id)}
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
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>{modoEdicion ? 'Editar Programa Técnico' : 'Crear Nuevo Programa Técnico'}</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>×</button>
            </div>

            {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
            {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

            <form onSubmit={manejarEnvio} className="programa-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Programa</label>
                  <input
                    type="text"
                    value={nuevoPrograma.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Coordinador</label>
                  <input
                    type="text"
                    value={nuevoPrograma.coordinador}
                    onChange={(e) => manejarCambio('coordinador', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={nuevoPrograma.descripcion}
                  onChange={(e) => manejarCambio('descripcion', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Área</label>
                  <select
                    value={nuevoPrograma.area}
                    onChange={(e) => manejarCambio('area', e.target.value)}
                    required
                  >
                    <option value="tecnologia">Tecnología</option>
                    <option value="administracion">Administración</option>
                    <option value="oficios">Oficios</option>
                    <option value="arte_diseno">Arte y Diseño</option>
                    <option value="salud">Salud</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nivel</label>
                  <select
                    value={nuevoPrograma.nivel}
                    onChange={(e) => manejarCambio('nivel', e.target.value)}
                    required
                  >
                    <option value="tecnico_laboral">Técnico Laboral</option>
                    <option value="tecnico_profesional">Técnico Profesional</option>
                    <option value="especializacion_tecnica">Especialización Técnica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Modalidad</label>
                  <select
                    value={nuevoPrograma.modalidad}
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
                  <label>Duración (Meses)</label>
                  <input
                    type="number"
                    value={nuevoPrograma.duracion.meses}
                    onChange={(e) => manejarCambio('duracion.meses', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duración (Horas)</label>
                  <input
                    type="number"
                    value={nuevoPrograma.duracion.horas}
                    onChange={(e) => manejarCambio('duracion.horas', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cupos Disponibles</label>
                  <input
                    type="number"
                    value={nuevoPrograma.cuposDisponibles}
                    onChange={(e) => manejarCambio('cuposDisponibles', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={nuevoPrograma.fechaInicio}
                    onChange={(e) => manejarCambio('fechaInicio', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    value={nuevoPrograma.fechaFin}
                    onChange={(e) => manejarCambio('fechaFin', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Costo Matrícula</label>
                  <input
                    type="number"
                    value={nuevoPrograma.costo.matricula}
                    onChange={(e) => manejarCambio('costo.matricula', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Costo Mensualidad</label>
                  <input
                    type="number"
                    value={nuevoPrograma.costo.mensualidad}
                    onChange={(e) => manejarCambio('costo.mensualidad', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Costo Certificación</label>
                  <input
                    type="number"
                    value={nuevoPrograma.costo.certificacion}
                    onChange={(e) => manejarCambio('costo.certificacion', e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {modoEdicion ? 'Actualizar' : 'Crear'} Programa Técnico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramasTecnicos;
