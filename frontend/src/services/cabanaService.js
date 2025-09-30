const API_URL = "http://localhost:3000/api/cabanas";

export const cabanaService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener cabañas");
    return await res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener la cabaña");
    return await res.json();
  },

  create: async (cabana) => {
    // Si es FormData (para imágenes), no agregamos Content-Type
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    // Solo agregar Content-Type si no es FormData
    if (!(cabana instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: cabana instanceof FormData ? cabana : JSON.stringify(cabana),
    });
    if (!res.ok) throw new Error("Error al crear cabaña");
    return await res.json();
  },

  update: async (id, cabana) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cabana),
    });
    if (!res.ok) throw new Error("Error al actualizar cabaña");
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar cabaña");
    return await res.json();
  },
};