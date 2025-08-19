
import { useState } from "react"
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import "./Login.css"

const Login = () => {
  const [correo, setcorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(correo, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));

      // Redireccionar según el rol del usuario
      if (data.user.role === 'admin') {
        navigate('/admin/users');
      } else if (data.user.role === 'tesorero') {
        navigate('/tesorero');
      } else if (data.user.role === 'seminarista') {
        navigate('/seminarista');
      } else if (data.user.role === 'externo') {
        // Para usuarios externos, redirigir al dashboard HTML estático
        window.location.href = '/Externo/templates/dashboard.html';
      } else {
        navigate('/admin/users'); // Por defecto para otros roles
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      mostrarAlerta('Error', 'Credenciales incorrectas, por favor verifica tus datos.', 'error');
    }
  };

  const handleRegisterClick = () => {
  navigate('/signup/registro');
};

  return (
    <div className="login-container">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
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
            <div className="form-header">
              <h3 className="welcome-title">Bienvenido de vuelta</h3>
              <p className="welcome-subtitle">Ingresa tus credenciales para acceder al sistema</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="login-form">
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
                    type="correo"
                    id="correo"
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
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                  />
                  <button type="button" 
                  className="btn btn-outline-secondary password-toggle"
                  onClick={()=> setShowPassword(!showPassword)} >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>

              {/* Opciones */}
              <div className="form-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    name="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Recordarme
                  </label>
                </div>
                <button type="button" className="forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de Login */}
              <button type="submit" className=" login-btn-login w-100" >
                <span>Iniciar Sesión</span>
              
              </button>

              {/* Divisor */}
              <div className="divider">
                <span>o continúa con</span>
              </div>

              {/* Botones Sociales */}
              <div className="social-buttons">
                <button
                  type="button"
                  className="btn btn-outline-secondary social-btn"
                >
                  <i className="fab fa-google me-2"></i>
                  Google
                </button>
    
              </div>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <p >
                ¿No tienes una cuenta? <button className="register-link" onClick={handleRegisterClick} >Registrate</button>
              </p>
            </div>
          </div>
        </div>
    
    </div>
  )
}

export default Login
