import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Error403 from '../Páginas de error/Error403';

/**
 * Componente ProtectedRoute para proteger rutas por rol
 * @param {React.Component} Component - El componente a renderizar
 * @param {Array<string>} allowedRoles - Array de roles permitidos (ej: ['admin', 'tesorero'])
 */
const ProtectedRoute = ({ Component, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const token = localStorage.getItem('token');
        
        // Si no hay token, redirigir a login
        if (!token) {
          setAuthorized(false);
          setDenied(false);
          setLoading(false);
          return;
        }

        // Decodificar token para obtener el rol
        const decoded = jwtDecode(token);
        const role = decoded.userRole || decoded.role;

        // Verificar si el rol está en los permitidos
        if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
          setAuthorized(true);
          setDenied(false);
        } else {
          // Usuario tiene token pero NO tiene permiso para esta ruta
          setAuthorized(false);
          setDenied(true);
        }
      } catch (error) {
        console.error('Error verificando autorización:', error);
        setAuthorized(false);
        setDenied(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si acceso fue denegado (tiene token pero no permisos), mostrar Error 403
  if (denied) {
    return <Error403 />;
  }

  // Si no está autorizado y no fue denegado, redirigir a login
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  // Si está autorizado, renderizar el componente
  return <Component />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
