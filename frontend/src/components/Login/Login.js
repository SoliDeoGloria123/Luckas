import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import './Login.css';

const Login = () => {
  const [correo, setcorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        navigate('/tesorero/dashboard');
      } else if (data.user.role === 'seminarista') {
        navigate('/seminarista/dashboard');
      } else if (data.user.role === 'externo') {
        // Para usuarios externos, redirigir al dashboard HTML estático
        window.location.href = '/Externo/templates/dashboard.html';
      } else {
        navigate('/admin/users'); // Por defecto para otros roles
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };
  return (
    <div className="login-container">
      <div className="container">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="logo">
          <span className="luckas1">Luckas</span><span className="ent1">ent</span>
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="correo"
              id="correo"
              className="form-control"
              value={correo}
              onChange={(e) => setcorreo(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />

            <button type="submit" className="btn-primary_1">
              Ingresar
            </button>
            <button type="button" className="btn-google" onClick={() => window.location.href = '/auth/google'}>
              <FaGoogle />
              Iniciar sesión con Google
            </button>
          </form>
          <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
        <Link to="/signup/registro" className="register-link">
          ¿No tienes cuenta? <span>Regístrate</span>
        </Link>
      </div>
      <footer>&copy; 2024 LuckasEnt</footer>
    </div>
  );
};

export default Login;