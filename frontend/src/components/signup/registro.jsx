import React, { useState } from 'react';
import { FaBookOpen, FaUser, FaIdCard, FaHashtag, FaKey, FaEnvelope, FaLock, FaArrowLeft, FaArrowRight, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { signupService } from '../../services/authService';
import './registro.css'; // Crearemos este archivo después

// Constantes para mensajes de validación
const VALIDATION_MESSAGES = {
  CREDENTIAL_MIN_LENGTH: 'al menos 8 caracteres',
  CREDENTIAL_UPPERCASE: 'una mayúscula',
  CREDENTIAL_LOWERCASE: 'una minúscula',
  CREDENTIAL_NUMBER: 'un número',
  CREDENTIAL_MUST_CONTAIN: 'Credencial debe contener: ',
  CREDENTIALS_NO_MATCH: 'Las credenciales no coinciden',
};

// Constantes para regex
// EMAIL regex es seguro contra ReDoS: limita longitud de entrada para evitar backtracking catastrófico
const REGEX_PATTERNS = {
  PASSPORT: /^[A-Za-z0-9]{5,20}$/,
  DOCUMENT_NUMBER: /^\d{6,15}$/,
  PHONE: /^\d{7,15}$/,
  EMAIL: /^[^\s@]{1,64}@[^\s@]{1,255}$/,
};

// Definición de campos y sus reglas de validación
const FIELD_VALIDATION_RULES = {
  nombre: {
    step: 1,
    validator: (v) => v ? undefined : 'Nombre es requerido',
  },
  apellido: {
    step: 1,
    validator: (v) => v ? undefined : 'Apellido es requerido',
  },
  tipoDocumento: {
    step: 1,
    validator: (v) => v ? undefined : 'Seleccione un tipo de documento',
  },
  numeroDocumento: {
    step: 1,
    validator: (v, data) => {
      if (!v) return 'Número de documento es requerido';
      const tipo = (data.tipoDocumento || '').trim();
      if (tipo === 'Pasaporte') {
        return REGEX_PATTERNS.PASSPORT.test(v) ? undefined : 'Pasaporte inválido (5-20 caracteres alfanuméricos)';
      }
      return REGEX_PATTERNS.DOCUMENT_NUMBER.test(v) ? undefined : 'Número inválido (solo dígitos, 6-15)';
    },
  },
  telefono: {
    step: 1,
    validator: (v) => {
      if (!v) return 'Teléfono es requerido';
      return REGEX_PATTERNS.PHONE.test(v) ? undefined : 'Teléfono inválido (solo dígitos, 7-15)';
    },
  },
  fechaNacimiento: {
    step: 1,
    validator: (v) => v ? undefined : 'Fecha de nacimiento es requerida',
  },
  correo: {
    step: 2,
    validator: (v) => {
      if (!v) return 'Correo es requerido';
      return REGEX_PATTERNS.EMAIL.test(v) ? undefined : 'Correo inválido';
    },
  },
  password: {
    step: 2,
    validator: (v) => {
      const problems = [];
      if (v.length < 8) problems.push(VALIDATION_MESSAGES.CREDENTIAL_MIN_LENGTH);
      if (!/[A-Z]/.test(v)) problems.push(VALIDATION_MESSAGES.CREDENTIAL_UPPERCASE);
      if (!/[a-z]/.test(v)) problems.push(VALIDATION_MESSAGES.CREDENTIAL_LOWERCASE);
      if (!/\d/.test(v)) problems.push(VALIDATION_MESSAGES.CREDENTIAL_NUMBER);
      return problems.length ? VALIDATION_MESSAGES.CREDENTIAL_MUST_CONTAIN + problems.join(', ') : undefined;
    },
  },
  confirmPassword: {
    step: 2,
    validator: (v, data) => v === (data.password || '') ? undefined : VALIDATION_MESSAGES.CREDENTIALS_NO_MATCH,
  },
};

const Registro = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Valida un único campo usando las reglas centralizadas
  const validateField = (name, value, allValues = formData) => {
    const v = (value || '').toString().trim();
    const rule = FIELD_VALIDATION_RULES[name];
    if (!rule) return undefined;
    return rule.validator(v, allValues);
  };

  // Valida todos los campos de un paso específico
  const validateStep = (step) => {
    const newErrors = {};
    for (const name of Object.keys(FIELD_VALIDATION_RULES)) {
      if (FIELD_VALIDATION_RULES[name].step === step) {
        const v = (formData[name] || '').toString().trim();
        const error = validateField(name, v, formData);
        if (error) newErrors[name] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      const fieldError = validateField(name, value, next);
      
      const updatedErrors = { ...errors, [name]: fieldError };
      
      // Revalidar campos dependientes
      if (name === 'password' && next.confirmPassword) {
        updatedErrors.confirmPassword = validateField('confirmPassword', next.confirmPassword, next);
      }
      if (name === 'tipoDocumento' && next.numeroDocumento) {
        updatedErrors.numeroDocumento = validateField('numeroDocumento', next.numeroDocumento, next);
      }
      
      setErrors(updatedErrors);
      return next;
    });
  };


  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    try {
      await signupService.signup({
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        fechaNacimiento: formData.fechaNacimiento,
        password: formData.password,
      });
      setCurrentStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar usuario");
    }
  };
  const progressPercentage = (currentStep / 3) * 100;

  return (

    <div className="register-container">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
      <header className="register-header">
        <div className="logo-registro">
          <FaBookOpen className="logo-registro-icon" />
          <span className="luckas-registro">Luckas</span>
        </div>
        <p>Sistema de Gestión - Seminario Bautista de Colombia</p>
      </header>

      <div className="registro-contenedor">
        <div className="form-contanedor">
          <div className="form-header-registro">
            <h2>Solicitud de Registro</h2>
            <p>Complete la información para solicitar acceso al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="registro-form">
            {currentStep === 1 && (
              <div className='from-step active'>
                <div className="step-header">
                  <h3><FaUser className="step-icon-registro" /> Información Personal</h3>
                  <div className="step-indicator-registro">Paso 1 de 3</div>
                </div>

                <div className="form-row-registro">
                  <div className='form-group-registro'>
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="nombre" placeholder="Ingrese su nombre" required onChange={handleChange} value={formData.nombre} />
                    </div>
                    {errors.nombre && <div className="field-error">{errors.nombre}</div>}
                  </div>
                  <div className="form-group-registro">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="apellido" placeholder="Ingrese su apellido" required onChange={handleChange} value={formData.apellido} />
                    </div>
                    {errors.apellido && <div className="field-error">{errors.apellido}</div>}
                  </div>
                </div>
                <div className='form-row-registro'>
                  <div className="form-group-registro">
                    <label htmlFor="tipoDocumento">Tipo de Documento</label>
                    <div className="input-group-registro">
                      <FaIdCard className="input-icon" />
                      <select
                        name="tipoDocumento"
                        required
                        onChange={handleChange}
                        value={formData.tipoDocumento}
                      >
                        <option value="">Seleccione...</option>
                        <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                        <option value="Cédula de extranjería">Cédula de extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      </select>
                    </div>
                    {errors.tipoDocumento && <div className="field-error">{errors.tipoDocumento}</div>}
                  </div>

                  <div className="form-group-registro">
                    <label htmlFor="numeroDocumento">Numero De Documento </label>
                    <div className="input-group-registro">
                      <FaHashtag className="input-icon" />
                      <input type="text" name="numeroDocumento" placeholder="Ingrese su Documneto " required onChange={handleChange} value={formData.numeroDocumento} />
                    </div>
                    {errors.numeroDocumento && <div className="field-error">{errors.numeroDocumento}</div>}
                  </div>

                  <div className='form-group-registro'>
                    <label htmlFor="telefono">Teléfono</label>
                    <div className="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="telefono" placeholder="Ingrese su teléfono" required onChange={handleChange} value={formData.telefono} />
                    </div>
                    {errors.telefono && <div className="field-error">{errors.telefono}</div>}
                  </div>
                  <div className="form-group-registro">
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <div className="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="date" name="fechaNacimiento" required onChange={handleChange} value={formData.fechaNacimiento} />
                    </div>
                  </div>

                </div>
              </div>
            )}
            {/* Paso 2: Credenciales de Acceso */}
            {currentStep === 2 && (
              <div className="form-step active">
                <div className="step-header">
                  <h3><FaKey className="step-icon" /> Credenciales de Acceso</h3>
                  <div className="step-indicator-registro">Paso 2 de 3</div>
                </div>
                <div className="form-group-registro">
                  <label htmlFor="correo">Correo Electrónico</label>
                  <div className="input-group-registro">
                    <FaEnvelope className="input-icon" />
                    <input type="email" name="correo" placeholder="Ingrese su correo electrónico" required onChange={handleChange} value={formData.correo} />
                  </div>
                  {errors.correo && <div className="field-error">{errors.correo}</div>}
                </div>

                <div className="form-group-registro">
                  <label htmlFor="password">Credencial de Acceso</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showPassword ? "text": "password"} name="password" placeholder="Ingrese su credencial" required onChange={handleChange} value={formData.password} />
                    <button type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)} >
                      <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
                  {errors.password && <div className="field-error">{errors.password}</div>}
                  <small className="password-hint">
                    Mínimo 8 caracteres, incluya mayúsculas, minúsculas y números
                  </small>
                </div>
                <div className="form-group-registro">
                  <label htmlFor="confirmPassword">Confirmar Credencial</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Reingrese su credencial" required onChange={handleChange} value={formData.confirmPassword} />
                      <button type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                      <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                </div>
              </div>
            )}
            {/* Paso 3: Registro Exitoso */}
            {currentStep === 3 && (
              <div className="form-step active">
                <div className="success-message-container">
                  <div className="success-icon">
                    <FaCheckCircle />
                  </div>
                  <h3 className="success-title">¡Registro Exitoso!</h3>
                  <p className="success-text">
                    Tu solicitud ha sido enviada y será revisada por el equipo administrativo del Seminario.
                    Recibirás una confirmación por correo electrónico.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-registro"
                    onClick={() => globalThis.location.href = '/login'}
                  >
                    <FaSignInAlt />
                    Ir a Iniciar Sesión
                  </button>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            {currentStep < 3 && (
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-secondary-registro"
                    onClick={prevStep}
                  >
                    <FaArrowLeft />
                    Anterior
                  </button>
                )}
                {currentStep < 2 && (
                  <button
                    type="button"
                    className="btn-primary-registro"
                    onClick={nextStep}
                  >
                    Siguiente
                    <FaArrowRight />
                  </button>
                )}
                {currentStep === 2 && (
                  <button
                    type="submit"
                    className="btn-primary-registro"
                  >
                    Enviar Solicitud
                    <FaArrowRight />
                  </button>
                )}
              </div>
            )}

            {/* Barra de progreso */}
            {currentStep < 3 && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="progress-steps">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`progress-step ${currentStep >= step ? 'active' : ''}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
      <footer className="register-footer">
        <p>¿Ya tienes una cuenta? <a href="/login" className="link">Iniciar Sesión</a></p>
        <p className="footer-note">Tu solicitud será revisada por el equipo administrativo del Seminario</p>
      </footer>

    </div>
  );
};

export default Registro;