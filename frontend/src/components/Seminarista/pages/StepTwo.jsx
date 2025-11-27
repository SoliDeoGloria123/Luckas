import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft } from 'react-icons/fa';
import ReferenceFields from './ReferenceFields';
import MainFormFields from './MainFormFields';
import DynamicFields from './DynamicFields';
import FileUploadSection from './FileUploadSection';

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
  formState: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  typeConfigs: PropTypes.object.isRequired,
  usuarioLogueado: PropTypes.object,
  categories: PropTypes.array,
  modeloCategoriaMap: PropTypes.object.isRequired,
  fileManager: PropTypes.object.isRequired
};

export default StepTwo;