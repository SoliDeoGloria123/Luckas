import React from "react";

const InscripcionModalEditar = ({ mostrar, inscripcion, setInscripcion, onClose, onSubmit, eventos, categorias }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    setInscripcion({ ...inscripcion, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(inscripcion);
  };

  if (!mostrar) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin">
          <h3>Editar Inscripción</h3>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input name="nombre" value={inscripcion.nombre || ""} onChange={handleChange} placeholder="Nombre" />
            </div>
            <div className="form-grupo-admin">
              <label>Apellido:</label>
              <input name="apellido" value={inscripcion.apellido || ""} onChange={handleChange} placeholder="Apellido" />
            </div>
            <div className="form-grupo-admin">
              <label>Tipo de Documento:</label>
              <input name="tipoDocumento" value={inscripcion.tipoDocumento || ""} onChange={handleChange} placeholder="Tipo de Documento" />
            </div>
            <div className="form-grupo-admin">
              <label>Número de Documento:</label>
              <input name="numeroDocumento" value={inscripcion.numeroDocumento || ""} onChange={handleChange} placeholder="Número de Documento" />
            </div>
            <div className="form-grupo-admin">
              <label>Correo:</label>
              <input name="correo" value={inscripcion.correo || ""} onChange={handleChange} placeholder="Correo" />
            </div>
            <div className="form-grupo-admin">
              <label>Teléfono:</label>
              <input name="telefono" value={inscripcion.telefono || ""} onChange={handleChange} placeholder="Teléfono" />
            </div>
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input name="edad" value={inscripcion.edad || ""} onChange={handleChange} placeholder="Edad" />
            </div>
            <div className="form-grupo-admin">
              <label>Evento:</label>
              <select name="evento" value={inscripcion.evento || ""} onChange={handleChange}>
                <option value="">Seleccione evento</option>
                {eventos.map(ev => <option key={ev._id} value={ev._id}>{ev.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select name="categoria" value={inscripcion.categoria || ""} onChange={handleChange}>
                <option value="">Seleccione categoría</option>
                {categorias.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <input name="estado" value={inscripcion.estado || ""} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-grupo-admin">
              <label>Observaciones:</label>
              <input name="observaciones" value={inscripcion.observaciones || ""} onChange={handleChange} placeholder="Observaciones" />
            </div>
          </div>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionModalEditar;
