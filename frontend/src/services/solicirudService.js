const API_URL = "http://localhost:3000/api/solicitudes";

export const solicitudService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener solicitudes en services");
    return await res.json();
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
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(solicitudLimpia)
    });
    return await res.json();
  },
  update: async (id, solicitud) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(solicitud)
    });
    return await res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return await res.json();
  },

  // Obtener solicitudes por usuario
   getSolicitudesPorUsuario: async (userId) => {
    const res = await fetch(`${API_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener solicitudes por usuario");
    return await res.json();
  }
};