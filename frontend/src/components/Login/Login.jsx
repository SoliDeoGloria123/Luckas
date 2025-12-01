import { useState } from "react";
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./Login.css";

const Login = () => {
  const [correo, setcorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    // CRÍTICO: Prevenir CUALQUIER comportamiento por defecto
    e.preventDefault();
    e.stopPropagation();

    // Limpiar espacios en blanco y normalizar correo
    const correoLimpio = correo.trim().toLowerCase();
    const passwordLimpio = password.trim();

    try {
      const data = await authService.login(correoLimpio, passwordLimpio);

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));

      // Redireccionar según el rol del usuario
      if (data.user.role === 'admin') {
        navigate('/admin/Dashboard');
      } else if (data.user.role === 'tesorero') {
        navigate('/tesorero');
      } else if (data.user.role === 'seminarista') {
        navigate('/seminarista');
      } else if (data.user.role === 'externo') {
        navigate('/external');
      } else {
        navigate('/admin/users');
      }
    } catch (err) {
      console.error('❌ Error durante el login:', err);

      let errorMessage = 'Error al iniciar sesión';
      if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showConfirmButton: true,
        timer: undefined, // Sin timer automático
      }).then((result) => {
        console.log('🔴 Usuario cerró la alerta:', result);
        // NO hacer nada aquí, solo cerrar la alerta
      });
    }

    // NO retornar nada
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/signup/registro');
  };

  const handleOlvidarrClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/Olvidar-Contraseña');
  };

  const handlePasswordToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Lado Izquierdo - Información del Sistema */}
      <div className="col-lg-6 login-left-side">
        <div className="login-info-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <span className="luckas-login">Luckas</span>
          </div>

          {/* Título y descripción */}
          <h2 className="system-title">Sistema de Gestión Integral</h2>
          <p className="system-description">
            Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia
          </p>

          {/* Características principales */}
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <span className="feature-text">Gestión de Usuarios</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <span className="feature-text">Control de Eventos</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <span className="feature-text">Gestión de Pagos</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <span className="feature-text">Reportes Analíticos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario de Login */}
      <div className="col-lg-6 login-right-side">
        <div className="login-form-container">
          {/* Header del formulario */}
          <div className="form-header-login">
            <h3 className="welcome-title-login">Bienvenido de vuelta</h3>
            <p className="welcome-subtitle-login">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            {/* Campo Email */}
            <div className="form-group-login">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="form-control"
                  value={correo}
                  onChange={(e) => setcorreo(e.target.value)}
                  placeholder="Ingrese su correo electrónico"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="form-group-login">
              <label htmlFor="password" className="form-label-login">
                Contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary password-toggle"
                  onClick={handlePasswordToggle}
                  tabIndex="-1"
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            {/* Opciones */}
            <div className="form-options">
              <button
                type="button"
                className="forgot-password-link"
                onClick={handleOlvidarrClick}
                tabIndex="-1"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de Login */}
            <button type="submit" className="login-btn-login w-100">
              <span>Iniciar Sesión</span>
            </button>
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                className="register-link"
                onClick={handleRegisterClick}
              >
                Registrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;