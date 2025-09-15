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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>{modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin">
          <div className="from-grid-admin">
            {/* Título */}
            <div className="form-grupo-admin">
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
            {/* Fecha Límite */}
            <div className="form-grupo-admin">
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
          </div>
          <div className="from-grid-admin">

            {/* Asignado A */}
            <div className="form-grupo-admin">
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


            <div className="form-grupo-admin">
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
          </div>
          <div className="from-grid-admin">
            {/* Prioridad */}
            <div className="form-grupo-admin">
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
            <div className="form-grupo-admin">
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
          <div className="form-grupo-admin">
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
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
               <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
                    <i class="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TareaModal;