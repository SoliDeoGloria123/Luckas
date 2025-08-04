import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Dashboard específico para el rol de Admin
 * Utiliza el Dashboard base con todas las funcionalidades
 */
const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioStorage || !token) {
      navigate('/login');
      return;
    }

    const usuarioData = JSON.parse(usuarioStorage);
    
    // Verificar que el usuario tenga el rol correcto
    if (usuarioData.role !== 'admin') {
      // Si no es admin, redirigir al dashboard apropiado
      if (usuarioData.role === 'tesorero') {
        navigate('/tesorero/dashboard');
      } else {
        navigate('/login');
      }
      return;
    }

    setUsuario(usuarioData);
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <Dashboard 
      usuario={usuario}
      onCerrarSesion={handleCerrarSesion}
      modoTesorero={false}
    />
  );
};

export default DashboardAdmin;
