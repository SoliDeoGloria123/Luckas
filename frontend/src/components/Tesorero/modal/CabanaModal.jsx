import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal from './shared/BaseModal';
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

  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambio de imágenes
  const handleImagesChange = (images) => {
    setSelectedImages(images);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de archivos seleccionados
  const handleFileSelection = (files) => {
    const validFiles = [];  
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

    for (const file of Array.from(files)) {
      if (!allowedTypes.has(file.type)) continue;
      if (file.size > maxSize) continue;
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const imageDataArray = validFiles.map((file, index) => ({
        id: Date.now() + index,
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setSelectedImages(prev => [...prev, ...imageDataArray]);
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  // Validación simplificada para reducir complejidad
  const validateFormData = (data) => {
    const errors = {};
    if (!data.nombre || data.nombre.trim().length < 2) errors.nombre = 'Nombre es obligatorio (mínimo 2 caracteres)';
    if (!data.descripcion || data.descripcion.trim().length < 10) errors.descripcion = 'Descripción es obligatoria (mínimo 10 caracteres)';
    if (!data.capacidad || Number(data.capacidad) < 1) errors.capacidad = 'Capacidad debe ser mayor a 0';
    if (!data.categoria) errors.categoria = 'Categoría es obligatoria';
    if (!data.precio || Number(data.precio) < 0) errors.precio = 'Precio debe ser mayor o igual a 0';
    if (!data.ubicacion || data.ubicacion.trim().length < 5) errors.ubicacion = 'Ubicación es obligatoria (mínimo 5 caracteres)';
    if (!data.estado) errors.estado = 'Estado es obligatorio';
    return errors;
  };

  const createFormData = () => {
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('capacidad', Number(formData.capacidad));
    formDataToSend.append('categoria', String(formData.categoria));
    formDataToSend.append('precio', Number(formData.precio));
    formDataToSend.append('ubicacion', formData.ubicacion);
    formDataToSend.append('estado', formData.estado);
    
    selectedImages.forEach((imageData) => {
      if (imageData.file) {
        formDataToSend.append('imagen', imageData.file);
      }
    });
    
    return formDataToSend;
  };

  const handleSubmit = async (e) => {
    console.log('CabanaModal: handleSubmit ejecutado');
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('CabanaModal: Validando formulario...');
    console.log('CabanaModal: Datos del formulario:', formData);
    
    // Validar formulario
    const erroresValidacion = validateFormData(formData);
    const hayErrores = Object.keys(erroresValidacion).length > 0;
    
    console.log('CabanaModal: Formulario válido:', !hayErrores);
    
    if (hayErrores) {
      console.log('CabanaModal: Formulario inválido, mostrando errores');
      alert(`Errores en el formulario:\n${Object.values(erroresValidacion).join('\n')}`);
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('CabanaModal: Iniciando submit...');
      
      // Verificar que onSubmit existe y es una función
      if (typeof onSubmit !== 'function') {
        throw new TypeError('onSubmit debe ser una función');
      }
      
      if (selectedImages.length > 0) {
        console.log('CabanaModal: Enviando cabaña CON imágenes:', selectedImages.length, 'archivos');
        await onSubmit(createFormData(), true);
      } else {
        console.log('CabanaModal: Enviando cabaña SIN imágenes');
        await onSubmit(formData, false);
      }
      
      console.log('CabanaModal: Submit completado exitosamente');
      
    } catch (error) {
      console.error('CabanaModal: Error en handleSubmit:', error);
      const errorMessage = `Error al crear cabaña: ${error.message}`;
      
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="image-upload-container">
                <button
                  type="button"
                  className="upload-area"
                  onClick={() => document.getElementById('cabanaImageInput').click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    handleFileSelection(e.dataTransfer.files);
                  }}
                >
                  <div className="upload-content">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Arrastra y suelta tus imágenes aquí</h3>
                    <p>o <span className="browse-text">haz clic para seleccionar</span></p>
                    <small>Formatos soportados: JPG, PNG, GIF (máx. 5MB cada una)</small>
                  </div>
                  <input 
                    type="file" 
                    id='cabanaImageInput' 
                    multiple 
                    accept="image/*" 
                    hidden  
                    onChange={e => handleFileSelection(e.target.files)} 
                  />
                </button>

                <div className="image-preview-grid">
                  {selectedImages.map(img => (
                    <div key={img.id} className="image-preview">
                      <img src={img.url} alt={img.name} />
                      <div className="image-overlay">
                        <button type="button" className="remove-btn" onClick={() => removeImage(img.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        fontSize: '11px',
                        textAlign: 'center'
                      }}>
                        {img.name.length > 15 ? img.name.substring(0, 15) + '...' : img.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  selectedImages.length > 0 ? 'Subiendo imágenes...' : 'Creando cabaña...'
                ) : (
                  mode === 'create' ? 'Crear Cabaña' : 'Guardar Cambios'
                )}
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