import React, { useState } from 'react';

const CursoModal = ({
  mostrarModal,
  modoEdicion,
  cerrarModal,
  mensajeError,
  mensajeExito,
  manejarEnvio,
  nuevoCurso,
  manejarCambio,
  manejarCambioDias
}) => {
  const [imagePreview, setImagePreview] = useState(nuevoCurso.imagen || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Crear un canvas para comprimir la imagen
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Definir dimensiones máximas
          const maxWidth = 800;
          const maxHeight = 600;
          
          let { width, height } = img;
          
          // Redimensionar manteniendo proporción
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Dibujar y comprimir
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a base64 con compresión
          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          
          setImagePreview(compressedImage);
          manejarCambio('imagen', compressedImage);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mostrarModal) return null;
  
  return (
    <div className="modal-overlay-premium">
      <div className="modal-contenido-premium">
        <div className="modal-header-premium">
          <div className="modal-title-section">
            <h2 className="modal-title-main">
              {modoEdicion ? 'Editar' : 'Crear Nuevo'} <span className="title-accent">Curso</span>
            </h2>
            <p className="modal-subtitle">Complete la información del curso académico</p>
          </div>
          <button className="btn-cerrar-premium" onClick={cerrarModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {mensajeError && (
          <div className="mensaje-error-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M15 9l-6 6m0-6l6 6" stroke="#ef4444" strokeWidth="2"/>
            </svg>
            {mensajeError}
          </div>
        )}
        
        {mensajeExito && (
          <div className="mensaje-exito-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#059669" strokeWidth="2"/>
            </svg>
            {mensajeExito}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="curso-form-premium">
          {/* Sección: Imagen del Curso */}
          <div className="form-section">
            <h3 className="section-title">📸 Imagen del Curso</h3>
            <div className="image-upload-container">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="placeholder-image">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Subir imagen</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                id="imagen-curso" 
                accept="image/*" 
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="imagen-curso" className="btn-upload">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Seleccionar Imagen
              </label>
            </div>
          </div>

          {/* Sección: Información Básica */}
          <div className="form-section">
            <h3 className="section-title">📚 Información Básica</h3>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Nombre del Curso *</label>
                <input 
                  type="text" 
                  value={nuevoCurso.nombre} 
                  onChange={e => manejarCambio('nombre', e.target.value)} 
                  placeholder="Ej: Teología Sistemática I"
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Instructor *</label>
                <input 
                  type="text" 
                  value={nuevoCurso.instructor} 
                  onChange={e => manejarCambio('instructor', e.target.value)} 
                  placeholder="Nombre completo del instructor"
                  required 
                />
              </div>
            </div>
            <div className="form-group-premium">
              <label>Descripción del Curso *</label>
              <textarea 
                value={nuevoCurso.descripcion} 
                onChange={e => manejarCambio('descripcion', e.target.value)} 
                rows={4} 
                placeholder="Descripción detallada del curso, objetivos y contenido..."
                required 
              />
            </div>
          </div>

          {/* Sección: Detalles Académicos */}
          <div className="form-section">
            <h3 className="section-title">🎓 Detalles Académicos</h3>
            <div className="form-grid-3">
              <div className="form-group-premium">
                <label>Categoría *</label>
                <select value={nuevoCurso.categoria} onChange={e => manejarCambio('categoria', e.target.value)} required>
                  <option value="biblico">📖 Bíblico</option>
                  <option value="ministerial">⛪ Ministerial</option>
                  <option value="liderazgo">👨‍💼 Liderazgo</option>
                  <option value="evangelismo">📢 Evangelismo</option>
                  <option value="pastoral">🐑 Pastoral</option>
                  <option value="otros">📋 Otros</option>
                </select>
              </div>
              <div className="form-group-premium">
                <label>Nivel Académico *</label>
                <select value={nuevoCurso.nivel} onChange={e => manejarCambio('nivel', e.target.value)} required>
                  <option value="basico">🥉 Básico</option>
                  <option value="intermedio">🥈 Intermedio</option>
                  <option value="avanzado">🥇 Avanzado</option>
                </select>
              </div>
              <div className="form-group-premium">
                <label>Modalidad *</label>
                <select value={nuevoCurso.modalidad} onChange={e => manejarCambio('modalidad', e.target.value)} required>
                  <option value="presencial">🏫 Presencial</option>
                  <option value="virtual">💻 Virtual</option>
                  <option value="semipresencial">🔄 Híbrido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Duración y Cupos */}
          <div className="form-section">
            <h3 className="section-title">⏱️ Duración y Cupos</h3>
            <div className="form-grid-5">
              <div className="form-group-premium">
                <label>Créditos</label>
                <input 
                  type="number" 
                  value={nuevoCurso.creditos || ''} 
                  onChange={e => manejarCambio('creditos', e.target.value)} 
                  placeholder="3"
                  min="1"
                  max="10"
                />
              </div>
              <div className="form-group-premium">
                <label>Horas Académicas *</label>
                <input 
                  type="number" 
                  value={nuevoCurso.duracion.horas} 
                  onChange={e => manejarCambio('duracion.horas', e.target.value)} 
                  placeholder="48"
                  min="1"
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Semanas de Duración *</label>
                <input 
                  type="number" 
                  value={nuevoCurso.duracion.semanas} 
                  onChange={e => manejarCambio('duracion.semanas', e.target.value)} 
                  placeholder="16"
                  min="1"
                  max="52"
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Cupos Disponibles *</label>
                <input 
                  type="number" 
                  value={nuevoCurso.cuposDisponibles} 
                  onChange={e => manejarCambio('cuposDisponibles', e.target.value)} 
                  placeholder="25"
                  min="1"
                  max="100"
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Precio (COP) *</label>
                <input 
                  type="number" 
                  value={nuevoCurso.costo} 
                  onChange={e => manejarCambio('costo', e.target.value)} 
                  placeholder="150000"
                  min="0"
                  required 
                />
              </div>
            </div>
          </div>

          {/* Sección: Fechas y Horarios */}
          <div className="form-section">
            <h3 className="section-title">📅 Programación</h3>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Fecha de Inicio *</label>
                <input 
                  type="date" 
                  value={nuevoCurso.fechaInicio} 
                  onChange={e => manejarCambio('fechaInicio', e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Fecha de Finalización *</label>
                <input 
                  type="date" 
                  value={nuevoCurso.fechaFin} 
                  onChange={e => manejarCambio('fechaFin', e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group-premium">
                <label>Hora de Inicio *</label>
                <input 
                  type="time" 
                  value={nuevoCurso.horario.horaInicio} 
                  onChange={e => manejarCambio('horario.horaInicio', e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group-premium">
                <label>Hora de Finalización *</label>
                <input 
                  type="time" 
                  value={nuevoCurso.horario.horaFin} 
                  onChange={e => manejarCambio('horario.horaFin', e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="form-group-premium">
              <label>Días de Clases *</label>
              <div className="dias-checkbox-premium">
                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                  <label key={dia} className="checkbox-label-premium">
                    <input
                      type="checkbox"
                      checked={nuevoCurso.horario.dias.includes(dia)}
                      onChange={() => manejarCambioDias(dia)}
                    />
                    <span className="checkmark"></span>
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer-premium">
            <button type="button" className="btn-cancelar-premium" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-premium">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {modoEdicion ? 'Actualizar' : 'Crear'} Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoModal;
