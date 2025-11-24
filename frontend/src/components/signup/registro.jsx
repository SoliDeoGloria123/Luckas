import React, { useState } from 'react';
import { FaBookOpen, FaUser, FaIdCard, FaHashtag, FaKey, FaEnvelope, FaLock, FaArrowLeft, FaArrowRight, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { signupService } from '../../services/authService';
import './registro.css'; // Crearemos este archivo después

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Construimos el nuevo estado inmediatamente para validar dependencias (ej: confirmar contraseña)
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Validación en tiempo real por campo
      const fieldError = validateField(name, value, next);
      setErrors(prevErr => ({ ...prevErr, [name]: fieldError }));
      // Si estamos actualizando la contraseña, también validar confirmPassword en tiempo real
      if (name === 'password' && next.confirmPassword) {
        const confirmErr = validateField('confirmPassword', next.confirmPassword, next);
        setErrors(prevErr => ({ ...prevErr, confirmPassword: confirmErr, [name]: fieldError }));
      }
      // Si estamos actualizando tipoDocumento, revalidar numeroDocumento
      if (name === 'tipoDocumento' && next.numeroDocumento) {
        const numErr = validateField('numeroDocumento', next.numeroDocumento, next);
        setErrors(prevErr => ({ ...prevErr, numeroDocumento: numErr }));
      }
      return next;
    });
  };

  // Helpers más pequeños para reducir la complejidad de validación
  const validateDocumentNumber = (v, tipo) => {
    if (!v) return 'Número de documento es requerido';
    if ((tipo || '').trim() === 'Pasaporte') {
      return /^[A-Za-z0-9]{5,20}$/.test(v)
        ? undefined
        : 'Pasaporte inválido (5-20 caracteres alfanuméricos)';
    }
    return /^\d{6,15}$/.test(v) ? undefined : 'Número inválido (solo dígitos, 6-15)';
  };

  const validatePassword = (v) => {
    const problems = [];
    if (v.length < 8) problems.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(v)) problems.push('una mayúscula');
    if (!/[a-z]/.test(v)) problems.push('una minúscula');
    if (!/\d/.test(v)) problems.push('un número');
    return problems.length ? 'Contraseña debe contener: ' + problems.join(', ') : undefined;
  };

  const validatePersonalField = (name, v, data) => {
    switch (name) {
      case 'nombre':
        return v ? undefined : 'Nombre es requerido';
      case 'apellido':
        return v ? undefined : 'Apellido es requerido';
      case 'tipoDocumento':
        return v ? undefined : 'Seleccione un tipo de documento';
      case 'numeroDocumento':
        return validateDocumentNumber(v, data.tipoDocumento);
      case 'telefono':
        if (!v) return 'Teléfono es requerido';
        return /^\d{7,15}$/.test(v) ? undefined : 'Teléfono inválido (solo dígitos, 7-15)';
      case 'fechaNacimiento':
        return v ? undefined : 'Fecha de nacimiento es requerida';
      default:
        return undefined;
    }
  };

  const validateCredentialField = (name, v, data) => {
    switch (name) {
      case 'correo':
        if (!v) return 'Correo es requerido';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : 'Correo inválido';
      case 'password':
        return validatePassword(v);
      case 'confirmPassword':
        return v === (data.password || '') ? undefined : 'Las contraseñas no coinciden';
      default:
        return undefined;
    }
  };

  // Valida un único campo en base a su nombre y devuelve mensaje de error o undefined
  const validateField = (name, value, allValues) => {
    const v = (value || '').toString().trim();
    const data = allValues || formData;
    // Campos personales
    const personalFields = ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'telefono', 'fechaNacimiento'];
    const credentialFields = ['correo', 'password', 'confirmPassword'];
    if (personalFields.includes(name)) return validatePersonalField(name, v, data);
    if (credentialFields.includes(name)) return validateCredentialField(name, v, data);
    return undefined;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validar el paso 2 antes de enviar
    if (!validateStep(2)) return;
    try {
      // Llama al servicio de registro
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
      setCurrentStep(3); // Avanza al paso de éxito
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Error al registrar usuario");
      }
    }
  };
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const validatePersonal = () => {
    const newErrors = {};
    if (!formData.nombre || !formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido || !formData.apellido.trim()) newErrors.apellido = 'Apellido es requerido';
    if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Seleccione un tipo de documento';

    const num = (formData.numeroDocumento || '').trim();
    if (!num) {
      newErrors.numeroDocumento = 'Número de documento es requerido';
    } else if (formData.tipoDocumento === 'Pasaporte') {
      if (!/^[A-Za-z0-9]{5,20}$/.test(num)) newErrors.numeroDocumento = 'Pasaporte inválido (5-20 caracteres alfanuméricos)';
    } else if (!/^\d{6,15}$/.test(num)) {
      newErrors.numeroDocumento = 'Número inválido (solo dígitos, 6-15)';
    }

    const tel = (formData.telefono || '').trim();
    if (!tel) {
      newErrors.telefono = 'Teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(tel)) {
      newErrors.telefono = 'Teléfono inválido (solo dígitos, 7-15)';
    }

    return newErrors;
  };

  const validateCredentials = () => {
    const newErrors = {};
    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) newErrors.correo = 'Correo inválido';
    const pwd = formData.password || '';
    const pwdProblems = [];
    if (pwd.length < 8) pwdProblems.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(pwd)) pwdProblems.push('una mayúscula');
    if (!/[a-z]/.test(pwd)) pwdProblems.push('una minúscula');
    if (!/\d/.test(pwd)) pwdProblems.push('un número');
    if (pwdProblems.length) newErrors.password = 'Contraseña debe contener: ' + pwdProblems.join(', ');
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    return newErrors;
  };

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 1) newErrors = validatePersonal();
    if (step === 2) newErrors = validateCredentials();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
                  <label htmlFor="password">Contraseña</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showPassword ? "text": "password"} name="password" placeholder="Ingrese su contraseña" required onChange={handleChange} value={formData.password} />
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
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Reingrese su contraseña" required onChange={handleChange} value={formData.confirmPassword} />
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