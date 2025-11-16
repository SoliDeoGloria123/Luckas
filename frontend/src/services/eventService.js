const API_URL = "http://localhost:3000/api/eventos";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

const fetchWithErrorHandling = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);
  return await res.json();
};

export const eventService = {
  // Obtener todos los eventos
  getAllEvents: async () => {
    return await fetchWithErrorHandling(API_URL, {
      headers: getHeaders()
    });
  },

  // Obtener evento por ID
  getEventById: async (id) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}`, {
      headers: getHeaders()
    });
  },

  // Crear nuevo evento
  createEvent: async (eventData, isFormData = false) => {
    const headers = isFormData ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : getHeaders();
    const body = isFormData ? eventData : JSON.stringify(eventData);

    return await fetchWithErrorHandling(API_URL, {
      method: "POST",
      headers,
      body
    });
  },

  // Actualizar evento
  updateEvent: async (id, eventData, isFormData = false) => {
    const headers = isFormData ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : getHeaders();
    const body = isFormData ? eventData : JSON.stringify(eventData);

    return await fetchWithErrorHandling(`${API_URL}/${id}`, {
      method: "PUT",
      headers,
      body
    });
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  },

  // Deshabilitar evento
  disableEvent: async (id) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}/disable`, {
      method: "PATCH",
      headers: getHeaders()
    });
  },

  // Categorizar evento
  categorizarEvento: async (id, categoriaData) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}/categorizar`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(categoriaData)
    });
  },

  // Obtener eventos por categoría
  getEventosPorCategoria: async (categoria) => {
    const url = categoria ? `${API_URL}?categoria=${categoria}` : API_URL;
    return await fetchWithErrorHandling(url, {
      headers: getHeaders()
    });
  },

  // Obtener estadísticas generales
  getEstadisticasGenerales: async () => {
    return await fetchWithErrorHandling(`${API_URL}/estadisticas`, {
      headers: getHeaders()
    });
  }
};