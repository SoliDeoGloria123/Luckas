// Controladores de eventos extraídos para reducir la complejidad de NuevaSolicitud
import { validateFormHelper } from './NuevaSolicitud';

export const createInputChangeHandler = (handleModeloReferenciaChange, handleReferenciaChange, setFormData, formData) => (e) => {
  if (e.target.name === 'modeloReferencia') {
    handleModeloReferenciaChange(e.target.value);
    return;
  }
  if (e.target.name === 'referencia') {
    handleReferenciaChange(e.target.value);
    return;
  }
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value
  });
};

export const createStepValidators = (selectedType, showToast, formData, currentStep) => ({
  validateStepOne: () => {
    if (!selectedType) {
      showToast('warning', 'Selección requerida', 'Por favor selecciona un tipo de solicitud');
      return false;
    }
    return true;
  },
  validateStepTwo: () => {
    if (!validateFormHelper(formData, currentStep)) {
      showToast('error', 'Formulario incompleto', 'Por favor completa todos los campos obligatorios');
      return false;
    }
    return true;
  }
});

export const createStepHandlers = (currentStep, setCurrentStep, validators) => ({
  nextStep: () => {
    if (currentStep === 1 && !validators.validateStepOne()) return;
    if (currentStep === 2 && !validators.validateStepTwo()) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  },
  previousStep: () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }
});