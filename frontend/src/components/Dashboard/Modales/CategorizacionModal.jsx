import React from "react";
import PropTypes from 'prop-types';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="4sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h3>{modoEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body-admin">
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="nombre-categoria">Nombre:</label>
              <input
                id="nombre-categoria"
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
              <label htmlFor="tipo-categoria">Tipo Categoria:</label>
              <select
                id="tipo-categoria"
                value={modoEdicion ? categoriaSeleccionada?.tipo : nuevaCategoria.tipo}
                onChange={e =>
                  modoEdicion
                    ? setCategoriaSeleccionada({ ...categoriaSeleccionada, tipo: e.target.value })
                    : setNuevaCategoria({ ...nuevaCategoria, tipo: e.target.value })
                }
                required
              >
                <option value="curso">Cursos</option>
                <option value="programa">Programas Técnicos</option>
                <option value="evento">Eventos</option>
                <option value="cabaña">Cabañas</option>
                <option value="solicitud">Solicitudes</option>
                <option value="tarea">Tareas</option>
                <option value="inscripcion">Inscripcion</option>
                <option value="reporte">Reportes</option>
              </select>
            </div>

            <div className="form-grupo-admin">
              <div className="form-grupo-admin">
                <label htmlFor="codigo-categoria">Código:</label>
                <input
                  id="codigo-categoria"
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
            <label htmlFor="estado-categoria">Estado:</label>
            <select
              id="estado-categoria"
              value={modoEdicion ? categoriaSeleccionada?.estado : nuevaCategoria.estado}
              onChange={e =>
                modoEdicion
                  ? setCategoriaSeleccionada({ ...categoriaSeleccionada, estado: e.target.value })
                  : setNuevaCategoria({ ...nuevaCategoria, estado: e.target.value })
              }
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            </div>
          </div>
        </div>
        <div className="modal-action-admin">
          <button className="btn-admin secondary-admin" onClick={onClose}>
            <i className="fas fa-times"></i>{" "}
            Cancelar
          </button>
          <button className="btn-admin btn-primary" onClick={onSubmit}>
            <i className="fas fa-save"></i>{" "}
            {modoEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};


CategorizacionModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  categoriaSeleccionada: PropTypes.shape({
    nombre: PropTypes.string,
    tipo: PropTypes.string,
    codigo: PropTypes.string,
    estado: PropTypes.string
  }),
  setCategoriaSeleccionada: PropTypes.func,
  nuevaCategoria: PropTypes.shape({
    nombre: PropTypes.string,
    tipo: PropTypes.string,
    codigo: PropTypes.string,
    estado: PropTypes.string
  }),
  setNuevaCategoria: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default CategorizacionModal;