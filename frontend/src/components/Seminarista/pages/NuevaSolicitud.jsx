

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes, FaDoorOpen, FaGraduationCap,
   FaEllipsisH, FaArrowLeft, FaArrowRight, FaPaperPlane,
  FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle,
  FaCloudUploadAlt, FaFile,
} from 'react-icons/fa';
import './NuevaSolicitud.css';
import Header from '../Shared/Header';
import { solicitudService } from '../../../services/solicirudService';
import { categorizacionService } from '../../../services/categorizacionService';
import { userService } from '../../../services/userService'; // Debes tener un servicio para usuarios
import Footer from '../../footer/Footer';
import { mostrarAlerta } from '../../utils/alertas';
import { eventService } from '../../../services/eventService';
import { cabanaService } from '../../../services/cabanaService';
import { programasAcademicosService } from '../../../services/programasAcademicosService';
import { inscripcionService } from '../../../services/inscripcionService';
import { reservaService } from '../../../services/reservaService';


// Validaciones previas al envío
function validateBeforeSubmit({ acceptTerms, tesoreroId, formData, showToast }) {
  if (!acceptTerms) {
    showToast('warning', 'Términos requeridos', 'Debes aceptar los términos y condiciones');
    return false;
  }
  if (!tesoreroId) {
    showToast('error', 'Responsable no encontrado', 'No se pudo asignar el tesorero como responsable');
    return false;
  }
  if (!formData.requestTitle || !formData.requestDescription) {
    showToast('error', 'Campos requeridos', 'El título y la descripción son obligatorios');
    return false;
  }
  return true;
}

// Construye el objeto que se enviará al servicio
function buildSolicitudData({ formData, selectedType, tesoreroId, modeloReferencia, referencia, categories, usuario }) {
  const data = {
    solicitante: usuario._id || usuario.id,
    titulo: formData.requestTitle,
    correo: formData.correo || usuario.correo || usuario.email,
    telefono: formData.telefono || usuario.telefono || '',
    tipoSolicitud: selectedType,
    categoria: formData.category || categories[0]?._id,
    descripcion: formData.requestDescription,
    prioridad: formData.requestPriority || 'Media',
    responsable: tesoreroId,
    origen: 'formulario'
  };
  if (modeloReferencia) data.modeloReferencia = modeloReferencia;
  if (referencia) data.referencia = referencia;
  if (formData.requestJustification) data.observaciones = formData.requestJustification;
  return data;
}

// Procesa la respuesta del servicio y muestra toasts/alertas
async function processSubmissionResponse(response, { showToast, setFormData, setSelectedType, setAcceptTerms }) {
  if (response && response.success) {
    showToast('success', '¡Solicitud enviada!', 'Tu solicitud ha sido registrada correctamente.');
    try { mostrarAlerta('¡Solicitud enviada!', 'Tu solicitud ha sido registrada correctamente.', 'success'); } catch (e) { console.warn('mostrarAlerta falló:', e); }
    setFormData({});
    setSelectedType('');
    setAcceptTerms(false);
  } else {
    const msg = (response && response.message) || 'No se pudo enviar la solicitud';
    showToast('error', 'Error al enviar', msg);
    try { mostrarAlerta('Error al enviar', msg, 'error'); } catch (e) { console.warn('mostrarAlerta falló:', e); }
  }
}

// Función principal simplificada para enviar la solicitud
async function submitSolicitud({ formData, selectedType, acceptTerms, tesoreroId, modeloReferencia, referencia, categories, showToast, setFormData, setSelectedType, setAcceptTerms }) {
  if (!validateBeforeSubmit({ acceptTerms, tesoreroId, formData, showToast })) return;

  showToast('info', 'Enviando solicitud', 'Por favor espera...');

  const usuarioStorage = localStorage.getItem('usuario');
  const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
  if (!usuario) {
    showToast('error', 'Usuario no encontrado', 'Debes iniciar sesión para enviar la solicitud');
    return;
  }

  const solicitudData = buildSolicitudData({ formData, selectedType, tesoreroId, modeloReferencia, referencia, categories, usuario });

  try {
    const response = await solicitudService.create(solicitudData);
    await processSubmissionResponse(response, { showToast, setFormData, setSelectedType, setAcceptTerms });
  } catch (err) {
    console.error('Error enviando solicitud:', err);
    const msg = err?.message || 'No se pudo enviar la solicitud';
    showToast('error', 'Error al enviar', msg);
    try { mostrarAlerta('Error al enviar', msg, 'error'); } catch (e) { console.warn('mostrarAlerta falló:', e); }
  }
}

