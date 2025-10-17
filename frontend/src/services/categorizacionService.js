const API_URL = "http://localhost:3000/api/categorizacion";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const categorizacionService = {
  // Obtener todas las categorías
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al eliminar categoría");
    return await res.json();
  },

  //Activar o desactivar categoría
  toggleActivation: async (id, estado) => {
    const res = await fetch(`${API_URL}/toggle-activation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ estado })
    });
    if (!res.ok) throw new Error("Error al cambiar estado de categoría");
    return await res.json();
  },
  //Estadisticas de categorías
getStats: async () => {
  const res = await fetch(`${API_URL}/estadistica`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  if (!res.ok) throw new Error("Error al obtener estadísticas de categorías");
  const data = await res.json();
  return data.stats; // <-- Devuelve solo el objeto stats
}
};
