// frontend/src/services/externalService.js
import axios from 'axios';


// Configurar axios con el token y ruta relativa para proxy
const api = axios.create({
  baseURL: '/api'
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const externalService = {

  // Obtener cursos disponibles (usar ruta pública)
  getCursos: async () => {
    try {
      const response = await fetch('/api/cursos/publicos');
      const data = await response.json();
      // Si la respuesta es un array directo, úsala
      if (Array.isArray(data)) {
        return data;
      }
      // Si la respuesta es objeto con data
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      // Si la respuesta es objeto con cursos
      if (data && Array.isArray(data.cursos)) {
        return data.cursos;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return [];
    }
  },


  // Obtener eventos disponibles
  getEventos: async () => {
    try {
      const response = await fetch('/api/eventos/publicos');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return [];
    }
  },

  // Inscribirse a un curso
  inscribirCurso: async (cursoId, userId) => {
    try {
      const response = await api.post(`/cursos/${cursoId}/inscribir`, {
        usuarioId: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error al inscribirse al curso:', error);
      throw error;
    }
  },

  // Inscribirse a un evento
  inscribirEvento: async (eventoId, userId) => {
    try {
      const response = await api.post(`/eventos/${eventoId}/inscribir`, {
        usuarioId: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error al inscribirse al evento:', error);
      throw error;
    }
  },

  // Solicitar ser seminarista
  solicitarSeminarista: async (userData) => {
    try {
      const response = await api.post('/users/solicitar-seminarista', userData);
      return response.data;
    } catch (error) {
      console.error('Error al solicitar ser seminarista:', error);
      throw error;
    }
  },

  // Procesar pago
  procesarPago: async (paymentData) => {
    try {
      const response = await api.post('/pagos/procesar', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      throw error;
    }
  },

  // Obtener mis inscripciones (para el usuario autenticado, rol externo/seminarista)
  getInscripciones: async () => {
    try {
      const response = await api.get('/inscripciones');
      if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si el endpoint no existe, retorna vacío
        return [];
      }
      console.error('Error al obtener inscripciones:', error);
      return [];
    }
  },

  // Alias para compatibilidad
  getMisInscripciones: async () => {
    try {
      const response = await api.get('/inscripciones');
      if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data;
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { success: true, data: [] };
      }
      console.error('Error al obtener inscripciones:', error);
      return { success: true, data: [] };
    }
  },

  // Actualizar perfil de usuario
  updateProfile: async (formData) => {
    try {
      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }
};

export default externalService;
