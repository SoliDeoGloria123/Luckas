import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error de inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/flask/login/google';
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="logo">
          <span className="luckas">Luckas</span><span className="ent">ent</span>
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta del seminario</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Ingrese su correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Ingrese su contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            
            <button 
              type="button" 
              className="btn-google" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img src="/static/img/Google.png" alt="Google logo" className="google-logo" /> 
              Iniciar sesión con Google
            </button>
          </form>
          
          <Link to="/forgot-password" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <Link to="/register" className="register-link">
          No tienes cuenta? <span>Regístrate</span>
        </Link>
      </div>
      
      <footer>&copy; 2025 Luckas - Seminario Bautista de Colombia</footer>
    </div>
  );
};

export default Login;