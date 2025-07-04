import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Configurar interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configurar interceptor para manejar respuestas de error
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const programasAcademicosService = {
  // Obtener todos los programas académicos
  getAllProgramas: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.modalidad) params.append('modalidad', filtros.modalidad);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      
      const response = await axios.get(`${API_URL}/api/programas-academicos?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programas académicos:', error);
      throw error;
    }
  },

  // Obtener un programa académico por ID
  getProgramaById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/programas-academicos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programa académico:', error);
      throw error;
    }
  },

  // Crear un nuevo programa académico
  createPrograma: async (programaData) => {
    try {
      const response = await axios.post(`${API_URL}/api/programas-academicos`, programaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear programa académico:', error);
      throw error;
    }
  },

  // Actualizar un programa académico
  updatePrograma: async (id, programaData) => {
    try {
      const response = await axios.put(`${API_URL}/api/programas-academicos/${id}`, programaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar programa académico:', error);
      throw error;
    }
  },

  // Eliminar un programa académico
  deletePrograma: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/programas-academicos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar programa académico:', error);
      throw error;
    }
  },

  // Obtener inscripciones de un programa
  getInscripcionesByPrograma: async (programaId) => {
    try {
      const response = await axios.get(`${API_URL}/api/programas-academicos/${programaId}/inscripciones`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener inscripciones del programa:', error);
      throw error;
    }
  },

  // Inscribir usuario a un programa
  inscribirUsuario: async (programaId, inscripcionData) => {
    try {
      const response = await axios.post(`${API_URL}/api/programas-academicos/${programaId}/inscripciones`, inscripcionData);
      return response.data;
    } catch (error) {
      console.error('Error al inscribir usuario al programa:', error);
      throw error;
    }
  },

  // Obtener estadísticas de programas académicos
  getEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/programas-academicos/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de programas académicos:', error);
      throw error;
    }
  }
};
