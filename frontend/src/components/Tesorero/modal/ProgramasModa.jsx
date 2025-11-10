
import React, { useState,useEffect } from 'react';
import './ProgramasModa.css';
import PropTypes from 'prop-types';

const ProgramaModal = ({ 
  mostrar,
  modoEdicion,
  modoVista = false,
  programaSeleccionado,
  formData,
  setFormData,
  onClose,
  onSubmit
}) => {
  const [errors, setErrors] = useState({});
  
  // Función handleChange unificada
 
 
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
          {modoVista ? (
            <h2>Detalle del Programa</h2>
          ) : (
            <h2>{modoEdicion ? 'Editar Programa' : 'Crear Nuevo Programa'}</h2>
          )}
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body-tesorero">
          {modoVista ? (
            <div className="programa-detalle-card">
              {formData.imagen && (
                <div className="programa-detalle-imagen">
                  <img src={formData.imagen} alt="Imagen del programa" style={{maxWidth:'100%',borderRadius:'8px',marginBottom:'1rem'}} />
                </div>
              )}
              <div className="programa-detalle-info">
                <div className="detalle-row"><span className="detalle-label">Título:</span> <span>{formData.titulo}</span></div>
                <div className="detalle-row"><span className="detalle-label">Tipo:</span> <span>{formData.tipo === 'curso' ? 'Curso' : 'Programa Técnico'}</span></div>
                <div className="detalle-row"><span className="detalle-label">Descripción:</span> <span>{formData.descripcion}</span></div>
                <div className="detalle-row"><span className="detalle-label">Modalidad:</span> <span>{formData.modalidad}</span></div>
                <div className="detalle-row"><span className="detalle-label">Duración:</span> <span>{formData.duracion}</span></div>
                <div className="detalle-row"><span className="detalle-label">Fecha de Inicio:</span> <span>{formData.fechaInicio}</span></div>
                <div className="detalle-row"><span className="detalle-label">Fecha de Fin:</span> <span>{formData.fechaFin}</span></div>
                <div className="detalle-row"><span className="detalle-label">Precio:</span> <span>${formData.precio}</span></div>
                <div className="detalle-row"><span className="detalle-label">Cupos Disponibles:</span> <span>{formData.cupos}</span></div>
                <div className="detalle-row"><span className="detalle-label">Profesor:</span> <span>{formData.profesor}</span></div>
                {formData.profesorBio && <div className="detalle-row"><span className="detalle-label">Biografía del Profesor:</span> <span>{formData.profesorBio}</span></div>}
                {formData.metodologia && <div className="detalle-row"><span className="detalle-label">Metodología:</span> <span>{formData.metodologia}</span></div>}
                {formData.evaluacion && <div className="detalle-row"><span className="detalle-label">Sistema de Evaluación:</span> <span>{formData.evaluacion}</span></div>}
                {formData.certificacion && <div className="detalle-row"><span className="detalle-label">Certificación:</span> <span>{formData.certificacion}</span></div>}
                <div className="detalle-row"><span className="detalle-label">Programa Destacado:</span> <span>{formData.destacado ? 'Sí' : 'No'}</span></div>
                {formData.requisitos && formData.requisitos.length > 0 && (
                  <div className="detalle-row">
                    <span className="detalle-label">Requisitos:</span>
                    <ul style={{margin:0,paddingLeft:'1.2em'}}>
                      {formData.requisitos.map((req, index) => req && <li key={`req-${index}-${req.substring(0, 10)}`}>{req}</li>)}
                    </ul>
                  </div>
                )}
                {formData.objetivos && formData.objetivos.length > 0 && (
                  <div className="detalle-row">
                    <span className="detalle-label">Objetivos:</span>
                    <ul style={{margin:0,paddingLeft:'1.2em'}}>
                      {formData.objetivos.map((obj, index) => obj && <li key={`obj-${index}-${obj.substring(0, 10)}`}>{obj}</li>)}
                    </ul>
                  </div>
                )}
                {formData.pensum && formData.pensum.length > 0 && (
                  <div className="detalle-row">
                    <span className="detalle-label">Pensum Académico:</span>
                    <ul style={{margin:0,paddingLeft:'1.2em'}}>
                      {formData.pensum.map((mod, index) => (
                        <li key={`pensum-${index}-${(mod.modulo || '').substring(0, 10)}`}><b>{mod.modulo}</b>: {mod.descripcion} ({mod.horas} horas)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer-tesorero" style={{marginTop:'2rem'}}>
                <button type="button" className="cancel-btn" onClick={onClose}>Cerrar</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ...existing code... */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
ProgramaModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  programaSeleccionado: PropTypes.object,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  modoVista: PropTypes.bool
};

export default ProgramaModal;