const API_URL = "http://localhost:3000/api/eventos";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const fetchWithErrorHandling = async (url, options) => {
  // Evitar respuestas 304/304 cacheadas en desarrollo forzando no-cache
  const fetchOptions = { cache: 'no-cache', ...options };
  const res = await fetch(url, fetchOptions);

  // Si la respuesta no tiene cuerpo (204 No Content) o no fue modificada (304), devolver null
  if (res.status === 204 || res.status === 304) return null;

  let json = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    json = await res.json();
  }

  if (!res.ok) {
    const message = (json && json.message) || res.statusText || 'Error en la solicitud';
    throw new Error(message);
  }

  // Si la API responde con la estructura { success: true, data: [...] }, retornar data directamente
  if (json && typeof json === 'object' && Object.hasOwn(json, 'data')) {
    return json.data;
  }

  return json;
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