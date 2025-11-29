const API_URL = "http://localhost:3000/api/solicitudes";

// Funciones auxiliares para evitar duplicación
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

const fetchWithErrorHandling = async (url, options, errorMessage) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(errorMessage || `Error en la solicitud: ${res.statusText}`);
  return await res.json();
};

export const solicitudService = {
  getAll: async () => {
    return await fetchWithErrorHandling(API_URL, {
      headers: getAuthHeaders()
    }, "Error al obtener solicitudes en services");
  },

  create: async (solicitud) => {
    // Limpiar datos antes de enviar
    const solicitudLimpia = { ...solicitud };
    
    // Remover responsable si está vacío (se asigna automáticamente en el backend)
    if (!solicitudLimpia.responsable || solicitudLimpia.responsable === "") {
      delete solicitudLimpia.responsable;
    }
    
    // Generar título automático si no existe
    if (!solicitudLimpia.titulo || solicitudLimpia.titulo.trim() === "") {
      solicitudLimpia.titulo = `Solicitud de ${solicitudLimpia.tipoSolicitud} - ${new Date().toLocaleDateString()}`;
    }
    
    return await fetchWithErrorHandling(API_URL, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(solicitudLimpia)
    });
  },

  update: async (id, solicitud) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getJsonHeaders(),
      body: JSON.stringify(solicitud)
    });
  },

  delete: async (id) => {
    return await fetchWithErrorHandling(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
  },

  // Obtener solicitudes por usuario
  getSolicitudesPorUsuario: async (userId) => {
    return await fetchWithErrorHandling(`${API_URL}/usuario/${userId}`, {
      headers: getAuthHeaders()
    }, "Error al obtener solicitudes por usuario");
  },

  getEstadisticasGenerales: async () => {
    return await fetchWithErrorHandling(`${API_URL}/estadisticas`, {
      headers: getAuthHeaders()
    }, "Error al obtener estadísticas generales de solicitudes");
  }
};