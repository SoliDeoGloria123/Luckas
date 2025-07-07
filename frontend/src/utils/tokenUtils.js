// Utilidad para manejar tokens expirados
export const tokenUtils = {
  // Verificar si el token ha expirado
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },

  // Limpiar datos de sesión
  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // Verificar y redirigir si el token expiró
  checkTokenAndRedirect: () => {
    const token = localStorage.getItem('token');
    
    if (!token || tokenUtils.isTokenExpired(token)) {
      tokenUtils.clearSession();
      window.location.href = '/login';
      return false;
    }
    
    return true;
  }
};

// Interceptor para todas las peticiones fetch
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  // Si recibimos 401, el token probablemente expiró
  if (response.status === 401) {
    console.warn('Token expirado, redirigiendo al login...');
    tokenUtils.clearSession();
    window.location.href = '/login';
  }
  
  return response;
};
