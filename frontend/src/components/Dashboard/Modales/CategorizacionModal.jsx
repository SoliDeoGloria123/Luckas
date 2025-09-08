import React from "react";

const CategorizacionModal = ({
  mostrar,
  modoEdicion,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  nuevaCategoria,
  setNuevaCategoria,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay-admin">
      <div className="modal-admin">
        <div className="modal-header-admin">
          <h3>{modoEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body-admin">
           <div className="from-grid-admin">
          <div className="form-grupo-admin">
            <label>Nombre:</label>
            <input
              type="text"
              value={modoEdicion ? categoriaSeleccionada?.nombre : nuevaCategoria.nombre}
              onChange={e =>
                modoEdicion
                  ? setCategoriaSeleccionada({ ...categoriaSeleccionada, nombre: e.target.value })
                  : setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })
              }
              placeholder="Nombre de la categoría"
              required
            />
          </div>
          <div className="form-grupo-admin">
            <label>Código:</label>
            <input
              type="text"
              value={modoEdicion ? categoriaSeleccionada?.codigo : nuevaCategoria.codigo}
              onChange={e =>
                modoEdicion
                  ? setCategoriaSeleccionada({ ...categoriaSeleccionada, codigo: e.target.value })
                  : setNuevaCategoria({ ...nuevaCategoria, codigo: e.target.value })
              }
              placeholder="Código único"
              required
            />
          </div>
          </div>
          <div className="form-grupo-admin">
            <label>Activo:</label>
            <select
              value={modoEdicion ? categoriaSeleccionada?.activo : nuevaCategoria.activo}
              onChange={e =>
                modoEdicion
                  ? setCategoriaSeleccionada({ ...categoriaSeleccionada, activo: e.target.value === "true" })
                  : setNuevaCategoria({ ...nuevaCategoria, activo: e.target.value === "true" })
              }
            >
              <option value="true">Activo</option>
              <option value="false">Desactivado</option>
            </select>
        </div>
        </div>
        <div className="modal-action-admin">
          <button className="btn-admin secondary-admin" onClick={onClose}>
             <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button className="btn-admin btn-primary" onClick={onSubmit}>
            <i class="fas fa-save"></i>
            {modoEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorizacionModal;