import React, { useState } from 'react';
import { FaBookOpen, FaUser, FaIdCard, FaHashtag, FaKey, FaEnvelope, FaLock, FaArrowLeft, FaArrowRight, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signupService } from '../../services/authService';
import './registro.css'; // Crearemos este archivo después

const Registro = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      // Llama al servicio de registro
      await signupService.signup({
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
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
  const validateStep = (step) => {
    if (step === 1) {
      return formData.nombre && formData.apellido && formData.tipoDocumento &&
        formData.numeroDocumento && formData.telefono;
    } else {
      alert("Por favor, complete todos los campos requeridos en el paso actual.");
    }
    return true;
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
                      <input type="text" name="nombre" placeholder="Ingrese su nombre" required onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group-registro">
                    <label htmlFor="apellido">Apellido</label>
                    <div class="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="apellido" placeholder="Ingrese su apellido" required onChange={handleChange} />
                    </div>
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
                        defaultValue=""
                      >
                        <option value="">Seleccione...</option>
                        <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                        <option value="Cédula de extranjería">Cédula de extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-registro">
                    <label htmlFor="numeroDocumento">Numero De Documento </label>
                    <div className="input-group-registro">
                      <FaHashtag className="input-icon" />
                      <input type="text" name="numeroDocumento" placeholder="Ingrese su Documneto " required onChange={handleChange} />
                    </div>
                  </div>

                  <div className='form-group-registro'>
                    <label htmlFor="telefono">Teléfono</label>
                    <div className="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="telefono" placeholder="Ingrese su teléfono" required onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group-registro">
                    <label htmlFor="apellido">Apellido</label>
                    <div class="input-group-registro">
                      <FaUser className="input-icon" />
                      <input type="text" name="apellido" placeholder="Ingrese su apellido" required onChange={handleChange} />
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
                    <input type="correo" name="correo" placeholder="Ingrese su correo electrónico" required onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group-registro">
                  <label htmlFor="password">Contraseña</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showPassword ? "text": "password"} name="password" placeholder="Ingrese su contraseña" required onChange={handleChange} />
                    <button type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)} >
                      <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
                  <small className="password-hint">
                    Mínimo 8 caracteres, incluya mayúsculas, minúsculas y números
                  </small>
                </div>
                <div className="form-group-registro">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <div className="input-group-registro">
                    <FaLock className="input-icon" />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Reingrese su contraseña" required onChange={handleChange} />
                      <button type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                      <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
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
                    onClick={() => window.location.href = '/login'}
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