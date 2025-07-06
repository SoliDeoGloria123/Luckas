import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = (requiredRole) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Si no hay token, redirigir al login
    if (!token) {
      navigate('/login');
      return;
    }

    // Si hay un rol requerido y no coincide, redirigir según el rol actual
    if (requiredRole && usuario.role !== requiredRole) {
      switch (usuario.role) {
        case 'admin':
          navigate('/admin/users');
          break;
        case 'tesorero':
          navigate('/tesorero/dashboard');
          break;
        case 'seminarista':
          navigate('/seminarista/dashboard');
          break;
        case 'externo':
          navigate('/externo/dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  }, [navigate, requiredRole]);

  return {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('usuario') || '{}')
  };
};
