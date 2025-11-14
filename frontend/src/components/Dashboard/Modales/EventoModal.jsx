import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


// Función auxiliar para obtener fecha de hoy
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Función auxiliar para obtener texto del botón
const getButtonText = (isSubmitting, selectedImages, modoEdicion) => {
  if (isSubmitting) {
    return selectedImages.length > 0 ? 'Subiendo imágenes...' : 'Creando evento...';
  }
  return modoEdicion ? "Guardar Cambios" : "Crear Evento";
};

const EventoModal = ({
  mostrar,
  modoEdicion,
  eventoSeleccionado,
  setEventoSeleccionado,
  nuevoEvento,
  setNuevoEvento,
  categorias,
  onClose,
  onSubmit,
  selectedImages,
  setSelectedImages
}) => {
  const todayStr = getTodayString();
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

  // Función auxiliar para validar fecha
  const validarFecha = (fecha) => {
    if (fecha && fecha < todayStr) {
      alert('La fecha del evento no puede ser anterior a hoy');
      return false;
    }
    return true;
  };

  // Función auxiliar para preparar FormData con imágenes
  const prepararFormDataConImagenes = () => {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('nombre', nuevoEvento.nombre);
    formData.append('descripcion', nuevoEvento.descripcion);
    formData.append('precio', Number(nuevoEvento.precio));
    formData.append('categoria', String(nuevoEvento.categoria));

    // Procesar etiquetas
    const etiquetas = typeof nuevoEvento.etiquetas === 'string'
      ? nuevoEvento.etiquetas.split(',').map(e => e.trim()).filter(Boolean)
      : [];
    formData.append('etiquetas', JSON.stringify(etiquetas));

    // Agregar campos restantes
    formData.append('fechaEvento', nuevoEvento.fechaEvento);
    formData.append('horaInicio', nuevoEvento.horaInicio);
    formData.append('horaFin', nuevoEvento.horaFin);
    formData.append('lugar', nuevoEvento.lugar);
    formData.append('direccion', nuevoEvento.direccion);
    formData.append('duracionDias', nuevoEvento.duracionDias ? Number(nuevoEvento.duracionDias) : 1);
    formData.append('cuposTotales', Number(nuevoEvento.cuposTotales));
    formData.append('cuposDisponibles', Number(nuevoEvento.cuposDisponibles));
    formData.append('prioridad', nuevoEvento.prioridad);
    formData.append('observaciones', nuevoEvento.observaciones);
    formData.append('active', nuevoEvento.active);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fecha = modoEdicion ? eventoSeleccionado?.fechaEvento : nuevoEvento.fechaEvento;

      if (!validarFecha(fecha)) {
        setIsSubmitting(false);
        return;
      }

      const tieneImagenes = !modoEdicion && selectedImages.length > 0;

      if (tieneImagenes) {
        const formData = prepararFormDataConImagenes();
        agregarImagenesAFormData(formData);
        console.log('Enviando evento CON imágenes:', selectedImages.length, 'archivos');
        onSubmit(formData, true);
      } else {
        onSubmit();
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
          <h2>{modoEdicion ? "Editar Evento" : "Nueva Evento"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="nombre-evento">Nombre Evento:</label>
              <input
                id="nombre-evento"
                type="text"
                value={modoEdicion ? eventoSeleccionado?.nombre : nuevoEvento.nombre}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, nombre: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })
                }
                placeholder="Nombre del Evento"
              />
            </div>

            <div className="form-grupo-admin">
              <label htmlFor="descripcion-evento">Descripcion Evento:</label>
              <input
                id="descripcion-evento"
                type="text"
                value={modoEdicion ? eventoSeleccionado?.descripcion : nuevoEvento.descripcion}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, descripcion: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
                }
                placeholder="Descripción del Evento"
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="precio-evento">Precio Evento:</label>
              <input
                id="precio-evento"
                type="number"
                value={modoEdicion ? eventoSeleccionado?.precio : nuevoEvento.precio}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, precio: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, precio: e.target.value })
                }
                placeholder="Nombre del Evento"
              />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="categoria-evento">Categoría:</label>
              <select
                id="categoria-evento"
                value={modoEdicion ? eventoSeleccionado?.categoria : nuevoEvento.categoria}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, categoria: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, categoria: e.target.value })
                }
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
          </div>
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="etiquetas-evento">Etiquetas Evento:</label>
                <input
                  id="etiquetas-evento"
                  type="text"
                  value={nuevoEvento.etiquetas}
                  onChange={e =>
                    setNuevoEvento({ ...nuevoEvento, etiquetas: e.target.value })
                  }
                  placeholder="Nombre del Evento"
                />
              </div>
            )}
            <div className="form-grupo-admin">
              <label htmlFor="fecha-evento">Fecha del Evento:</label>
              <input
                id="fecha-evento"
                type="date"
                value={modoEdicion ? eventoSeleccionado?.fechaEvento : nuevoEvento.fechaEvento}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, fechaEvento: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, fechaEvento: e.target.value })
                }
                min={todayStr}
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="hora-inicio">Hora de Inicio:</label>
              <input
                id="hora-inicio"
                type="time"
                value={modoEdicion ? eventoSeleccionado?.horaInicio : nuevoEvento.horaInicio}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, horaInicio: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, horaInicio: e.target.value })
                }
              />
            </div>

            <div className="form-grupo-admin">
              <label htmlFor="hora-fin">Hora de Fin:</label>
              <input
                id="hora-fin"
                type="time"
                value={modoEdicion ? eventoSeleccionado?.horaFin : nuevoEvento.horaFin}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, horaFin: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, horaFin: e.target.value })
                }
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="lugar-evento">Lugar:</label>
              <input
                id="lugar-evento"
                type="text"
                value={modoEdicion ? eventoSeleccionado?.lugar : nuevoEvento.lugar}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, lugar: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })
                }
                placeholder="Ej: Auditorio Principal"
              />
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="direccion-evento">Dirección:</label>
                <input
                  id="direccion-evento"
                  type="text"
                  value={nuevoEvento.direccion}
                  onChange={e =>
                    setNuevoEvento({ ...nuevoEvento, direccion: e.target.value })
                  }
                  placeholder="Ej: Carrera 45 #50-12, Bogotá"
                />
              </div>
            )}
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="cupos-totales">Cupos Totales:</label>
              <input
                id="cupos-totales"
                type="number"
                value={modoEdicion ? eventoSeleccionado?.cuposTotales : nuevoEvento.cuposTotales}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, cuposTotales: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, cuposTotales: e.target.value })
                }
              />
            </div>

            <div className="form-grupo-admin">
              <label htmlFor="cupos-disponibles">Cupos Disponibles:</label>
              <input
                id="cupos-disponibles"
                type="number"
                value={modoEdicion ? eventoSeleccionado?.cuposDisponibles : nuevoEvento.cuposDisponibles}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, cuposDisponibles: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, cuposDisponibles: e.target.value })
                }
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="prioridad-evento">Prioridad:</label>
              <select
                id="prioridad-evento"
                value={modoEdicion ? eventoSeleccionado?.prioridad : nuevoEvento.prioridad}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, prioridad: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, prioridad: e.target.value })
                }
              >
                <option value="">Seleccione...</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="estado-evento">Estado:</label>
              <select
                id="estado-evento"
                value={modoEdicion ? eventoSeleccionado?.active : nuevoEvento.active}
                onChange={e =>
                  modoEdicion
                    ? setEventoSeleccionado({ ...eventoSeleccionado, active: e.target.value })
                    : setNuevoEvento({ ...nuevoEvento, active: e.target.value })
                }
              >
                <option value="">Seleccione...</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>



          {!modoEdicion && (
            <div className="form-grupo-admin">
              <label htmlFor="observaciones-evento">Observaciones:</label>
              <input
                id="observaciones-evento"
                type="text"
                value={nuevoEvento.observaciones}
                onChange={e =>
                  setNuevoEvento({ ...nuevoEvento, observaciones: e.target.value })
                }
                placeholder="Observaciones del evento"
              />
            </div>
          )}
          <div className="form-group-tesorero full-width">
            <label htmlFor="imagen-evento">Imagen</label>
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


          <div className="modal-action-admin">
            <button type="button" className="btn-admin secondary-admin" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary" disabled={isSubmitting}>
              {getButtonText(isSubmitting, selectedImages, modoEdicion)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EventoModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  eventoSeleccionado: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    fechaEvento: PropTypes.string,
    horaInicio: PropTypes.string,
    horaFin: PropTypes.string,
    lugar: PropTypes.string,
    cuposTotales: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposDisponibles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prioridad: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    observaciones: PropTypes.string
  }),
  setEventoSeleccionado: PropTypes.func,
  nuevoEvento: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    fechaEvento: PropTypes.string,
    horaInicio: PropTypes.string,
    horaFin: PropTypes.string,
    lugar: PropTypes.string,
    direccion: PropTypes.string,
    duracionDias: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposTotales: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposDisponibles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prioridad: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    etiquetas: PropTypes.string,
    observaciones: PropTypes.string
  }),
  setNuevoEvento: PropTypes.func,
  categorias: PropTypes.array,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func
};

export default EventoModal;