
import React, {useState} from "react";


const CabanaModal = ({
  mostrar,
  modoEdicion,
  cabanaSeleccionada,
  setCabanaSeleccionada,
  nuevaCabana,
  setNuevaCabana,
  onClose,
  onSubmit,
  categorias
}) => {
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) return;
      if (file.size > maxSize) return;
      validFiles.push(file);
    });

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

    files.forEach((file, index) => {
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
    });
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
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
        <form className="modal-body-admin">
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input
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
              <label>Descripción:</label>
              <input
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
              <label>Capacidad:</label>
              <input
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
              <label>Categoría:</label>
              <select
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
              <label>Precio:</label>
              <input
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
                <label>Ubicacion:</label>
                <input
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
              <label>Estado:</label>
              <select
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
            <div className="form-grupo-admin">
              <label>Imagenes De La Cabaña:</label>
              <input
                type="file"
                name="imagen"
                multiple
                accept="image/*"
                className="input-imagen-multiple"
                onChange={e => {
                  const files = Array.from(e.target.files);
                  if (modoEdicion) {
                    setCabanaSeleccionada({ ...cabanaSeleccionada, imagenes: files });
                  } else {
                    setNuevaCabana({ ...nuevaCabana, imagenes: files });
                  }
                }}
              />
            </div>
            <div className="form-group-tesorero full-width">
              <label>Imagen</label>
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
      
          <small style={{ color: "#555", marginTop: "5px" }}>
            Puedes seleccionar varias imágenes manteniendo presionada la tecla Ctrl o Shift
          </small>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
              <i className="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Cabaña"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CabanaModal;