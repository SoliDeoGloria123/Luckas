  import React, { useState } from 'react';
import PropTypes from 'prop-types';


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
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);


  // Manejo de archivos seleccionados
  const handleFileSelection = (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) continue;
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
  const fecha = modoEdicion
    ? eventoSeleccionado?.fechaEvento
    : nuevoEvento.fechaEvento;
  if (fecha && fecha < todayStr) {
    alert('La fecha del evento no puede ser anterior a hoy');
    return;
  }
  onSubmit();
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
        <form className="modal-body-admin" onSubmit={e => { e.preventDefault(); onSubmit(); handleSubmit(); }}>
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


          <div className="form-group-tesorero full-width">
            <label htmlFor="imagen-evento">Imagen</label>
            <div className="image-upload-container">
              <button className="upload-area" onClick={() => !isUploading && document.getElementById('imageInput').click()}
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
              </button>


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


          <div className="modal-action-admin">
            <button type="button" className="btn-admin secondary-admin" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">
              {modoEdicion ? "Guardar Cambios" : "Crear Evento"}
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