// Helper para cargar referencias usando los services (evita endpoints hardcodeados)
async function cargarOpcionesReferenciaGlobal(modelo, token, setOpcionesReferencia) {
  try {
    let result = [];
    switch (modelo) {
      case 'Eventos':
        result = await eventService.getAllEvents();
        break;
      case 'Cabana':
        result = await cabanaService.getAll();
        break;
      case 'ProgramaAcademico':
        result = await programasAcademicosService.getAllProgramas();
        break;
      case 'Inscripcion':
        result = await inscripcionService.getAll();
        break;
      case 'Reserva':
        result = await reservaService.getAll();
        break;
      default:
        result = [];
    }

    // Normalizar distintas formas de respuesta y asignar un array
    let items = [];
    if (Array.isArray(result)) items = result;
    else if (result && Array.isArray(result.data)) items = result.data;
    else if (result && Array.isArray(result.data?.data)) items = result.data.data;
    else if (result && result.data) items = Array.isArray(result.data) ? result.data : [result.data];
    else if (result && typeof result === 'object') items = result.items || [];

    setOpcionesReferencia(items || []);
  } catch (err) {
    setOpcionesReferencia([]);
    console.error('Error cargando referencias:', err);
  }
}

// Componentes auxiliares extraídos para reducir la complejidad de `NuevaSolicitud`
const ProgressSteps = ({ currentStep }) => (
  <div className="progress-steps-nuevasolicitud">
    <div className={`step-nuevasolicitud ${currentStep > 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
      <div className="step-number-nuevasolicitud">1</div>
      <div className="step-label-nuevasolicitud">Tipo de Solicitud</div>
    </div>
    <div className={`step-nuevasolicitud ${currentStep > 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
      <div className="step-number-nuevasolicitud">2</div>
      <div className="step-label-nuevasolicitud">Detalles</div>
    </div>
    <div className={`step-nuevasolicitud ${currentStep === 3 ? 'active' : ''}`}>
      <div className="step-number-nuevasolicitud">3</div>
      <div className="step-label-nuevasolicitud">Confirmación</div>
    </div>
  </div>
);

ProgressSteps.propTypes = {
  currentStep: PropTypes.number.isRequired
};


const PermisoFields = ({ handleInputChange }) => (
  <>
    <div className="form-row-nuevasolicitud">
      <div className="form-group-nuevasolicitud">
        <label htmlFor="exitDate">Fecha de Salida *</label>
        <input type="date" id="exitDate" name="exitDate" required onChange={handleInputChange} />
      </div>
      <div className="form-group-nuevasolicitud">
        <label htmlFor="returnDate">Fecha de Regreso </label>
        <input type="date" id="returnDate" name="returnDate" required onChange={handleInputChange} />
      </div>
    </div>
    <div className="form-group-nuevasolicitud">
      <label htmlFor="destination">Destino</label>
      <input type="text" id="destination" name="destination" placeholder="¿A dónde vas?" onChange={handleInputChange} />
    </div>
    <div className="form-group-nuevasolicitud">
      <label htmlFor="emergencyContact">Contacto de Emergencia</label>
      <input type="text" id="emergencyContact" name="emergencyContact" placeholder="Nombre y teléfono" onChange={handleInputChange} />
    </div>
  </>
);

PermisoFields.propTypes = {
  handleInputChange: PropTypes.func.isRequired
};



const AcademicoFields = ({ handleInputChange }) => (
  <>
    <div className="form-row-nuevasolicitud">
      <div className="form-group-nuevasolicitud">
        <label htmlFor="subject">Materia</label>
        <select id="subject" name="subject" onChange={handleInputChange}>
          <option value="">Seleccionar materia</option>
          <option value="teologia">Teología Dogmática</option>
          <option value="filosofia">Filosofía</option>
          <option value="liturgia">Liturgia</option>
          <option value="pastoral">Teología Pastoral</option>
          <option value="escritura">Sagrada Escritura</option>
        </select>
      </div>
      <div className="form-group-nuevasolicitud">
        <label htmlFor="semester">Semestre</label>
        <select id="semester" name="semester" onChange={handleInputChange}>
          <option value="">Seleccionar semestre</option>
          <option value="1">Primer Semestre</option>
          <option value="2">Segundo Semestre</option>
          <option value="3">Tercer Semestre</option>
          <option value="4">Cuarto Semestre</option>
          <option value="5">Quinto Semestre</option>
          <option value="6">Sexto Semestre</option>
        </select>
      </div>
    </div>
    <div className="form-group-nuevasolicitud">
      <label htmlFor="currentSchedule">Horario Actual</label>
      <textarea id="currentSchedule" name="currentSchedule" rows="3" placeholder="Describe tu horario actual" onChange={handleInputChange}></textarea>
    </div>
    <div className="form-group-nuevasolicitud">
      <label htmlFor="proposedSchedule">Horario Propuesto</label>
      <textarea id="proposedSchedule" name="proposedSchedule" rows="3" placeholder="Describe el horario que propones" onChange={handleInputChange}></textarea>
    </div>
  </>
);

AcademicoFields.propTypes = {
  handleInputChange: PropTypes.func.isRequired
};



const DefaultFields = ({ categories, modeloCategoriaMap, modeloReferencia, referencia, formData, handleInputChange }) => {
  const filterCategories = () => {
    return categories.filter(cat => {
      if (referencia && formData.category) {
        return cat._id === formData.category;
      }
      const tipoCategoria = modeloCategoriaMap[modeloReferencia] || 'general';
      return !modeloReferencia || cat.tipo === tipoCategoria || cat.tipo === 'general';
    });
  };

  return (
    <>
      <div className="form-group-nuevasolicitud">
        <label htmlFor="category">
          Categoría Específica
          {referencia && formData.category && (
            <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>(Seleccionada automáticamente según el evento)</span>
          )}
        </label>
        <select id="category" name="category" value={formData.category || ''} onChange={handleInputChange} required disabled={!!referencia}>
          <option value="">{referencia ? 'Categoría asociada al evento seleccionado' : 'Selecciona una categoría'}</option>
          {filterCategories().map(cat => (
            <option key={cat._id} value={cat._id}>{cat.nombre} {cat.codigo ? `(${cat.codigo})` : ''}</option>
          ))}
        </select>
        {referencia && formData.category && (
          <small style={{ color: '#6c757d', fontSize: '12px' }}>Esta categoría se seleccionó automáticamente porque está asociada al evento elegido.</small>
        )}
      </div>
      <div className="form-group-nuevasolicitud">
        <label htmlFor="additionalInfo">Información Adicional</label>
        <textarea id="additionalInfo" name="additionalInfo" rows="4" placeholder="Proporciona cualquier información adicional relevante" onChange={handleInputChange}></textarea>
      </div>
    </>
  );
};

DefaultFields.propTypes = {
  categories: PropTypes.array.isRequired,
  modeloCategoriaMap: PropTypes.object.isRequired,
  modeloReferencia: PropTypes.string,
  referencia: PropTypes.string,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};



const DynamicFields = (props) => {
  const { selectedType } = props;
  switch (selectedType) {
    case 'permiso':
      return <PermisoFields {...props} />;
    case 'academico':
      return <AcademicoFields {...props} />;
    default:
      return <DefaultFields {...props} />;
  }
};

DynamicFields.propTypes = {
  selectedType: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  categories: PropTypes.array,
  modeloCategoriaMap: PropTypes.object,
  modeloReferencia: PropTypes.string,
  referencia: PropTypes.string,
  formData: PropTypes.object
};

// Componente para Step 1 - Selector de tipo de solicitud
const RequestTypeSelector = ({ typeConfigs, formState, handlers }) => (
  <div className="step-content-nuevasolicitud" style={{ display: formState.currentStep === 1 ? 'block' : 'none' }}>
    <div className="step-header-nuevasolicitud">
      <h2>Paso 1: Selecciona el Tipo de Solicitud</h2>
      <p>Elige la categoría que mejor describa tu solicitud</p>
    </div>
    <div className="request-types-nuevasolicitud">
      {Object.entries(typeConfigs).map(([type, config]) => (
        <button
          key={type}
          type="button"
          className={`request-type-card-nuevasolicitud ${formState.selectedType === type ? 'selected' : ''}`}
          onClick={() => handlers.selectRequestType(type)}
          data-type={type}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <div className="card-icon-nuevasolicitud">
            {config.icon}
          </div>
          <div className="card-content-nuevasolicitud">
            <h3>{config.title}</h3>
            <p>{config.description}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

RequestTypeSelector.propTypes = {
  typeConfigs: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired
};

// Componente para Step 2 - Detalles de la solicitud
const StepTwo = ({ 
  formState, 
  handlers, 
  typeConfigs, 
  usuarioLogueado, 
  categories, 
  modeloCategoriaMap, 
  fileManager,
  minDate
}) => {
  if (formState.currentStep !== 2) return null;

  return (
    <div className="step-content-nuevasolicitud">
      <div className="step-header-nuevasolicitud">
        <h2>Paso 2: Completa los Detalles</h2>
        <p>Proporciona toda la información necesaria para tu solicitud</p>
        <button
          className="change-type-btn-nuevasolicitud"
          onClick={() => formState.setCurrentStep(1)}
        >
          <FaArrowLeft />
          <span>Cambiar tipo</span>
        </button>
      </div>

      <div className="selected-type-nuevasolicitud">
        <div className="selected-type-icon-nuevasolicitud">
          {typeConfigs[formState.selectedType]?.icon}
        </div>
        <div className="selected-type-content-nuevasolicitud">
          <h3>{typeConfigs[formState.selectedType]?.title}</h3>
          <p>{typeConfigs[formState.selectedType]?.description}</p>
        </div>
      </div>

      <div className="request-form-nuevasolicitud">
        <div className="form-row-nuevasolicitud">
          <div className="form-group-nuevasolicitud">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={usuarioLogueado?.correo || usuarioLogueado?.correoElectronico || usuarioLogueado?.email || ''}
              readOnly
              disabled
            />
          </div>
          <div className="form-group-nuevasolicitud">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={usuarioLogueado?.telefono || ''}
              readOnly
              disabled
            />
          </div>
        </div>
        
        <ReferenceFields formState={formState} handlers={handlers} />
        <MainFormFields handlers={handlers} minDate={minDate} />

        <div className="dynamic-fields">
          <DynamicFields
            selectedType={formState.selectedType}
            handleInputChange={handlers.handleInputChange}
            categories={categories}
            modeloCategoriaMap={modeloCategoriaMap}
            modeloReferencia={formState.modeloReferencia}
            referencia={formState.referencia}
            formData={formState.formData}
          />
        </div>

        <FileUploadSection formState={formState} fileManager={fileManager} />
      </div>
    </div>
  );
};

StepTwo.propTypes = {
  formState: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  typeConfigs: PropTypes.object.isRequired,
  usuarioLogueado: PropTypes.object,
  categories: PropTypes.array,
  modeloCategoriaMap: PropTypes.object.isRequired,
  fileManager: PropTypes.object.isRequired,
  minDate: PropTypes.string
};

// Componente para campos de referencia dinámica
const ReferenceFields = ({ formState, handlers }) => {
  if (!(formState.selectedType === 'Inscripción' || formState.selectedType === 'Hospedaje')) {
    return null;
  }
  
  return (
    <>
      <div className="form-group-nuevasolicitud">
        <label htmlFor="modeloReferencia">Modelo de Referencia</label>
        <select
          id="modeloReferencia"
          name="modeloReferencia"
          value={formState.modeloReferencia}
          onChange={handlers.handleInputChange}
          required
        >
          <option value="">Selecciona el modelo</option>
          <option value="Eventos">Evento</option>
          <option value="Cabana">Cabaña</option>
          <option value="ProgramaAcademico">Programa Académico</option>
          <option value="Inscripcion">Inscripción</option>
          <option value="Reserva">Reserva</option>
          <option value="Comedor">Comedor</option>
        </select>
      </div>
      {formState.modeloReferencia && (
        <div className="form-group-nuevasolicitud">
          <label htmlFor="referencia">Referencia</label>
          <select
            id="referencia"
            name="referencia"
            value={formState.referencia}
            onChange={handlers.handleInputChange}
            required
          >
            <option value="">Selecciona una opción</option>
            {formState.opcionesReferencia.map((op) => (
              <option key={op._id || op.id} value={op._id || op.id}>
                {op.nombre || op.titulo || op.descripcion || op._id}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

ReferenceFields.propTypes = {
  formState: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired
};



// Componente para campos principales del formulario
const MainFormFields = ({ handlers, minDate }) => (
  <>
    <div className="form-group-nuevasolicitud">
      <label htmlFor="requestTitle">Título de la Solicitud</label>
      <input
        type="text"
        id="requestTitle"
        name="requestTitle"
        required
        onChange={handlers.handleInputChange}
      />
      <div className="error-message"></div>
    </div>
    
    <div className="form-group-nuevasolicitud">
      <label htmlFor="requestDescription">Descripción Detallada</label>
      <textarea
        id="requestDescription"
        name="requestDescription"
        rows="6"
        placeholder="Describe detalladamente lo que necesitas..."
        required
        onChange={handlers.handleInputChange}
      ></textarea>
      <div className="error-message"></div>
    </div>
    
    <div className="form-group-nuevasolicitud">
      <label htmlFor="requestJustification">Justificación</label>
      <textarea
        id="requestJustification"
        name="requestJustification"
        rows="4"
        placeholder="Explica por qué es necesaria esta solicitud..."
        required
        onChange={handlers.handleInputChange}
      ></textarea>
      <div className="error-message"></div>
    </div>
    
    <div className="form-row-nuevasolicitud">
      <div className="form-group-nuevasolicitud">
        <label htmlFor="requestPriority">Prioridad</label>
        <select
          id="requestPriority"
          name="requestPriority"
          onChange={handlers.handleInputChange}
        >
          <option value="Baja">Baja</option>
          <option value="Media" selected>Media</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
      
      <div className="form-group-nuevasolicitud">
        <label htmlFor="requestDate">Fecha Requerida</label>
        <input
          type="date"
          id="requestDate"
          name="requestDate"
          onChange={handlers.handleInputChange}
          min={minDate}
        />
      </div>
    </div>
  </>
);

MainFormFields.propTypes = {
  handlers: PropTypes.object.isRequired,
  minDate: PropTypes.string
};

// Utilitarios extraídos
const getPriorityLabel = (priority) => {
  const labels = {
    'baja': 'Baja',
    'normal': 'Normal',
    'alta': 'Alta',
    'urgente': 'Urgente'
  };
  return labels[priority] || 'Normal';
};

// Componente para Step 3 - Confirmación
const ConfirmationContent = ({ formState, typeConfigs, formatDate, getPriorityLabel }) => (
  <div className="step-content-nuevasolicitud" style={{ display: formState.currentStep === 3 ? 'block' : 'none' }}>
    <div className="step-header-nuevasolicitud">
      <h2>Paso 3: Confirmación</h2>
      <p>Revisa todos los detalles antes de enviar tu solicitud</p>
    </div>
    
    <div className="confirmation-content-nuevasolicitud">
      <div className="confirmation-card-nuevasolicitud">
        <h3>Resumen de la Solicitud</h3>
        <div className="confirmation-details-nuevasolicitud">
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Tipo de Solicitud:</div>
            <div className="detail-value-nuevasolicitud">{typeConfigs[formState.selectedType]?.title}</div>
          </div>
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Título:</div>
            <div className="detail-value-nuevasolicitud">{formState.formData.requestTitle || 'No especificado'}</div>
          </div>
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Prioridad:</div>
            <div className="detail-value-nuevasolicitud">{getPriorityLabel(formState.formData.requestPriority)}</div>
          </div>
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Fecha Requerida:</div>
            <div className="detail-value-nuevasolicitud">{formatDate(formState.formData.requestDate)}</div>
          </div>
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Descripción:</div>
            <div className="detail-value-nuevasolicitud">{formState.formData.requestDescription || 'No especificada'}</div>
          </div>
          <div className="detail-row-nuevasolicitud">
            <div className="detail-label-nuevasolicitud">Archivos Adjuntos:</div>
            <div className="detail-value-nuevasolicitud">{formState.uploadedFiles.length} archivo(s)</div>
          </div>
        </div>
      </div>
      
      <div className="terms-section-nuevasolicitud">
        <label className="checkbox-container-nuevasolicitud">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formState.acceptTerms}
            onChange={(e) => formState.setAcceptTerms(e.target.checked)}
          />
          <span>Acepto los términos y condiciones del seminario</span>
        </label>
      </div>
    </div>
  </div>
);

ConfirmationContent.propTypes = {
  formState: PropTypes.object.isRequired,
  typeConfigs: PropTypes.object.isRequired,
  formatDate: PropTypes.func.isRequired,
  getPriorityLabel: PropTypes.func.isRequired
};

const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Componente para sección de carga de archivos
const FileUploadSection = ({ formState, fileManager }) => (
  <div className="form-group-nuevasolicitud">
    <label htmlFor="fileInput">Documentos Adjuntos</label>
    <div className="file-upload-area">
      <div className="file-upload-content">
        <FaCloudUploadAlt />
        <p>Arrastra archivos aquí o <span className="upload-link">selecciona archivos</span></p>
        <small>Máximo 5MB por archivo. Formatos: PDF, DOC, DOCX, JPG, PNG</small>
      </div>
      <input
        type="file"
        id="fileInput"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={fileManager.handleFileUpload}
      />
    </div>
    <div className="uploaded-files-nuevasolicitud">
      {formState.uploadedFiles.map(file => (
        <div key={file.name} className="uploaded-file-nuevasolicitud">
          <div className="file-info-nuevasolicitud">
            <FaFile className="file-icon-nuevasolicitud" />
            <div className="file-details-nuevasolicitud">
              <div className="file-name-nuevasolicitud">{file.name}</div>
              <div className="file-size-nuevasolicitud">{fileManager.formatFileSize(file.size)}</div>
            </div>
          </div>
          <button
            type="button"
            className="remove-file"
            onClick={() => fileManager.removeFile(file.name)}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  </div>
);

FileUploadSection.propTypes = {
  formState: PropTypes.object.isRequired,
  fileManager: PropTypes.object.isRequired
};

const validateFormHelper = (formData, currentStep) => {
  if (currentStep === 2) {
    if (!formData.requestTitle || !formData.requestDescription || !formData.requestJustification) {
      return false;
    }
  }
  return true;
};

const validateSubmissionHelper = (formData, acceptTerms, tesoreroId, showToast) => {
  return validateBeforeSubmit({ acceptTerms, tesoreroId, formData, showToast });
};

const validateFileHelper = (file, showToast) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];

  if (file.size > maxSize) {
    showToast('error', 'Archivo muy grande', `El archivo ${file.name} excede el límite de 5MB`);
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    showToast('error', 'Tipo de archivo no válido', `El archivo ${file.name} no es un tipo permitido`);
    return false;
  }

  return true;
};

// Custom hooks para reducir complejidad
const useUsuario = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      setUsuarioLogueado(JSON.parse(usuarioStorage));
    }
  }, []);
  
  return usuarioLogueado;
};

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categorizacionService.getAll();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error al cargar categorías:', err.message);
      }
    };
    fetchCategories();
  }, []);
  
  return categories;
};

const useTesorero = () => {
  const [tesoreroId, setTesoreroId] = useState(null);
  
  useEffect(() => {
    const fetchTesorero = async () => {
      try {
        const res = await userService.getAllUsers();
        const tesorero = res.data.find(u => u.role === 'tesorero');
        if (tesorero) setTesoreroId(tesorero._id);
      } catch (err) {
        console.log('Error fetching tesorero:', err);
      }
    };
    fetchTesorero();
  }, []);
  
  return tesoreroId;
};

// Helpers para toast y archivos
const createToastManager = (toasts, setToasts, setRemoveToast) => ({
  showToast: (type, title, message) => {
    const newToast = { id: Date.now(), type, title, message };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => setRemoveToast(newToast.id), 5000);
  },
  removeToast: (id) => setToasts(prev => prev.filter(toast => toast.id !== id))
});

const createFileManager = (uploadedFiles, setUploadedFiles, showToast) => ({
  handleFileUpload: (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => validateFileHelper(f, showToast));
    setUploadedFiles(prev => [...prev, ...validFiles]);
  },
  removeFile: (fileName) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    showToast('success', 'Archivo eliminado', `${fileName} ha sido eliminado`);
  },
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});


// Custom hook para manejar el estado del formulario
const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [modeloReferencia, setModeloReferencia] = useState('');
  const [referencia, setReferencia] = useState('');
  const [opcionesReferencia, setOpcionesReferencia] = useState([]);

  return {
    currentStep, setCurrentStep,
    selectedType, setSelectedType,
    formData, setFormData,
    uploadedFiles, setUploadedFiles,
    toasts, setToasts,
    acceptTerms, setAcceptTerms,
    modeloReferencia, setModeloReferencia,
    referencia, setReferencia,
    opcionesReferencia, setOpcionesReferencia
  };
};

