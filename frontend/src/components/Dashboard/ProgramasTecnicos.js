
import React, { useState, useEffect } from 'react';
import { programasTecnicosService } from '../../services/programasTecnicosService';
import TecnicoModal from './Modales/TecnicoModal';
import TecnicoTabla from './Tablas/TecnicoTabla';


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
      <div className="page-header-Academicos">
        <h2>Gestión de Programas Técnicos</h2>
        <button className="btn-primary" onClick={() => abrirModal()}>
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

      {/* Tabla de programas técnicos modularizada */}
      <TecnicoTabla 
        programas={programas}
        abrirModal={abrirModal}
        eliminarPrograma={eliminarPrograma}
      />

      {/* Modal modularizado */}
      <TecnicoModal
        mostrarModal={mostrarModal}
        modoEdicion={modoEdicion}
        cerrarModal={cerrarModal}
        mensajeError={mensajeError}
        mensajeExito={mensajeExito}
        manejarEnvio={manejarEnvio}
        nuevoPrograma={nuevoPrograma}
        manejarCambio={manejarCambio}
      />
    </div>
  );
};

export default ProgramasTecnicos;
