import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/certificados';

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
export const generarCertificado = async (userId, cursoId) => {
    try {
        const response = await axios.post(
            `${API_URL}/generar`,
            { userId, cursoId },
            { responseType: 'blob' }
        );
        return response.data; // Esto será el blob del PDF
    } catch (error) {
        console.error('Error generando certificado:', error);
        throw error;
    }
};
