import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ModificarPerfil = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: ''
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const token = localStorage.getItem('token');
      
      // Obtener datos actualizados del servidor
      const response = await axios.get(`http://localhost:3000/api/users/${usuario._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          correo: userData.correo || '',
          telefono: userData.telefono || '',
          tipoDocumento: userData.tipoDocumento || '',
          numeroDocumento: userData.numeroDocumento || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      // Si falla, usar datos del localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        tipoDocumento: usuario.tipoDocumento || '',
        numeroDocumento: usuario.numeroDocumento || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`http://localhost:3000/api/users/${usuario._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Actualizar datos en localStorage
        const usuarioActualizado = { ...usuario, ...formData };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        
        onSuccess('Perfil actualizado exitosamente');
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="modal-overlay" 
      onClick={onClose}
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
    >
      <dialog 
        className="modal-perfil" 
        aria-labelledby="modal-title"
        open
      >
        <div className="modal-header">
          <h2 id="modal-title">👤 Modificar Perfil</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-perfil">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de Documento *</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de Documento *</label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="info-importante">
            <h4>ℹ️ Información Importante</h4>
            <ul>
              <li>✅ Estos datos se utilizarán para todas tus inscripciones y reservas</li>
              <li>📧 El correo electrónico debe ser válido para recibir confirmaciones</li>
              <li>📱 El teléfono debe ser activo para contacto de emergencia</li>
              <li>🆔 Los datos del documento deben coincidir con tu identificación oficial</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar" disabled={loading}>
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </dialog>
    </button>
  );
};
ModificarPerfil.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default ModificarPerfil;
