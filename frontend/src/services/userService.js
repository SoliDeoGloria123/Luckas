const API_BASE_URL = "http://localhost:3000/api";

const getAuthToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la petición");
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

export const userService = {
  getAllUsers: () => apiRequest("/users"),
  createUser: (userData) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  updateUser: (userId, userData) =>
    apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (userId) =>
    apiRequest(`/users/${userId}`, {
      method: "DELETE",
    }),

    
};