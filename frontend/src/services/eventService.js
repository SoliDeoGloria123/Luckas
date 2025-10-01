const API_URL = "http://localhost:3000/api/eventos";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const eventService = {
  // Obtener todos los eventos
  getAllEvents: async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener eventos");
    return await res.json();
  },

  // Obtener evento por ID
  getEventById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener evento");
    return await res.json();
  },

  // Crear nuevo evento
  createEvent: async (eventData, isFormData = false) => {
    const headers = isFormData 
      ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
      : getHeaders();
    
    const body = isFormData ? eventData : JSON.stringify(eventData);
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body
    });
    if (!res.ok) throw new Error("Error al crear evento");
    return await res.json();
  },

  // Actualizar evento
  updateEvent: async (id, eventData, isFormData = false) => {
    const headers = isFormData 
      ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
      : getHeaders();
    
    const body = isFormData ? eventData : JSON.stringify(eventData);
    
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers,
      body
    });
    if (!res.ok) throw new Error("Error al actualizar evento");
    return await res.json();
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al eliminar evento");
    return await res.json();
  },

  // Deshabilitar evento
  disableEvent: async (id) => {
    const res = await fetch(`${API_URL}/${id}/disable`, {
      method: "PATCH",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al deshabilitar evento");
    return await res.json();
  },

  // Categorizar evento
  categorizarEvento: async (id, categoriaData) => {
    const res = await fetch(`${API_URL}/${id}/categorizar`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(categoriaData)
    });
    if (!res.ok) throw new Error("Error al categorizar evento");
    return await res.json();
  },

  // Obtener eventos por categoría
  getEventosPorCategoria: async (categoria) => {
    const url = categoria ? `${API_URL}?categoria=${categoria}` : API_URL;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener eventos por categoría");
    return await res.json();
  }
};