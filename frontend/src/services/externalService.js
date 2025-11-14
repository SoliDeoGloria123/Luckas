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

const externalService = {

  // Obtener programas académicos disponibles
  getProgramasAcademicos: async () => {
    try {
      const response = await api.get('/programas-academicos');
      // El backend responde con { data: [...] }
      if (response.data?.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener programas académicos:', error);
      return [];
    }
  },

  // Obtener cabañas disponibles
  // (definido más abajo, eliminar duplicado)

  // Obtener cursos disponibles (legacy, para compatibilidad)
  // Obtener programas académicos (cursos y técnicos)
  getCursos: async () => {
    try {
      console.log('Making request to /programas-academicos...');
      const response = await api.get('/programas-academicos');
      console.log('Programas Académicos API response:', response.data);
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener programas académicos:', error);
      return [];
    }
  },
  getCabanas: async () => {
    try {
      console.log('Making request to /cabanas...');
      const response = await api.get('/cabanas');
      console.log('Cabañas API response:', response.data);
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener cabañas:', error);
      return [];
    }
  },

  // Obtener eventos disponibles (usando axios para enviar el token)
  getEventos: async () => {
    try {
      const response = await api.get('/eventos');
      console.log('Eventos API response:', response.data);
      return response.data.data || response.data || [];
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

  // Obtener mis inscripciones
  getInscripciones: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/inscripciones`);
      console.log('Inscripciones API response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener inscripciones:', error);
      // En caso de error, retornar array vacío para no romper la UI
      return [];
    }
  },

  // Obtener mis inscripciones (alias para compatibilidad)
  getMisInscripciones: async (userId) => {
    try {
      const response = await api.get('/users/inscripciones');
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