// Custom hook para lógica de validación y manejo de formulario
const useFormHandlers = (state, managers, external) => {
  const { showToast } = managers.toastManager;
  const { categories, token } = external;
  
  const handleModeloReferenciaChange = (value) => {
    state.setModeloReferencia(value);
    state.setReferencia('');
    cargarOpcionesReferenciaGlobal(value, token, state.setOpcionesReferencia);
    state.setFormData(prev => ({ ...prev, category: '', modeloReferencia: value }));
  };

  const handleReferenciaChange = (value) => {
    state.setReferencia(value);
    const refObj = state.opcionesReferencia.find(op => (op._id || op.id) === value);
    let categoriaId = '';
    if (refObj && refObj.categoria) {
      categoriaId = typeof refObj.categoria === 'object' ? refObj.categoria._id : refObj.categoria;
      const categoria = categories.find(cat => cat._id === categoriaId);
      if (categoria) {
        showToast('info', 'Categoría seleccionada automáticamente', 
          `Se ha seleccionado la categoría "${categoria.nombre}" asociada a este evento.`);
      }
    }
    state.setFormData(prev => ({ ...prev, category: categoriaId, referencia: value }));
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'modeloReferencia') return handleModeloReferenciaChange(e.target.value);
    if (e.target.name === 'referencia') return handleReferenciaChange(e.target.value);
    const { name, value, type, checked } = e.target;
    state.setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const selectRequestType = (type) => state.setSelectedType(prev => (prev === type ? '' : type));

  const validateStepOne = () => {
    if (!state.selectedType) {
      showToast('warning', 'Selección requerida', 'Por favor selecciona un tipo de solicitud');
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    // Los campos del formulario usan los nombres: requestTitle y requestDescription
    const requiredFields = ['requestTitle', 'requestDescription'];
    const missingFields = requiredFields.filter(field => !state.formData[field]?.trim());
    if (missingFields.length > 0) {
      showToast('warning', 'Campos requeridos', 'Por favor complete todos los campos obligatorios');
      return false;
    }
    // Validar que la fecha requerida no sea anterior a hoy
    const today = new Date().toISOString().split('T')[0];
    const reqDate = state.formData.requestDate;
    if (reqDate && reqDate < today) {
      showToast('warning', 'Fecha inválida', 'La fecha requerida no puede ser anterior a hoy');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (state.currentStep === 1 && !validateStepOne()) return;
    if (state.currentStep === 2 && !validateStepTwo()) return;
    if (state.currentStep < 3) state.setCurrentStep(state.currentStep + 1);
  };

  const previousStep = () => {
    if (state.currentStep > 1) state.setCurrentStep(state.currentStep - 1);
  };

  const submitRequest = async () => {
    if (!validateSubmissionHelper(state.formData, state.acceptTerms, external.tesoreroId, showToast)) return;
    await submitSolicitud({
      formData: state.formData,
      selectedType: state.selectedType,
      acceptTerms: state.acceptTerms,
      tesoreroId: external.tesoreroId,
      modeloReferencia: state.modeloReferencia,
      referencia: state.referencia,
      categories,
      showToast,
      setFormData: state.setFormData,
      setSelectedType: state.setSelectedType,
      setAcceptTerms: state.setAcceptTerms
    });
  };

  return {
    handleModeloReferenciaChange,
    handleReferenciaChange,
    handleInputChange,
    selectRequestType,
    validateStepOne,
    validateStepTwo,
    nextStep,
    previousStep,
    submitRequest
  };
};

const NuevaSolicitud = () => {
  // Estado del formulario
  const formState = useFormState();
  const token = localStorage.getItem('token');

  // Custom hooks para datos externos
  const usuarioLogueado = useUsuario();
  const categories = useCategories();
  const tesoreroId = useTesorero();

  // Managers para funcionalidades
  const toastManager = createToastManager(formState.toasts, formState.setToasts, (id) => formState.setToasts(prev => prev.filter(t => t.id !== id)));
  const fileManager = createFileManager(formState.uploadedFiles, formState.setUploadedFiles, toastManager.showToast);

  // Handlers del formulario
  const handlers = useFormHandlers(
    formState, 
    { toastManager }, 
    { categories, token, tesoreroId }
  );

  const typeConfigs = {
    Inscripción: {
      title: 'Inscripción',
      description: 'Solicitudes para inscribirse en eventos, cursos, etc.',
      icon: <FaGraduationCap />
    },
    Hospedaje: {
      title: 'Hospedaje',
      description: 'Solicitudes relacionadas con alojamiento o cabañas.',
      icon: <FaDoorOpen />
    },
    Otra: {
      title: 'Otra',
      description: 'Cualquier otra solicitud que no encaje en las anteriores.',
      icon: <FaEllipsisH />
    }
  };

  const modeloCategoriaMap = {
    'Eventos': 'evento',
    'Cabana': 'cabana',
    'ProgramaAcademico': 'programa_academico',
    'Inscripcion': 'inscripcion',
    'Reserva': 'reserva',
    'Comedor': 'comedor'
  };

  // Fecha mínima (hoy) para inputs tipo date
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <Header />
      <main className="main-content-nuevasolicitud">
        <div className="container-nuevasolicitud">
          <div className="page-header-nuevasolicitud">
            <h1>Nueva Solicitud</h1>
            <p>Crea una nueva solicitud siguiendo los pasos a continuación</p>
          </div>

          <ProgressSteps currentStep={formState.currentStep} />

          <div className="form-container-nuevasolicitud">
            <RequestTypeSelector 
              typeConfigs={typeConfigs} 
              formState={formState} 
              handlers={handlers} 
            />

            <StepTwo 
              formState={formState}
              handlers={handlers}
              typeConfigs={typeConfigs}
              usuarioLogueado={usuarioLogueado}
              categories={categories}
              modeloCategoriaMap={modeloCategoriaMap}
              fileManager={fileManager}
              minDate={minDate}
            />

            <ConfirmationContent 
              formState={formState} 
              typeConfigs={typeConfigs}
              formatDate={formatDate}
              getPriorityLabel={getPriorityLabel}
            />

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {formState.currentStep > 1 && (
                <button
                  type="button"
                  className="btn-nuevasolicitud btn-secondary-nuevasolicitud"
                  onClick={handlers.previousStep}
                >
                  <FaArrowLeft />
                  <span>Anterior</span>
                </button>
              )}
              {formState.currentStep < 3 ? (
                <button
                  type="button"
                  className="btn-nuevasolicitud btn-primary-nuevasolicitud"
                  onClick={handlers.nextStep}
                  disabled={formState.currentStep === 1 && !formState.selectedType}
                  style={{
                    opacity: (formState.currentStep === 1 && !formState.selectedType) ? 0.5 : 1,
                    cursor: (formState.currentStep === 1 && !formState.selectedType) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>Siguiente</span>
                  <FaArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  className={`btn-nuevasolicitud btn-success-nuevasolicitud${formState.acceptTerms ? '' : ' disabled'}`}
                  onClick={formState.acceptTerms ? handlers.submitRequest : undefined}
                  disabled={!formState.acceptTerms}
                  style={{ opacity: formState.acceptTerms ? 1 : 0.5, cursor: formState.acceptTerms ? 'pointer' : 'not-allowed' }}
                >
                  <FaPaperPlane />
                  <span>Enviar Solicitud</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="toast-container">
        {formState.toasts.map(toast => {
          const iconMap = {
            success: <FaCheckCircle />,
            error: <FaExclamationCircle />,
            warning: <FaExclamationTriangle />,
            info: <FaInfoCircle />
          };

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <div className="toast-icon">
                {iconMap[toast.type]}
              </div>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                className="toast-close"
                onClick={() => toastManager.removeToast(toast.id)}
              >
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default NuevaSolicitud;
