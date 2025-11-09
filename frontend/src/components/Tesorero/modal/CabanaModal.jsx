import React, { useState } from 'react';
import PropTypes from 'prop-types';


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
  const [selectedImages, setSelectedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  function normalizeCategoria(categoria) {
    if (!categoria) return '';
    if (typeof categoria === 'object' && categoria._id) return String(categoria._id);
    return String(categoria);
  }


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
      uploadImages(validFiles);
    }
  };

  // Simulación de carga de imágenes
  const uploadImages = (files) => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    let uploadedCount = 0;
    const totalFiles = files.length;

    let index = 0;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + index,
          file,
          url: e.target.result,
          name: file.name
        };

        setSelectedImages(prev => [...prev, imageData]);

        uploadedCount++;
        const progressValue = (uploadedCount / totalFiles) * 100;
        setProgress(progressValue);

        if (uploadedCount === totalFiles) {
          setTimeout(() => {
            setIsUploading(false);
          }, 500);
        }
      };
      reader.readAsDataURL(file);
      index++;
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de campos obligatorios
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.capacidad || Number.isNaN(formData.capacidad)) {
      alert('La capacidad es obligatoria y debe ser un número');
      return;
    }
    if (!formData.categoria) {
      alert('La categoría es obligatoria');
      return;
    }
    if (!formData.precio || Number.isNaN(formData.precio)) {
      alert('El precio es obligatorio y debe ser un número');
      return;
    }
    if (!formData.ubicacion.trim()) {
      alert('La ubicación es obligatoria');
      return;
    }
    if (!formData.estado) {
      alert('El estado es obligatorio');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Cabaña' : 'Editar Cabaña'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
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
                  required
                />
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
                <div className="upload-area" onClick={() => !isUploading && document.getElementById('imageInput').click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelection(e.dataTransfer.files);
                  }}>
                  <div className="upload-content">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Arrastra y suelta tus imágenes aquí</h3>
                    <p>o <span className="browse-text">haz clic para seleccionar</span></p>
                    <small>Formatos soportados: JPG, PNG, GIF (máx. 5MB cada una)</small>
                  </div>
                  <input type="file" id='imageInput' multiple accept="image/*" hidden onChange={(e) => handleFileSelection(e.target.files)} />
                </div>


                <div className="image-preview-grid" id="imagePreviewGrid">
                  {selectedImages.map(img => (
                    <div key={img.id} className="image-preview">
                      <img src={img.url} alt={img.name} />
                      <div className="image-overlay">
                        <button type="button" className="remove-btn" onClick={() => removeImage(img.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
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
        </div>
      </div>
    </div>
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