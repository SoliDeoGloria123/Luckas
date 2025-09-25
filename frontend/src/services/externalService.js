// frontend/src/services/externalService.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api"; // Usar URL correcta del backend

// Configurar axios con el token
const api = axios.create({
  baseURL: API_BASE_URL
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
      console.log('Making request to /cursos/publicos...');
      // Usar fetch sin headers de autorización para endpoint público
  const response = await fetch('http://localhost:3000/api/cursos/publicos');
      const data = await response.json();
      if (data && data.success && data.data) {
        console.log('Returning courses:', data.data);
        return data.data;
      } else {
        console.log('No data found in response, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return [];
    }
  },

  // Obtener eventos disponibles
  getEventos: async () => {
    try {
      // Usar fetch sin headers de autorización para endpoint público
  const response = await fetch('http://localhost:3000/api/eventos/publicos');
      const data = await response.json();
      console.log('Eventos API response:', data);
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
      console.log('Inscripciones API response:', response.data);
      // El backend retorna { success: true, data: [...] }
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener inscripciones:', error);
      return [];
    }
  },

  // Alias para compatibilidad
  getMisInscripciones: async () => {
    try {
      const response = await api.get('/inscripciones');
      return response.data;
    } catch (error) {
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
