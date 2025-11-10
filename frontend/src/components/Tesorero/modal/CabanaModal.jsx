import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal from './shared/BaseModal';
import ImageUploader from './shared/ImageUploader';
import { useFormValidation } from '../hooks/useFormValidation';

// Función movida fuera del componente para evitar recrearla en cada render
function normalizeCategoria(categoria) {
  if (!categoria) return '';
  if (typeof categoria === 'object' && categoria._id) return String(categoria._id);
  return String(categoria);
}

const CabanaModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    capacidad: initialData.capacidad || '',
    categoria: normalizeCategoria (initialData.categoria),
    precio: initialData.precio || '',
    ubicacion: initialData.ubicacion || '',
    estado: initialData.estado || '',
    imagen: initialData.imagen || ''
  });

  // Reglas de validación
  const validationRules = {
    nombre: { required: true, label: 'Nombre', minLength: 2 },
    descripcion: { required: true, label: 'Descripción', minLength: 10 },
    capacidad: { required: true, type: 'number', label: 'Capacidad', min: 1 },
    categoria: { required: true, label: 'Categoría' },
    precio: { required: true, type: 'number', label: 'Precio', min: 0 },
    ubicacion: { required: true, label: 'Ubicación', minLength: 5 },
    estado: { required: true, label: 'Estado' }
  };

  const { validateForm, errors } = useFormValidation(validationRules);

  // Manejar cambio de imágenes
  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, imagen: images }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      // Los errores se muestran automáticamente en el formulario
      return;
    }
    
    onSubmit(formData);
    onClose();
  };

  return (
    <BaseModal 
      title={mode === 'create' ? 'Crear Nueva Cabaña' : 'Editar Cabaña'}
      onClose={onClose}
      size="large"
    >
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label htmlFor='nombre'>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className={errors.nombre ? 'error' : ''}
                  required
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='descripcion'>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='capacidad'>Capacidad</label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  placeholder="Capacidad"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='categoria'>Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {categorias && categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='precio'>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="precio"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='ubicacion'>Ubicacion</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ubicacion"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='estado'>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div className="form-group-tesorero full-width">
              <label htmlFor='imagen'>Imagen</label>
              <ImageUploader 
                onImagesChange={handleImagesChange}
                multiple={true}
              />
              {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Cabaña' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
    </BaseModal>
  );
};

CabanaModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categorias: PropTypes.array.isRequired,
};
export default CabanaModal;