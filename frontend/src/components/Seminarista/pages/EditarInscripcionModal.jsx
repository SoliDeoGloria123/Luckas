import React, { useState } from 'react';
import './EditarInscripcionModal.css';

const EditarInscripcionModal = ({ inscripcion, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: inscripcion?.nombre || '',
    apellido: inscripcion?.apellido || '',
    correo: inscripcion?.correo || '',
    telefono: inscripcion?.telefono || '',
    observaciones: inscripcion?.observaciones || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-reserva" onClick={e => e.stopPropagation()} style={{maxWidth:'420px'}}>
        <div className="modal-header">
          <h2>Editar Inscripción</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-reserva">
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input name="apellido" value={form.apellido} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo</label>
            <input name="correo" value={form.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Observaciones</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-reservar" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarInscripcionModal;
