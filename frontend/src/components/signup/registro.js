import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { signupService } from '../../services/authService';
import './registro.css'; // Crearemos este archivo después

const Registro = () => {
  const navigate = useNavigate();
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
      alert("Registro exitoso, ahora inicia sesión");
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Error al registrar usuario");
      }
    }
  };

  return (
    <div className="container">
      <div className="registro-wrapper">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="logo">
          <span className="luckas2">Luckas</span><span className="ent2">ent</span>
        </div>
        <div className="registro-contenedor">
          <div className="registro-caja">
            <h2 className="registro-titulo">Registrarse</h2>
            <p className="registro-texto">Accede a tu cuenta para comparar precios</p>
            <form onSubmit={handleSubmit} className="formulario">
              <div className="grupo-input-doble">
                <div className="campo-input">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" name="nombre" placeholder="Ingrese su nombre" required onChange={handleChange} />
                </div>
                <div className="campo-input">
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" name="apellido" placeholder="Ingrese su apellido" required onChange={handleChange} />
                </div>
              </div>

              <div className="grupo-input-doble">
                <div className="campo-input">
                  <label htmlFor="correo">Correo Electrónico</label>
                  <input type="correo" name="correo" placeholder="Ingrese su correo electrónico" required onChange={handleChange} />
                </div>
                <div className="campo-input">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="text" name="telefono" placeholder="Ingrese su teléfono" required onChange={handleChange} />
                </div>
              </div>
              <div className="grupo-input-doble">
                <label htmlFor="tipoDocumento">Tipo de Documento</label>
                <select
                  name="tipoDocumento"
                  required
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>Seleccione un tipo</option>
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                </select>
                <div className="campo-input">
                  <label htmlFor="numeroDocumento">Numero De Documento </label>
                  <input type="text" name="numeroDocumento" placeholder="Ingrese su Documneto " required onChange={handleChange} />
                </div>
              </div>

              <div className="campo-input2">
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" placeholder="Ingrese su contraseña" required onChange={handleChange} />
              </div>

              <div className="campo-input2">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input type="password" name="confirmPassword" placeholder="Reingrese su contraseña" required onChange={handleChange} />
              </div>

              <div className="registro-botones">
                <button type="submit" className="btn-principal">Registrarse</button>
                <button type="button" className="btn-google" onClick={() => window.location.href = '/auth/google'}>
                  <FaGoogle />
                  Iniciar sesión con Google
                </button>
                <a href="/forgot-password" className="enlace">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>
        <footer className="registro-footer">&copy; 2024 LuckasEnt</footer>
      </div>
    </div>
  );
};

export default Registro;