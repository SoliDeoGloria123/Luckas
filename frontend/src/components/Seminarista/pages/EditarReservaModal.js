import React, { useState } from 'react';
import './EditarReservaModal.css';

const EditarReservaModal = ({ reserva, onClose, onSave }) => {
  const [form, setForm] = useState({
    fechaInicio: reserva.fechaInicio ? reserva.fechaInicio.slice(0, 10) : '',
    fechaFin: reserva.fechaFin ? reserva.fechaFin.slice(0, 10) : '',
    observaciones: reserva.observaciones || '',
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
        <h3>Editar Reserva</h3>
        <form onSubmit={handleSubmit}>
          <label>Fecha Inicio:</label>
          <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} required />
          <label>Fecha Fin:</label>
          <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} required />
          <label>Observaciones:</label>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit" className="card-btn">Guardar</button>
            <button type="button" className="card-btn" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarReservaModal;
