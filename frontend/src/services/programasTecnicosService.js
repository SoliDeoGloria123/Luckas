import axios from 'axios';

const API_URL = 'http://localhost:3000/api/programas-tecnicos';

// Configurar interceptor para incluir el token en las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const programasTecnicosService = {
  // Obtener todos los programas técnicos
  obtenerProgramasTecnicos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const url = `${API_URL}${params ? `?${params}` : ''}`;
      console.log('🌐 URL de petición:', url);
      console.log('🔑 Token en localStorage:', localStorage.getItem('token') ? 'Existe' : 'No existe');
      
      const response = await axios.get(url);
      console.log('✅ Respuesta exitosa del servicio:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en el servicio:', error);
      console.error('📄 Respuesta del error:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  // Obtener programas técnicos públicos (sin autenticación)
  obtenerProgramasTecnicosPublicos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await axios.get(`${API_URL}/publicos${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programas técnicos públicos:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener un programa técnico por ID
  obtenerProgramaTecnicoPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener programa técnico:', error);
      throw error.response?.data || error;
    }
  },

  // Crear un nuevo programa técnico
  crearProgramaTecnico: async (programaDatos) => {
    try {
      const response = await axios.post(API_URL, programaDatos);
      return response.data;
    } catch (error) {
      console.error('Error al crear programa técnico:', error);
      throw error.response?.data || error;
    }
  },

  // Actualizar un programa técnico
  actualizarProgramaTecnico: async (id, programaDatos) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, programaDatos);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar programa técnico:', error);
      throw error.response?.data || error;
    }
  },

  // Eliminar un programa técnico
  eliminarProgramaTecnico: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar programa técnico:', error);
      throw error.response?.data || error;
    }
  },

  // Inscribir usuario en un programa técnico
  inscribirUsuario: async (programaId, usuarioId) => {
    try {
      const response = await axios.post(`${API_URL}/${programaId}/inscribir`, { usuarioId });
      return response.data;
    } catch (error) {
      console.error('Error al inscribir usuario:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener progreso de un estudiante
  obtenerProgresoEstudiante: async (programaId, usuarioId) => {
    try {
      const response = await axios.get(`${API_URL}/${programaId}/progreso/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas de programas técnicos
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
