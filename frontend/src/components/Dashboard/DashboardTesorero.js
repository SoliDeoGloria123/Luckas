import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Dashboard específico para el rol de Tesorero
 * Utiliza el mismo Dashboard base pero sin funciones de eliminación
 */
const DashboardTesorero = () => {
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
    if (usuarioData.role !== 'tesorero') {
      // Si no es tesorero, redirigir al dashboard apropiado
      if (usuarioData.role === 'admin') {
        navigate('/admin/users');
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
      modoTesorero={true}
    />
  );
};

export default DashboardTesorero;
