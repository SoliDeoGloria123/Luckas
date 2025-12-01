import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Crear una instancia de Axios SIN interceptores para autenticación
// Esto previene que el interceptor global redirija cuando hay error 401 en login
const authAxios = axios.create({
  baseURL: API_BASE_URL
});

//registro de usuario
export const signupService = {
  signup: async (formData) => {
    const res = await authAxios.post('/auth/signup', formData);
    return res.data;
  },
};

// inicio de sesion
export const authService = {
  login: async (correo, password) => {
    try {

      const response = await authAxios.post('/auth/signin', {
        correo,
        password,
      });

      return response.data;

    } catch (error) {
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
    const response = await authAxios.post('/auth/forgot-password', { correo });
    return response.data;
  },
};

// Verificar código de recuperación sin cambiar la contraseña
export const verificarCodigoService = {
  verificarCodigo: async (correo, code) => {
    const response = await authAxios.post('/auth/verify-reset-code', { correo, code });
    return response.data;
  }
};

//cambiar contraseña
export const cambiarContraseñaService = {
  cambiarContraseña: async (resetToken, newPassword) => {
    const response = await authAxios.post('/auth/reset-password', {
      resetToken,
      newPassword
    });
    return response.data;
  }
}
