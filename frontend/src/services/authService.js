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
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
      correo,
      password,
    });
    return response.data;
  },
};
