import React, { useState, useEffect } from 'react';


const CategorizacionModal = ({ mode = 'create', initialData = {}, onClose, onSubmit }) => {

const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    activo: 'Activo'
  });

  useEffect(() => {
    setFormData({
      nombre: initialData.nombre || '',
      codigo: initialData.codigo || '',
      activo: initialData.activo || 'Activo'
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Categorizacion' : 'Editar Categorizacion'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>
              
              <div className="form-group-tesorero">
                <label>Codigo</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>
              
      
              
              <div className="form-group-tesorero">
                <label>Estado</label>
                <select
                  name="activo"
                  value={formData.activo}
                  onChange={handleChange}
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Categorización' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategorizacionModal;