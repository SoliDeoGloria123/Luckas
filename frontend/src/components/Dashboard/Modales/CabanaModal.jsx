
import React from "react";


const CabanaModal = ({
  mostrar,
  modoEdicion,
  cabanaSeleccionada,
  setCabanaSeleccionada,
  nuevaCabana,
  setNuevaCabana,
  onClose,
  onSubmit,
  categorias
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay-admin">
      <div className="modal-admin">
        <div className="modal-header-admin">
          <h3>{modoEdicion ? "Editar Cabaña" : "Crear Nueva Cabaña"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin">
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
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
            <div className="form-grupo-admin">
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
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
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
            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select
                type="text"
                value={modoEdicion ? cabanaSeleccionada?.categoria : nuevaCabana.categoria}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, categoria: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, categoria: e.target.value })
                }
                placeholder="Categoría"
              >
                <option value="">Seleccione...</option>
                {categorias && categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Precio:</label>
              <input
                type="number"
                value={modoEdicion ? cabanaSeleccionada?.precio : nuevaCabana.precio}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, precio: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, precio: e.target.value })
                }
                placeholder="Precio por noche"
                required
              />
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Ubicacion:</label>
                <input
                  type="text"
                  value={nuevaCabana.ubicacion}
                  onChange={e =>
                    setNuevaCabana({ ...nuevaCabana, ubicacion: e.target.value })
                  }
                  placeholder="Ubicación"
                />
              </div>
            )}
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
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
            <div className="form-grupo-admin">
              <label>Imagenes De La Cabaña:</label>
              <input
                type="file"
                name="imagen"
                multiple
                accept="image/*"
                className="input-imagen-multiple"
                onChange={e => {
                  const files = Array.from(e.target.files);
                  if (modoEdicion) {
                    setCabanaSeleccionada({ ...cabanaSeleccionada, imagenes: files });
                  } else {
                    setNuevaCabana({ ...nuevaCabana, imagenes: files });
                  }
                }}
              />


            </div>
          </div>
          <samll style={{ color: "#555", marginTop: "5px" }}>
            Puedes seleccionar varias imágenes manteniendo presionada la tecla Ctrl o Shift
          </samll>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
                 <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
              <i class="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Cabaña"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CabanaModal;