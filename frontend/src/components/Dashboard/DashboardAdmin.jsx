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
    return (
      <div className="   bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-slate-700">Cargando dashboard administrador...</span>
          </div>
        </div>
      </div>
    );
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
