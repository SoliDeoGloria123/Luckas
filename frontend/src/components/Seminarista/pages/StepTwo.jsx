import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft } from 'react-icons/fa';
import ReferenceFields from './ReferenceFields';
import MainFormFields from './MainFormFields';
import DynamicFields from './DynamicFields';
import FileUploadSection from './FileUploadSection';

// Componente para campos read-only
const ReadOnlyField = ({ label, id, name, value }) => (
  <div className="form-group-nuevasolicitud">
    <label htmlFor={id}>{label}</label>
    <input type="text" id={id} name={name} value={value} readOnly disabled />
  </div>
);

ReadOnlyField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

// Helper para obtener el email del usuario con fallbacks
const getUserEmail = (usuario) => usuario?.correo || usuario?.correoElectronico || usuario?.email || '';

// Componente para mostrar el tipo seleccionado
const SelectedTypeDisplay = ({ typeConfigs, selectedType }) => (
  <div className="selected-type-nuevasolicitud">
    <div className="selected-type-icon-nuevasolicitud">
      {typeConfigs[selectedType]?.icon}
    </div>
    <div className="selected-type-content-nuevasolicitud">
      <h3>{typeConfigs[selectedType]?.title}</h3>
      <p>{typeConfigs[selectedType]?.description}</p>
    </div>
  </div>
);

SelectedTypeDisplay.propTypes = {
  typeConfigs: PropTypes.object.isRequired,
  selectedType: PropTypes.string.isRequired,
};

const StepTwo = ({ 
  formState, 
  handlers, 
  typeConfigs, 
  usuarioLogueado, 
  categories, 
  modeloCategoriaMap, 
  fileManager 
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

      <SelectedTypeDisplay typeConfigs={typeConfigs} selectedType={formState.selectedType} />

      <div className="request-form-nuevasolicitud">
        <div className="form-row-nuevasolicitud">
          <ReadOnlyField 
            label="Correo" 
            id="correo" 
            name="correo" 
            value={getUserEmail(usuarioLogueado)} 
          />
          <ReadOnlyField 
            label="Teléfono" 
            id="telefono" 
            name="telefono" 
            value={usuarioLogueado?.telefono || ''} 
          />
        </div>
        
        <ReferenceFields formState={formState} handlers={handlers} />
        <MainFormFields handlers={handlers} />

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
  formState: PropTypes.shape({
    currentStep: PropTypes.number.isRequired,
    selectedType: PropTypes.string.isRequired,
    setCurrentStep: PropTypes.func.isRequired,
    modeloReferencia: PropTypes.any,
    referencia: PropTypes.any,
    formData: PropTypes.object,
  }).isRequired,
  handlers: PropTypes.shape({
    handleInputChange: PropTypes.func.isRequired,
  }).isRequired,
  typeConfigs: PropTypes.object.isRequired,
  usuarioLogueado: PropTypes.object,
  categories: PropTypes.array,
  modeloCategoriaMap: PropTypes.object.isRequired,
  fileManager: PropTypes.object.isRequired,
};

export default StepTwo;