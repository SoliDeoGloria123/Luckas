import React from "react";

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
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {/* Título */}
          <div className="form-grupo">
            <label>Título:</label>
            <input
              type="text"
              value={modoEdicion ? tareaSeleccionada?.titulo : nuevaTarea.titulo}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, titulo: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
              }
              placeholder="Título de la tarea"
              required
            />
          </div>

          {/* Descripción */}
          <div className="form-grupo">
            <label>Descripción:</label>
            <textarea
              value={modoEdicion ? tareaSeleccionada?.descripcion : nuevaTarea.descripcion}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, descripcion: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })
              }
              placeholder="Descripción de la tarea"
              required
            />
          </div>

          {/* Fecha Límite */}
          <div className="form-grupo">
            <label>Fecha Límite:</label>
            <input
              type="date"
              value={modoEdicion ? tareaSeleccionada?.fechaLimite : nuevaTarea.fechaLimite}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, fechaLimite: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })
              }
              required
            />
          </div>

          {/* Asignado A */}
          <div className="form-grupo">
            <label>Asignado a:</label>
            <select
              value={modoEdicion ? tareaSeleccionada?.asignadoA : nuevaTarea.asignadoA}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, asignadoA: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, asignadoA: e.target.value })
              }
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


          <div className="form-grupo">
            <label>Asignado por:</label>
            <select
              value={modoEdicion ? tareaSeleccionada?.asignadoPor : nuevaTarea.asignadoPor}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, asignadoPor: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, asignadoPor: e.target.value })
              }
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

          {/* Prioridad */}
          <div className="form-grupo">
            <label>Prioridad:</label>
            <select
              value={modoEdicion ? tareaSeleccionada?.prioridad : nuevaTarea.prioridad}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, prioridad: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })
              }
              required
            >
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          {/* Estado */}
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? tareaSeleccionada?.estado : nuevaTarea.estado}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, estado: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, estado: e.target.value })
              }
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaModal;