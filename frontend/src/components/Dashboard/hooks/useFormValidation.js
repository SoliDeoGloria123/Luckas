import { useState } from 'react';

/**
 * Hook personalizado para validación de formularios
 * @param {Object} validationRules - Reglas de validación { campo: { required: true, type: 'string', minLength: 3 } }
 * @returns {Object} { validateForm, errors, clearErrors }
 */
// Funciones auxiliares para validación
const validateRequired = (value, label) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label} es obligatorio`;
  }
  return null;
};

const validateNumber = (value, label) => {
  if (Number.isNaN(Number(value)) || value === '') {
    return `${label} debe ser un número válido`;
  }
  return null;
};

const validateEmail = (value, label) => {
  // Regex más segura que previene ReDoS (Regular Expression Denial of Service)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(value)) {
    return `${label} debe ser un email válido`;
  }
  return null;
};

const validateString = (value, label) => {
  if (typeof value !== 'string') {
    return `${label} debe ser texto`;
  }
  return null;
};

const validateLength = (value, rules, label) => {
  if (rules.minLength && value.length < rules.minLength) {
    return `${label} debe tener al menos ${rules.minLength} caracteres`;
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${label} no puede tener más de ${rules.maxLength} caracteres`;
  }
  return null;
};

const validateRange = (value, rules, label) => {
  const numValue = Number(value);
  if (rules.min && numValue < rules.min) {
    return `${label} debe ser mayor o igual a ${rules.min}`;
  }
  if (rules.max && numValue > rules.max) {
    return `${label} debe ser menor o igual a ${rules.max}`;
  }
  return null;
};

export const useFormValidation = (validationRules = {}) => {
  const [errors, setErrors] = useState({});

  const getTypeValidator = (type) => {
    const validators = {
      number: validateNumber,
      email: validateEmail,
      string: validateString
    };
    return validators[type] || null;
  };

  const runValidation = (validator, value, rules, label) => {
    return validator ? validator(value, label || rules, label) : null;
  };

  const validateField = (name, value, rules) => {
    const label = rules.label || name;
    
    // Required validation
    if (rules.required) {
      const error = validateRequired(value, label);
      if (error) return error;
    }

    // Skip other validations if value is empty and not required
    if (!value) return null;

    // Type validation
    if (rules.type) {
      const validator = getTypeValidator(rules.type);
      const error = runValidation(validator, value, rules, label);
      if (error) return error;
    }

    // Length validation for strings
    if (typeof value === 'string') {
      const error = validateLength(value, rules, label);
      if (error) return error;
    }

    // Range validation for numbers
    if (rules.type === 'number') {
      const error = validateRange(value, rules, label);
      if (error) return error;
    }

    return null;
  };

  const validateForm = (formData) => {
    const newErrors = {};

    for (const fieldName of Object.keys(validationRules)) {
      const fieldValue = formData[fieldName];
      const fieldRules = validationRules[fieldName];
      const fieldError = validateField(fieldName, fieldValue, fieldRules);

      if (fieldError) {
        newErrors[fieldName] = fieldError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (fieldName, error) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  return {
    validateForm,
    errors,
    clearErrors,
    setFieldError
  };
};