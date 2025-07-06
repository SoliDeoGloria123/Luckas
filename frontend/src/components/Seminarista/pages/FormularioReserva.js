import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioReserva.css';

const FormularioReserva = ({ cabana, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    cabana: cabana?._id || '',
    fechaInicio: '',
    fechaFin: '',
    observaciones: ''
  });

  useEffect(() => {
    // Cargar datos del usuario autenticado
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    setFormData(prev => ({
      ...prev,
      usuario: usuario._id || ''
    }));

    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInicio').min = hoy;
    document.getElementById('fechaFin').min = hoy;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia la fecha de inicio, actualizar la fecha mínima de fin
    if (name === 'fechaInicio') {
      document.getElementById('fechaFin').min = value;
      if (formData.fechaFin && formData.fechaFin < value) {
        setFormData(prev => ({
          ...prev,
          fechaFin: value
        }));
      }
    }
  };

  const calcularNoches = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      const diffTime = Math.abs(fin - inicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calcularTotal = () => {
    const noches = calcularNoches();
    const precio = 14000; // Precio fijo por noche
    return noches * precio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/reservas', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onSuccess('Reserva realizada exitosamente');
        onClose();
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al procesar la reserva: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-reserva" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🗓️ Reservar Cabaña</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="cabana-info-reserva">
          <h3>{cabana?.nombre}</h3>
          <div className="info-grid">
            <p><strong>👥 Capacidad:</strong> {cabana?.capacidad || 'No especificada'}</p>
            <p><strong>💰 Precio:</strong> 
              $14,000/noche
            </p>
            <p><strong>🏷️ Categoría:</strong> {cabana?.categoria?.nombre || 'Sin categoría'}</p>
            <p><strong>🔄 Estado:</strong> {cabana?.estado || 'Sin estado'}</p>
          </div>
          {cabana?.descripcion && (
            <p><strong>📝 Descripción:</strong> {cabana.descripcion}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-reserva">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha de Inicio *</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fechaFin">Fecha de Fin *</label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Resumen de la reserva */}
          {formData.fechaInicio && formData.fechaFin && (
            <div className="resumen-reserva">
              <h4>📊 Resumen de la Reserva</h4>
              <div className="resumen-item">
                <span>Número de noches:</span>
                <span><strong>{calcularNoches()}</strong></span>
              </div>
              <div className="resumen-item">
                <span>Precio por noche:</span>
                <span><strong>$14,000</strong></span>
              </div>
              <div className="resumen-item total">
                <span>Total a pagar:</span>
                <span><strong>${calcularTotal().toLocaleString()}</strong></span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="3"
              placeholder="Solicitudes especiales, número de huéspedes, etc. (opcional)"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-reservar" disabled={loading}>
              {loading ? 'Procesando...' : '🗓️ Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioReserva;
