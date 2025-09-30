import React, { useState,useEffect } from 'react';


const ProgramaModal = ({ 
  mostrar,
  modoEdicion,
  programaSeleccionado,
  formData,
  setFormData,
  onClose,
  onSubmit
}) => {
  const [errors, setErrors] = useState({});
  
  // Función handleChange unificada
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
 
   useEffect(() => {
     if (modoEdicion && programaSeleccionado) {
       console.log('Modal - Programa seleccionado:', programaSeleccionado);
       setFormData({
         titulo: programaSeleccionado.nombre || '', // backend usa 'nombre'
         descripcion: programaSeleccionado.descripcion || '',
         tipo: programaSeleccionado.tipo || 'curso', // este es para el select del frontend
         modalidad: programaSeleccionado.modalidad || 'presencial',
         duracion: programaSeleccionado.duracion || '',
         precio: programaSeleccionado.precio || '',
         fechaInicio: programaSeleccionado.fechaInicio ? programaSeleccionado.fechaInicio.split('T')[0] : '',
         fechaFin: programaSeleccionado.fechaFin ? programaSeleccionado.fechaFin.split('T')[0] : '',
         cupos: programaSeleccionado.cuposDisponibles || '', // backend usa 'cuposDisponibles'
         profesor: programaSeleccionado.profesor || '',
         profesorBio: programaSeleccionado.profesorBio || '',
         requisitos: programaSeleccionado.requisitos || [''],
         pensum: programaSeleccionado.pensum || [{ modulo: '', descripcion: '', horas: '' }],
         objetivos: programaSeleccionado.objetivos || [''],
         metodologia: programaSeleccionado.metodologia || '',
         evaluacion: programaSeleccionado.evaluacion || '',
         certificacion: programaSeleccionado.certificacion || '',
         imagen: programaSeleccionado.imagen || '',
         destacado: programaSeleccionado.destacado || false
       });
       console.log('Modal - FormData actualizado');
     }
   }, [modoEdicion, programaSeleccionado, setFormData]);
 
   const handleInputChange = (e) => {
     const { name, value, type, checked } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: type === 'checkbox' ? checked : value
     }));
   };
 
   const handleArrayInputChange = (index, value, arrayName) => {
     setFormData(prev => ({
       ...prev,
       [arrayName]: prev[arrayName].map((item, i) => 
         i === index ? value : item
       )
     }));
   };
 
   const handlePensumChange = (index, field, value) => {
     setFormData(prev => ({
       ...prev,
       pensum: prev.pensum.map((item, i) =>
         i === index ? { ...item, [field]: value } : item
       )
     }));
   };
 
   const addArrayItem = (arrayName, defaultValue) => {
     setFormData(prev => ({
       ...prev,
       [arrayName]: [...prev[arrayName], defaultValue]
     }));
   };
 
   const removeArrayItem = (index, arrayName) => {
     setFormData(prev => ({
       ...prev,
       [arrayName]: prev[arrayName].filter((_, i) => i !== index)
     }));
   };
 
   const validateForm = () => {
     const newErrors = {};
     
     if (!formData.titulo?.trim()) newErrors.titulo = 'El título es requerido';
     if (!formData.descripcion?.trim()) newErrors.descripcion = 'La descripción es requerida';
     if (!formData.duracion?.trim()) newErrors.duracion = 'La duración es requerida';
     if (!formData.precio) newErrors.precio = 'El precio es requerido';
     if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
     if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es requerida';
     if (!formData.cupos) newErrors.cupos = 'Los cupos son requeridos';
     if (!formData.profesor?.trim()) newErrors.profesor = 'El profesor es requerido';
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
     if (validateForm()) {
       onSubmit(e);
     }
   };

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{modoEdicion ? 'Editar Programa' : 'Crear Nuevo Programa'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              {/* Información Básica */}
              <div className="form-group-tesorero">
                <label>Título del Programa *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo || ''}
                  onChange={handleChange}
                  placeholder="Nombre del programa"
                  required
                />
                {errors.titulo && <span className="error-text">{errors.titulo}</span>}
              </div>

              <div className="form-group-tesorero">
                <label>Tipo de Programa</label>
                <select
                  name="tipo"
                  value={formData.tipo || 'curso'}
                  onChange={handleChange}
                  required
                >
                  <option value="curso">Curso</option>
                  <option value="programa">Programa Técnico</option>
                </select>
              </div>

              <div className="form-group-tesorero full-width">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  placeholder="Descripción detallada del programa"
                  rows="4"
                  required
                />
                {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
              </div>

              {/* Modalidad y Duración */}
              <div className="form-group-tesorero">
                <label>Modalidad *</label>
                <select
                  name="modalidad"
                  value={formData.modalidad || 'presencial'}
                  onChange={handleChange}
                  required
                >
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="semipresencial">Semipresencial</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Duración *</label>
                <input
                  type="text"
                  name="duracion"
                  value={formData.duracion || ''}
                  onChange={handleChange}
                  placeholder="Ej: 6 meses, 120 horas"
                  required
                />
                {errors.duracion && <span className="error-text">{errors.duracion}</span>}
              </div>

              {/* Fechas */}
              <div className="form-group-tesorero">
                <label>Fecha de Inicio *</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio || ''}
                  onChange={handleChange}
                  required
                />
                {errors.fechaInicio && <span className="error-text">{errors.fechaInicio}</span>}
              </div>

              <div className="form-group-tesorero">
                <label>Fecha de Fin *</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin || ''}
                  onChange={handleChange}
                  required
                />
                {errors.fechaFin && <span className="error-text">{errors.fechaFin}</span>}
              </div>

              {/* Precio y Cupos */}
              <div className="form-group-tesorero">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio || ''}
                  onChange={handleChange}
                  placeholder="Precio del programa"
                  min="0"
                  required
                />
                {errors.precio && <span className="error-text">{errors.precio}</span>}
              </div>

              <div className="form-group-tesorero">
                <label>Cupos Disponibles *</label>
                <input
                  type="number"
                  name="cupos"
                  value={formData.cupos || ''}
                  onChange={handleChange}
                  placeholder="Número de cupos"
                  min="1"
                  required
                />
                {errors.cupos && <span className="error-text">{errors.cupos}</span>}
              </div>

              {/* Profesor */}
              <div className="form-group-tesorero">
                <label>Profesor *</label>
                <input
                  type="text"
                  name="profesor"
                  value={formData.profesor || ''}
                  onChange={handleChange}
                  placeholder="Nombre del profesor"
                  required
                />
                {errors.profesor && <span className="error-text">{errors.profesor}</span>}
              </div>

              <div className="form-group-tesorero">
                <label>Biografía del Profesor</label>
                <textarea
                  name="profesorBio"
                  value={formData.profesorBio || ''}
                  onChange={handleChange}
                  placeholder="Experiencia y formación del profesor"
                  rows="3"
                />
              </div>

              {/* Metodología y Evaluación */}
              <div className="form-group-tesorero full-width">
                <label>Metodología</label>
                <textarea
                  name="metodologia"
                  value={formData.metodologia || ''}
                  onChange={handleChange}
                  placeholder="Metodología de enseñanza"
                  rows="3"
                />
              </div>

              <div className="form-group-tesorero full-width">
                <label>Sistema de Evaluación</label>
                <textarea
                  name="evaluacion"
                  value={formData.evaluacion || ''}
                  onChange={handleChange}
                  placeholder="Cómo se evaluará a los estudiantes"
                  rows="3"
                />
              </div>

              {/* Requisitos */}
              <div className="form-group-tesorero full-width">
                <label>Requisitos</label>
                {(formData.requisitos || ['']).map((requisito, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={requisito}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'requisitos')}
                      placeholder={`Requisito ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requisitos')}
                      className="remove-btn"
                      disabled={(formData.requisitos || []).length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requisitos', '')}
                  className="add-btn"
                >
                  + Agregar Requisito
                </button>
              </div>

              {/* Objetivos */}
              <div className="form-group-tesorero full-width">
                <label>Objetivos del Programa</label>
                {(formData.objetivos || ['']).map((objetivo, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={objetivo}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'objetivos')}
                      placeholder={`Objetivo ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'objetivos')}
                      className="remove-btn"
                      disabled={(formData.objetivos || []).length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('objetivos', '')}
                  className="add-btn"
                >
                  + Agregar Objetivo
                </button>
              </div>

              {/* Pensum */}
              <div className="form-group-tesorero full-width">
                <label>Pensum Académico</label>
                {(formData.pensum || [{ modulo: '', descripcion: '', horas: '' }]).map((modulo, index) => (
                  <div key={index} className="pensum-group">
                    <input
                      type="text"
                      value={modulo.modulo}
                      onChange={(e) => handlePensumChange(index, 'modulo', e.target.value)}
                      placeholder="Nombre del módulo"
                    />
                    <input
                      type="text"
                      value={modulo.descripcion}
                      onChange={(e) => handlePensumChange(index, 'descripcion', e.target.value)}
                      placeholder="Descripción"
                    />
                    <input
                      type="number"
                      value={modulo.horas}
                      onChange={(e) => handlePensumChange(index, 'horas', e.target.value)}
                      placeholder="Horas"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'pensum')}
                      className="remove-btn"
                      disabled={(formData.pensum || []).length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('pensum', { modulo: '', descripcion: '', horas: '' })}
                  className="add-btn"
                >
                  + Agregar Módulo
                </button>
              </div>

              {/* Opciones adicionales */}
              <div className="form-group-tesorero">
                <label>URL de Imagen</label>
                <input
                  type="url"
                  name="imagen"
                  value={formData.imagen || ''}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="form-group-tesorero">
                <label>Certificación</label>
                <input
                  type="text"
                  name="certificacion"
                  value={formData.certificacion || ''}
                  onChange={handleChange}
                  placeholder="Tipo de certificación que se otorga"
                />
              </div>

              <div className="form-group-tesorero checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado || false}
                    onChange={handleChange}
                  />
                  Programa Destacado
                </label>
              </div>
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {modoEdicion ? 'Guardar Cambios' : 'Crear Programa'}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default ProgramaModal;