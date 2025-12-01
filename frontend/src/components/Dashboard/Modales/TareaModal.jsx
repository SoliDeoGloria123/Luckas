import React from "react";
import PropTypes from "prop-types";
import ModalWrapper from './common/ModalWrapper';
import { mostrarAlerta } from "../../utils/alertas";

const TareaModal = ({
  mostrar,
  modoEdicion,
  tareaSeleccionada,
  setTareaSeleccionada,
  nuevaTarea,
  setNuevaTarea,
  onClose,
  onSubmit,
  usuarios
}) => {
  const getValue = (field) => (modoEdicion ? tareaSeleccionada?.[field] : nuevaTarea[field]);

  const handleChange = (field, value) => {
    if (modoEdicion) {
      setTareaSeleccionada({ ...tareaSeleccionada, [field]: value });
    } else {
      setNuevaTarea({ ...nuevaTarea, [field]: value });
    }
  };

  // Helper: fecha mínima (hoy) en formato yyyy-mm-dd
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Validación local del submit: asegurar fecha límite en futuro (>= hoy)
  const handleSubmitInternal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const fecha = getValue('fechaLimite');
    if (!fecha) {
      // campo requerido en el form, dejar que el navegador lo valide
      if (onSubmit) onSubmit(e);
      return;
    }
    try {
      const fechaSel = new Date(fecha);
      const hoy = new Date();
      // normalizar horas a 00:00 para comparar solo fecha
      fechaSel.setHours(0,0,0,0);
      hoy.setHours(0,0,0,0);
      if (fechaSel < hoy) {
        // Usar mostrarAlerta con título y mensaje para consistencia
        mostrarAlerta('Error', 'La fecha límite debe ser hoy o en el futuro. Por favor elija una fecha válida.');
        return;
      }
    } catch (err) {
      console.error('Error validando fecha límite:', err);
      // si hay error, prevenir submit por seguridad
      return;
    }

    if (onSubmit) onSubmit(e);
  };

  return (
    <ModalWrapper
      mostrar={mostrar}
      title={modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}
      onClose={onClose}
      onSubmit={handleSubmitInternal}
      submitLabel={modoEdicion ? 'Guardar Cambios' : 'Crear Tarea'}
      submitIcon="fas fa-save"
    >
      <div className="from-grid-admin">
        {/* Título */}
        <div className="form-grupo-admin">
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            type="text"
            value={getValue('titulo') || ''}
            onChange={e => handleChange('titulo', e.target.value)}
            placeholder="Título de la tarea"
            required
          />
        </div>
        {/* Fecha Límite */}
        <div className="form-grupo-admin">
          <label htmlFor="fechaLimite">Fecha Límite:</label>
          <input
            id="fechaLimite"
            type="date"
            value={getValue('fechaLimite') || ''}
            onChange={e => handleChange('fechaLimite', e.target.value)}
            required
            min={getTodayString()}
          />
        </div>
      </div>

      <div className="from-grid-admin">
        {/* Asignado A */}
        <div className="form-grupo-admin">
          <label htmlFor="asignadoA">Asignado a:</label>
          <select
            id="asignadoA"
            value={getValue('asignadoA') || ''}
            onChange={e => handleChange('asignadoA', e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            {usuarios && usuarios.map(user => (
              <option key={user._id} value={user._id}>
                {user.nombre} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="form-grupo-admin">
          <label htmlFor="asignadoPor">Asignado por:</label>
          <select
            id="asignadoPor"
            value={getValue('asignadoPor') || ''}
            onChange={e => handleChange('asignadoPor', e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            {usuarios && usuarios.map(user => (
              <option key={user._id} value={user._id}>
                {user.nombre} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="from-grid-admin">
        {/* Prioridad */}
        <div className="form-grupo-admin">
          <label htmlFor="prioridad">Prioridad:</label>
          <select
            id="prioridad"
            value={getValue('prioridad') || 'Media'}
            onChange={e => handleChange('prioridad', e.target.value)}
            required
          >
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Estado */}
        <div className="form-grupo-admin">
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            value={getValue('estado') || 'pendiente'}
            onChange={e => handleChange('estado', e.target.value)}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="form-grupo-admin">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={getValue('descripcion') || ''}
          onChange={e => handleChange('descripcion', e.target.value)}
          placeholder="Descripción de la tarea"
          required
        />
      </div>
    </ModalWrapper>
  );
};

TareaModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  tareaSeleccionada: PropTypes.shape({
    titulo: PropTypes.string,
    fechaLimite: PropTypes.string,
    asignadoA: PropTypes.string,
    asignadoPor: PropTypes.string,
    prioridad: PropTypes.string,
    estado: PropTypes.string,
    descripcion: PropTypes.string
  }),
  setTareaSeleccionada: PropTypes.func,
  nuevaTarea: PropTypes.shape({
    titulo: PropTypes.string,
    fechaLimite: PropTypes.string,
    asignadoA: PropTypes.string,
    asignadoPor: PropTypes.string,
    prioridad: PropTypes.string,
    estado: PropTypes.string,
    descripcion: PropTypes.string
  }).isRequired,
  setNuevaTarea: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    role: PropTypes.string
  })).isRequired
};

export default TareaModal;