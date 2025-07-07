const API_URL = "http://localhost:3000/api/cabanas";

export const cabanaService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Error al obtener cabañas");
    return await res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Error al obtener la cabaña");
    return await res.json();
  },

  create: async (cabana) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(cabana),
    });
    if (!res.ok) throw new Error("Error al crear cabaña");
    return await res.json();
  },

  update: async (id, cabana) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
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
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Error al eliminar cabaña");
    return await res.json();
  },
};