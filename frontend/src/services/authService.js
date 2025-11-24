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
    
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        correo,
        password,
      });
  
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

// Verificar código de recuperación sin cambiar la contraseña
export const verificarCodigoService = {
  verificarCodigo: async (correo, code) => {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-reset-code`, { correo, code });
    return response.data;
  }
};

//cambiar contraseña
export const cambiarContraseñaService = {
  cambiarContraseña: async (resetToken, newPassword) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      resetToken,
      newPassword
    });
    return response.data;
  }
}
