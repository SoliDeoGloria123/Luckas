// frontend/src/services/externalService.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api";

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
  // Obtener cursos disponibles
  getCursos: async () => {
    try {
      const response = await api.get('/cursos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  },

  // Obtener eventos disponibles
  getEventos: async () => {
    try {
      const response = await api.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
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
  getMisInscripciones: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/inscripciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener inscripciones:', error);
      throw error;
    }
  }
};

export default externalService;
