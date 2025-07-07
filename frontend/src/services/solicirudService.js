const API_URL = "http://localhost:3000/api/solicitudes";

export const solicitudService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener solicitudes en services");
    return await res.json();
  },
  create: async (solicitud) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(solicitud)
    });
    return await res.json();
  },
  update: async (id, solicitud) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(solicitud)
    });
    return await res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    return await res.json();
  }
};