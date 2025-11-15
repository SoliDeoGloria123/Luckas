import React from "react";
import PropTypes from "prop-types";
import ModalWrapper from './common/ModalWrapper';

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

  return (
    <ModalWrapper
      mostrar={mostrar}
      title={modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}
      onClose={onClose}
      onSubmit={onSubmit}
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
            value={getValue('prioridad') || 'media'}
            onChange={e => handleChange('prioridad', e.target.value)}
            required
          >
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="baja">Baja</option>
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
            <option value="en progreso">En Progreso</option>
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