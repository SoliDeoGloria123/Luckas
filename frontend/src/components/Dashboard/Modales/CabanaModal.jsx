
import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';


const CabanaModal = ({
  mostrar,
  modoEdicion,
  cabanaSeleccionada,
  setCabanaSeleccionada,
  nuevaCabana,
  setNuevaCabana,
  onClose,
  onSubmit,
  categorias,
  selectedImages,
  setSelectedImages
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear estado cuando se abre el modal en modo crear
  useEffect(() => {
    if (mostrar && !modoEdicion && setSelectedImages) {
      setSelectedImages([]);
      setProgress(0);
      setIsUploading(false);
      setIsSubmitting(false);
    }
  }, [mostrar, modoEdicion, setSelectedImages]);

  // Función auxiliar para finalizar upload
  const finishUpload = () => {
    setTimeout(() => setIsUploading(false), 500);
  };

  // Función auxiliar para actualizar progreso
  const updateProgress = (count, total) => {
    const progressValue = (count / total) * 100;
    setProgress(progressValue);
  };

  // Función auxiliar para agregar imagen
  const addImageToState = (imageData) => {
    if (setSelectedImages && typeof setSelectedImages === 'function') {
      setSelectedImages(prev => Array.isArray(prev) ? [...prev, imageData] : [imageData]);
    }
  };

  // Manejo de archivos seleccionados
  const handleFileSelection = (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

    for (const file of Array.from(files)) {
      if (!allowedTypes.has(file.type)) {
        console.warn(`Tipo de archivo no permitido: ${file.type}`);
        continue;
      }
      if (file.size > maxSize) {
        console.warn(`Archivo muy grande: ${file.name} (${file.size} bytes)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      uploadImages(validFiles);
    } else {
      alert('No se seleccionaron archivos válidos. Asegúrate de seleccionar imágenes JPG, PNG o GIF menores a 5MB.');
    }
  };

  // Simulación de carga de imágenes
  const uploadImages = (files) => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    let uploadedCount = 0;
    const totalFiles = files.length;

    const handleFileLoad = (e, file, index) => {
      try {
        const imageData = {
          id: Date.now() + index,
          file,
          url: e.target.result,
          name: file.name
        };

        addImageToState(imageData);
        uploadedCount++;
        updateProgress(uploadedCount, totalFiles);

        if (uploadedCount === totalFiles) {
          finishUpload();
        }
      } catch (error) {
        console.error('Error procesando imagen:', error);
        uploadedCount++;
        if (uploadedCount === totalFiles) {
          setIsUploading(false);
        }
      }
    };

    const handleFileError = () => {
      console.error('Error leyendo archivo');
      uploadedCount++;
      if (uploadedCount === totalFiles) {
        setIsUploading(false);
      }
    };

    for (const [index, file] of files.entries()) {
      const reader = new FileReader();
      reader.onload = (e) => handleFileLoad(e, file, index);
      reader.onerror = handleFileError;
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    if (setSelectedImages && typeof setSelectedImages === 'function') {
      setSelectedImages(prev => Array.isArray(prev) ? prev.filter(img => img.id !== id) : []);
    }
  };

  // Función auxiliar para obtener texto del botón
  const getButtonText = () => {
    if (isSubmitting) {
      return selectedImages.length > 0 ? 'Subiendo imágenes...' : 'Creando cabaña...';
    }
    return modoEdicion ? "Guardar Cambios" : "Crear Cabaña";
  };

  // Función auxiliar para preparar FormData con imágenes
  const prepararFormDataConImagenes = () => {
    const formData = new FormData();
    
    const cabanaData = modoEdicion ? cabanaSeleccionada : nuevaCabana;
    
    // Agregar campos básicos
    formData.append('nombre', cabanaData.nombre);
    formData.append('descripcion', cabanaData.descripcion);
    formData.append('capacidad', Number(cabanaData.capacidad));
    formData.append('categoria', String(cabanaData.categoria));
    formData.append('precio', Number(cabanaData.precio));
    formData.append('estado', cabanaData.estado);
    
    if (!modoEdicion && cabanaData.ubicacion) {
      formData.append('ubicacion', cabanaData.ubicacion);
    }
    
    return formData;
  };

  // Función auxiliar para agregar imágenes al FormData
  const agregarImagenesAFormData = (formData) => {
    for (const imageData of selectedImages) {
      if (imageData.file) {
        formData.append('imagen', imageData.file);
      }
    }
  };

  // Función mejorada para el submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const tieneImagenes = !modoEdicion && selectedImages.length > 0;
      
      if (tieneImagenes) {
        const formData = prepararFormDataConImagenes();
        agregarImagenesAFormData(formData);
        console.log('Enviando cabaña CON imágenes:', selectedImages.length, 'archivos');
        await onSubmit(formData, true);
      } else {
        await onSubmit();
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>{modoEdicion ? "Editar Cabaña" : "Crear Nueva Cabaña"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="nombre-cabana">Nombre:</label>
              <input
                id="nombre-cabana"
                type="text"
                value={modoEdicion ? cabanaSeleccionada?.nombre : nuevaCabana.nombre}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, nombre: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, nombre: e.target.value })
                }
                placeholder="Nombre de la cabaña"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="descripcion-cabana">Descripción:</label>
              <input
                id="descripcion-cabana"
                type="text"
                value={modoEdicion ? cabanaSeleccionada?.descripcion : nuevaCabana.descripcion}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, descripcion: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, descripcion: e.target.value })
                }
                placeholder="Descripción"
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="capacidad-cabana">Capacidad:</label>
              <input
                id="capacidad-cabana"
                type="number"
                value={modoEdicion ? cabanaSeleccionada?.capacidad : nuevaCabana.capacidad}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, capacidad: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, capacidad: e.target.value })
                }
                placeholder="Capacidad"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="categoria-cabana">Categoría:</label>
              <select
                id="categoria-cabana"
                type="text"
                value={modoEdicion ? cabanaSeleccionada?.categoria : nuevaCabana.categoria}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, categoria: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, categoria: e.target.value })
                }
                placeholder="Categoría"
              >
                <option value="">Seleccione...</option>
                {categorias && categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="precio-cabana">Precio:</label>
              <input
                id="precio-cabana"
                type="number"
                value={modoEdicion ? cabanaSeleccionada?.precio : nuevaCabana.precio}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, precio: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, precio: e.target.value })
                }
                placeholder="Precio por noche"
                required
              />
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="ubicacion-cabana">Ubicacion:</label>
                <input
                  id="ubicacion-cabana"
                  type="text"
                  value={nuevaCabana.ubicacion}
                  onChange={e =>
                    setNuevaCabana({ ...nuevaCabana, ubicacion: e.target.value })
                  }
                  placeholder="Ubicación"
                />
              </div>
            )}
          </div>
      
            <div className="form-grupo-admin">
              <label htmlFor="estado-cabana">Estado:</label>
              <select
                id="estado-cabana"
                value={modoEdicion ? cabanaSeleccionada?.estado : nuevaCabana.estado}
                onChange={e =>
                  modoEdicion
                    ? setCabanaSeleccionada({ ...cabanaSeleccionada, estado: e.target.value })
                    : setNuevaCabana({ ...nuevaCabana, estado: e.target.value })
                }
                required
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
        
            <div className="form-group-tesorero full-width">
              <label htmlFor="imageInput">Imagen</label>
              <div className="image-upload-container">
                <button 
                  type="button"
                  className="upload-area" 
                  onClick={() => !isUploading && document.getElementById('imageInput').click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isUploading) return;
                    const files = e.dataTransfer?.files;
                    if (files && files.length > 0) {
                      handleFileSelection(files);
                    }
                  }}
                  disabled={isUploading}
                >
                  <div className="upload-content">
                    <i className="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Arrastra y suelta tus imágenes aquí</h3>
                    <p>o <span className="browse-text">haz clic para seleccionar</span></p>
                    <small>Formatos soportados: JPG, PNG, GIF (máx. 5MB cada una)</small>
                  </div>
                  <input 
                    type="file" 
                    id='imageInput' 
                    multiple 
                    accept="image/jpeg,image/jpg,image/png,image/gif" 
                    hidden 
                    onChange={(e) => {
                      const files = e.target?.files;
                      if (files && files.length > 0) {
                        handleFileSelection(files);
                      }
                      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
                      e.target.value = '';
                    }} 
                  />
                </button>

                {/* Barra de progreso */}
                {isUploading && (
                  <div style={{
                    margin: '10px 0',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#007bff',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '14px',
                      color: '#6c757d',
                      textAlign: 'center'
                    }}>
                      Procesando imágenes... {Math.round(progress)}%
                    </p>
                  </div>
                )}

                <div className="image-preview-grid" id="imagePreviewGrid">
                  {Array.isArray(selectedImages) && selectedImages.map(img => (
                    <div key={img.id} className="image-preview">
                      <img src={img.url} alt={img.name || 'Imagen'} />
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
                        {img.name && img.name.length > 15 ? img.name.substring(0, 15) + '...' : (img.name || 'Sin nombre')}
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
      
          <small style={{ color: "#555", marginTop: "5px" }}>
            Puedes seleccionar varias imágenes manteniendo presionada la tecla Ctrl o Shift
          </small>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose} disabled={isSubmitting}>
              <i className="fas fa-times"></i> {' '}
              Cancelar
            </button>
            <button className="btn-admin btn-primary" type="submit" disabled={isSubmitting}>
              <i className="fas fa-save"></i>
              {getButtonText()}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
CabanaModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  cabanaSeleccionada: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    capacidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estado: PropTypes.string,
    imagen: PropTypes.array,
    ubicacion: PropTypes.string
  }),
  setCabanaSeleccionada: PropTypes.func,
  nuevaCabana: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    capacidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estado: PropTypes.string,
    imagen: PropTypes.array,
    ubicacion: PropTypes.string
  }),
  setNuevaCabana: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  categorias: PropTypes.array,
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func
};

export default CabanaModal;

