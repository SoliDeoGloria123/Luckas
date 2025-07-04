import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cursos';

// Configurar interceptor para incluir el token en las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cursosService = {
  // Obtener todos los cursos
  obtenerCursos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await axios.get(`${API_URL}${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener cursos públicos (sin autenticación)
  obtenerCursosPublicos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await axios.get(`${API_URL}/publicos${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos públicos:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener un curso por ID
  obtenerCursoPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener curso:', error);
      throw error.response?.data || error;
    }
  },

  // Crear un nuevo curso
  crearCurso: async (cursoDatos) => {
    try {
      const response = await axios.post(API_URL, cursoDatos);
      return response.data;
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error.response?.data || error;
    }
  },

  // Actualizar un curso
  actualizarCurso: async (id, cursoDatos) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, cursoDatos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      throw error.response?.data || error;
    }
  },

  // Eliminar un curso
  eliminarCurso: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error.response?.data || error;
    }
  },

  // Inscribir usuario en un curso
  inscribirUsuario: async (cursoId, usuarioId) => {
    try {
      const response = await axios.post(`${API_URL}/${cursoId}/inscribir`, { usuarioId });
      return response.data;
    } catch (error) {
      console.error('Error al inscribir usuario:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas de cursos
  obtenerEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error.response?.data || error;
    }
  }
};
