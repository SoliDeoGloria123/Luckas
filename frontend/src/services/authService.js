import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

//registro de usuario
export const signupService = {
  signup : async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
    return res.data;
  },
};

// inicio de sesion
export const authService = {
  login: async (correo, password) => {
    try {
      console.log('🚀 Enviando petición de login:', { correo, url: `${API_BASE_URL}/auth/signin` });
      
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        correo,
        password,
      });
      
      console.log('✅ Respuesta del servidor:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      
      // Lanzar un Error con información adicional
      const customError = new Error(error.response?.data?.message || 'Error de conexión');
      customError.status = error.response?.status || 500;
      customError.data = error.response?.data;
      throw customError;
    }
  },
};
// envio de codigo de recuperacion
export const enviarCodigoRecuperacion = {
  enviarCodigo: async (correo) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { correo });
    return response.data;
  },
};

//cambiar contraseña
export const cambiarContraseñaService = {
  cambiarContraseña: async (correo, code, newPassword) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      correo,
      code,
      newPassword
    });
    return response.data;
  }
}
