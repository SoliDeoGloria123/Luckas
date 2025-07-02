
import React from "react";


const CabanaModal = ({
    mostrar,
    modoEdicion,
    cabanaSeleccionada,
    setCabanaSeleccionada,
    nuevaCabana,
    setNuevaCabana,
    onClose,
    onSubmit
}) => {
  if (!mostrar) return null;

  return (
   <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Cabaña" : "Crear Nueva Cabaña"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Nombre:</label>
            <input
              type="text"
              value={modoEdicion ? cabanaSeleccionada?.nombre : nuevaCabana.nombre}
              onChange={e =>
                modoEdicion
                  ? setCabanaSeleccionada({ ...cabanaSeleccionada, nombre: e.target.value })
                  : setNuevaCabana({ ...nuevaCabana, nombre: e.target.value })
              }
              placeholder="Nombre de la cabaña"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Descripción:</label>
            <input
              type="text"
              value={modoEdicion ? cabanaSeleccionada?.descripcion : nuevaCabana.descripcion}
              onChange={e =>
                modoEdicion
                  ? setCabanaSeleccionada({ ...cabanaSeleccionada, descripcion: e.target.value })
                  : setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value })
              }
              placeholder="Descripción"
            />
          </div>
          <div className="form-grupo">
            <label>Capacidad:</label>
            <input
              type="number"
              value={modoEdicion ? cabanaSeleccionada?.capacidad : nuevaCabana.capacidad}
              onChange={e =>
                modoEdicion
                  ? setCabanaSeleccionada({ ...cabanaSeleccionada, capacidad: e.target.value })
                  : setNuevaCabana({ ...nuevaCabana, capacidad: e.target.value })
              }
              placeholder="Capacidad"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Categoría:</label>
            <input
              type="text"
              value={modoEdicion ? cabanaSeleccionada?.categoria : nuevaCabana.categoria}
              onChange={e =>
                modoEdicion
                  ? setCabanaSeleccionada({ ...cabanaSeleccionada, categoria: e.target.value })
                  : setNuevaCabana({ ...nuevaCabana, categoria: e.target.value })
              }
              placeholder="Categoría"
            />
          </div>
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? cabanaSeleccionada?.estado : nuevaCabana.estado}
              onChange={e =>
                modoEdicion
                  ? setCabanaSeleccionada({ ...cabanaSeleccionada, estado: e.target.value })
                  : setNuevaCabana({ ...nuevaCabana, estado: e.target.value })
              }
              required
            >
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Cabaña"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabanaModal;