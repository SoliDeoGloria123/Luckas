import React, { useState } from 'react';
import PropTypes from 'prop-types';


const EventosModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, categorias }) => {
  // Normalización de categoria y fechaEvento para edición
  function normalizeCategoria(categoria) {
    if (!categoria) return '';
    if (typeof categoria === 'object' && categoria._id) return String(categoria._id);
    return String(categoria);
  }

  function normalizeFecha(fecha) {
    if (!fecha) return '';
    // Si ya está en formato YYYY-MM-DD, devolver tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    // Si es un objeto Date o string con T, formatear
    try {
      const d = new Date(fecha);
      if (!Number.isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (error) {
      console.error('Error normalizando fecha:', error);
    }
    return '';
  }

  const [formData, setFormData] = useState({
    nombre:initialData.nombre || '',
    descripcion:initialData.descripcion || '',
    precio:initialData.precio || '',
    categoria:normalizeCategoria(initialData.categoria),
    etiquetas:initialData.etiquetas || '',
    fechaEvento:normalizeFecha(initialData.fechaEvento),
    horaInicio:initialData.horaInicio || '',
    horaFin:initialData.horaFin || '',
    lugar:initialData.lugar || '',
    direccion:initialData.direccion || '',
    duracionDias:initialData.duracionDias || '',
    cuposTotales:initialData.cuposTotales || '',
    cuposDisponibles:initialData.cuposDisponibles || '',
    prioridad:initialData.prioridad || '',
    observaciones:initialData.observaciones || ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalizar datos antes de enviar
    let imagenesNormalizadas = [];
    if (selectedImages.length > 0) {
      imagenesNormalizadas = selectedImages.map(img => img.name);
    } else if (Array.isArray(formData.imagen)) {
      imagenesNormalizadas = formData.imagen;
    }
    const normalizado = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio),
      categoria: String(formData.categoria),
      etiquetas: typeof formData.etiquetas === 'string' ? formData.etiquetas.split(',').map(e => e.trim()).filter(Boolean) : [],
      fechaEvento: formData.fechaEvento,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      lugar: formData.lugar,
      direccion: formData.direccion,
      duracionDias: formData.duracionDias ? Number(formData.duracionDias) : 1,
      cuposTotales: Number(formData.cuposTotales),
      cuposDisponibles: Number(formData.cuposDisponibles),
      prioridad: formData.prioridad,
      observaciones: formData.observaciones,
      imagen: imagenesNormalizadas,
    };
    onSubmit(normalizado);
    onClose();
  };

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Evento' : 'Editar Evento'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label htmlFor='nombre'>Nombre Evento</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre Evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='descripcion'>Descripcion Evento</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción breve del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='precio'>Precio Evento</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='categoria'>Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria ? String(formData.categoria) : ''}
                  onChange={handleChange}

                >
                  <option value="">Seleccione</option>
                  {categorias && categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='etiquetas'>Etiquetas Evento</label>
                <input
                  type="text"
                  name="etiquetas"
                  value={formData.etiquetas}
                  onChange={handleChange}
                  placeholder="Separdas por comas"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='fechaEvento'>Fecha Evento</label>
                <input
                  type="date"
                  name="fechaEvento"
                  value={formData.fechaEvento ? String(formData.fechaEvento) : ''}
                  onChange={handleChange}
                  placeholder="Fecha del evento (AAAA-MM-DD)"

                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='horaInicio'>Hora Inicia Evento</label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  placeholder="Hora inicio del evento "
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='horaFin'>Hora fin Evento</label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  placeholder="Hora fin del evento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='lugar'>Lugar</label>
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  placeholder="Nombre del lugar del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='direccion'>Direccion</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirreccion del lugar del evento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='cuposTotales'>Cupos Totales</label>
                <input
                  type="text"
                  name="cuposTotales"
                  value={formData.cuposTotales}
                  onChange={handleChange}
                  placeholder="Cupos totales del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='cuposDisponibles'>Cupos Disponibles</label>
                <input
                  type="text"
                  name="cuposDisponibles"
                  value={formData.cuposDisponibles}
                  onChange={handleChange}
                  placeholder="Cupos disponibles del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor='prioridad'>Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label htmlFor='observaciones'>Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones del evento"
                  required
                />
              </div>

              <div className="form-group-tesorero full-width">
                <label htmlFor='imagen'>Imagen</label>
                <div className="image-upload-container">
                  <div
                    className="upload-area"
                    role="button"
                    tabIndex={0}
                    aria-label="Zona para subir imágenes. Haz clic o presiona Enter o Espacio para seleccionar archivos."
                    onClick={() => !isUploading && document.getElementById('imageInput').click()}
                    onKeyDown={e => {
                      if (!isUploading && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        document.getElementById('imageInput').click();
                      }
                    }}
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
                    <input type="file" id='imageInput' multiple accept="image/*" hidden  onChange={e => handleFileSelection(e.target.files)} />
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
            </div>
            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
EventosModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categorias: PropTypes.array.isRequired,
};
export default EventosModal;