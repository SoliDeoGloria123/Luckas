import BaseService from './BaseService';

const API_URL = "http://localhost:3000/api/categorizacion";

// Crear instancia del servicio base
const baseService = new BaseService(API_URL, 'categoría');

export const categorizacionService = {
  // Operaciones CRUD básicas usando BaseService
  getAll: () => baseService.getAll(),
  getById: (id) => baseService.getById(id),
  create: (categoriaData) => baseService.create(categoriaData),
  update: (id, categoriaData) => baseService.update(id, categoriaData),
  delete: (id) => baseService.delete(id),

  // Métodos específicos de categorización
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
