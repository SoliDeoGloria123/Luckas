// frontend/src/services/externalService.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api"; // Usar URL completa temporalmente

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

// Helper para realizar GETs con patrón común y reducir duplicación
async function safeGet(path) {
  try {
    const response = await api.get(path);
    console.log(`API response for ${path}:`, response.data);
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data?.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

const externalService = {

  // Obtener programas académicos disponibles
  getProgramasAcademicos: async () => safeGet('/programas-academicos'),

  // Obtener cursos disponibles (legacy, alias a programas académicos)
  getCursos: async () => {
    console.log('Making request to /programas-academicos...');
    return safeGet('/programas-academicos');
  },

  // Obtener cabañas disponibles
  getCabanas: async () => {
    console.log('Making request to /cabanas...');
    return safeGet('/cabanas');
  },

  // Obtener eventos disponibles
  getEventos: async () => safeGet('/eventos'),

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

  // Obtener mis inscripciones
  getInscripciones: async (userId) => safeGet(`/users/${userId}/inscripciones`),

  // Obtener mis inscripciones (alias para compatibilidad)
  getMisInscripciones: async () => safeGet('/users/inscripciones'),

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
