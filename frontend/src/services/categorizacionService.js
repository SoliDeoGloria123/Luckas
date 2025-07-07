const API_URL = "http://localhost:3000/api/categorizacion";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-access-token": localStorage.getItem("token")
});

export const categorizacionService = {
  // Obtener todas las categorías
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener categoría");
    return await res.json();
  },

  // Crear nueva categoría
  create: async (categoriaData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(categoriaData)
    });
    if (!res.ok) throw new Error("Error al crear categoría");
    return await res.json();
  },

  // Actualizar categoría
  update: async (id, categoriaData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(categoriaData)
    });
    if (!res.ok) throw new Error("Error al actualizar categoría");
    return await res.json();
  },

  // Eliminar categoría
  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al eliminar categoría");
    return await res.json();
  }
};
