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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
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
          <div className="form-grupo">
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
          <div className="form-grupo">
            <label>Descripción:</label>
            <input
              type="text"
              value={modoEdicion ? categoriaSeleccionada?.descripcion : nuevaCategoria.descripcion}
              onChange={e =>
                modoEdicion
                  ? setCategoriaSeleccionada({ ...categoriaSeleccionada, descripcion: e.target.value })
                  : setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })
              }
              placeholder="Descripción"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorizacionModal;