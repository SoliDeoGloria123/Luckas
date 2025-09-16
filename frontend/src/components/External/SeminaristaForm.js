// frontend/src/components/External/SeminaristaForm.js
import React, { useState } from 'react';
import './SeminaristaForm.css';

const SeminaristaForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      birthDate: '',
      phone: '',
      address: '',
      maritalStatus: ''
    },
    spiritualExperience: {
      conversionDate: '',
      baptismDate: '',
      currentChurch: '',
      callingDescription: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Aplicación enviada exitosamente - Aquí se conectará con el backend');
    console.log('Datos del formulario:', formData);
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="seminarista-form">
        <div className="form-header">
          <h2>Aplicación para Seminarista</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información Personal</h3>
            
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nombre Completo"
                value={formData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                required
              />
              
              <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={formData.personalInfo.birthDate}
                onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                required
              />
              
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                required
              />
              
              <select
                value={formData.personalInfo.maritalStatus}
                onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                required
              >
                <option value="">Estado Civil</option>
                <option value="soltero">Soltero(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="viudo">Viudo(a)</option>
              </select>
            </div>
            
            <textarea
              placeholder="Dirección Completa"
              value={formData.personalInfo.address}
              onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <h3>Experiencia Espiritual</h3>
            
            <div className="form-grid">
              <input
                type="date"
                placeholder="Fecha de Conversión"
                value={formData.spiritualExperience.conversionDate}
                onChange={(e) => handleInputChange('spiritualExperience', 'conversionDate', e.target.value)}
              />
              
              <input
                type="date"
                placeholder="Fecha de Bautismo"
                value={formData.spiritualExperience.baptismDate}
                onChange={(e) => handleInputChange('spiritualExperience', 'baptismDate', e.target.value)}
              />
            </div>
            
            <input
              type="text"
              placeholder="Iglesia Actual"
              value={formData.spiritualExperience.currentChurch}
              onChange={(e) => handleInputChange('spiritualExperience', 'currentChurch', e.target.value)}
              required
            />
            
            <textarea
              placeholder="Describe tu llamado al ministerio"
              value={formData.spiritualExperience.callingDescription}
              onChange={(e) => handleInputChange('spiritualExperience', 'callingDescription', e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Enviar Aplicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeminaristaForm;