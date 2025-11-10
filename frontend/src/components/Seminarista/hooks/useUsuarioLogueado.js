import { useMemo } from 'react';

/**
 * Hook personalizado para obtener el usuario logueado desde localStorage
 * @returns {Object} { usuario, userId, isLoggedIn }
 */
export const useUsuarioLogueado = () => {
  const usuarioData = useMemo(() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      return {
        usuario,
        userId: usuario?._id || usuario?.id || null,
        isLoggedIn: Boolean(usuario)
      };
    } catch (error) {
      console.error('Error al obtener usuario logueado:', error);
      return {
        usuario: null,
        userId: null,
        isLoggedIn: false
      };
    }
  }, []);

  return usuarioData;
};