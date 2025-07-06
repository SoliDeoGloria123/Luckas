import React, { useState } from 'react';
import './EditarSolicitudModal.css';

const EditarSolicitudModal = ({ solicitud, onClose, onSave }) => {
  const [form, setForm] = useState({
    descripcion: solicitud.descripcion || '',
    observaciones: solicitud.observaciones || '',
    cantidadPersonas: solicitud.cantidadPersonas || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Solicitud</h3>
        <form onSubmit={handleSubmit}>
          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
          <label>Observaciones:</label>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
          <label>Cantidad de personas:</label>
          <input type="number" name="cantidadPersonas" min="1" value={form.cantidadPersonas} onChange={handleChange} required />
          <div className="modal-actions">
            <button type="submit" className="card-btn">Guardar</button>
            <button type="button" className="card-btn" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarSolicitudModal;
