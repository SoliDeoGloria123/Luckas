import React from "react";


import { useEffect } from "react";

const InscripcionModalEditar = ({ mostrar, inscripcion, setInscripcion, onClose, onSubmit, eventos, programas = [], categorias }) => {
  // Sincroniza tipoReferencia y referencia si la inscripción viene con objeto en referencia
  useEffect(() => {
    if (!inscripcion) return;
    // Si referencia es un objeto, extrae el id
    if (typeof inscripcion.referencia === "object" && inscripcion.referencia !== null && inscripcion.referencia._id) {
      setInscripcion(prev => ({
        ...prev,
        referencia: inscripcion.referencia._id
      }));
    }
    // Si tipoReferencia no está seteado pero hay evento o programa, lo infiere
    if (!inscripcion.tipoReferencia) {
      if (inscripcion.evento) {
        setInscripcion(prev => ({ ...prev, tipoReferencia: "Eventos", referencia: inscripcion.evento._id || inscripcion.evento }));
      } else if (inscripcion.programa) {
        setInscripcion(prev => ({ ...prev, tipoReferencia: "ProgramaAcademico", referencia: inscripcion.programa._id || inscripcion.programa }));
      }
    }
  }, [inscripcion, setInscripcion]);
  const handleChange = e => {
    const { name, value } = e.target;
    // Si cambia la referencia, actualiza la categoría automáticamente
    if (name === "referencia") {
      if (inscripcion.tipoReferencia === "Eventos") {
        const eventoSel = eventos.find(ev => String(ev._id) === String(value));
        if (eventoSel && eventoSel.categoria) {
          setInscripcion({
            ...inscripcion,
            [name]: String(value),
            categoria: String(eventoSel.categoria._id || eventoSel.categoria)
          });
          return;
        }
      } else if (inscripcion.tipoReferencia === "ProgramaAcademico") {
        const progSel = programas.find(pr => String(pr._id) === String(value));
        if (progSel && progSel.categoria) {
          setInscripcion({
            ...inscripcion,
            [name]: String(value),
            categoria: String(progSel.categoria._id || progSel.categoria)
          });
          return;
        }
      }
    }
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
              <label>Tipo de inscripción:</label>
              <select
                name="tipoReferencia"
                value={inscripcion.tipoReferencia || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione tipo</option>
                <option value="Eventos">Evento</option>
                <option value="ProgramaAcademico">Programa académico</option>
              </select>
            </div>

            {inscripcion.tipoReferencia === "Eventos" && (
              <div className="form-grupo-admin">
                <label>Evento:</label>
                <select
                  name="referencia"
                  value={inscripcion.referencia || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione evento</option>
                  {eventos.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {inscripcion.tipoReferencia === "ProgramaAcademico" && (
              <div className="form-grupo-admin">
                <label>Programa académico:</label>
                <select
                  name="referencia"
                  value={inscripcion.referencia || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione programa</option>
                  {programas.map(pr => (
                    <option key={pr._id} value={pr._id}>{pr.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select name="categoria" value={inscripcion.categoria || ""} onChange={handleChange} required>
                <option value="">Seleccione categoría</option>
                {categorias.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <select name="estado" value={inscripcion.estado || ""} onChange={handleChange} required>
                <option value="">Seleccione estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="cancelada">Cancelada</option>
              </select>
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
